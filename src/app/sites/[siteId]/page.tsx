'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, GhostButton } from '@/components/ui/Button';
import { getSiteById } from '@/data/repositories/siteRepository';
import { getVisitLogsBySite, logVisit } from '@/data/repositories/visitLogRepository';
import { serviceFrequencyCopy, siteHealthColor, siteHealthCopy } from '@/lib/format';
import { isFirebaseConfigured } from '@/lib/firebase';
import type { Site, VisitLog } from '@/lib/types';
import { useUploadToStorage } from '@/hooks/useUploadToStorage';

interface VisitLogFormState {
  visitDate: string;
  completedTasks: string;
  notes: string;
  photos: File[];
}

export default function SiteDetailPage() {
  const params = useParams<{ siteId: string }>();
  const router = useRouter();
  const siteId = params?.siteId;
  const { uploadFiles } = useUploadToStorage();

  const [site, setSite] = useState<Site | null>(null);
  const [siteLoading, setSiteLoading] = useState<boolean>(true);
  const [siteError, setSiteError] = useState<string | null>(null);

  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);
  const [visitLoading, setVisitLoading] = useState<boolean>(isFirebaseConfigured);
  const [visitError, setVisitError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!siteId) {
      setSiteError('Site not found.');
      setSiteLoading(false);
      return;
    }

    const fetchSite = async () => {
      setSiteLoading(true);
      setSiteError(null);
      try {
        const data = await getSiteById(siteId);
        if (!data) {
          setSiteError('Site not found.');
          setSite(null);
          return;
        }
        setSite(data);
      } catch (error) {
        console.error('Failed to load site', error);
        setSiteError('Unable to load site. Please confirm Firestore configuration.');
      } finally {
        setSiteLoading(false);
      }
    };

    void fetchSite();
  }, [siteId]);

  useEffect(() => {
    if (!siteId) return;
    if (!isFirebaseConfigured) {
      setVisitLoading(false);
      setVisitError('Visit logging requires Firestore configuration.');
      return;
    }

    const fetchVisitLogs = async () => {
      setVisitLoading(true);
      setVisitError(null);
      try {
        const logs = await getVisitLogsBySite(siteId);
        setVisitLogs(logs);
      } catch (error) {
        console.error('Failed to load visit logs', error);
        setVisitError('Unable to load visit history.');
      } finally {
        setVisitLoading(false);
      }
    };

    void fetchVisitLogs();
  }, [siteId]);

  const handleCreateVisitLog = async (formState: VisitLogFormState) => {
    if (!siteId) return;
    if (!isFirebaseConfigured) {
      setVisitError('Visit logging requires Firestore configuration.');
      return;
    }

    setSaving(true);
    try {
      const completedTasks = formState.completedTasks
        .split(/[\n,]/)
        .map((task) => task.trim())
        .filter(Boolean);
      const photos = formState.photos.length ? await uploadFiles(formState.photos) : [];

      const newLogInput: Omit<VisitLog, 'id'> = {
        siteId,
        visitDate: formState.visitDate,
        completedTasks,
        notes: formState.notes || undefined,
        photos
      };

      const persistedLog = await logVisit(newLogInput);
      setVisitLogs((prev) => [persistedLog, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to log visit', error);
      setVisitError('Unable to save visit log. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sortedVisitLogs = useMemo(
    () => [...visitLogs].sort((a, b) => b.visitDate.localeCompare(a.visitDate)),
    [visitLogs]
  );
  const frequencyLabel = site?.serviceFrequency ? serviceFrequencyCopy[site.serviceFrequency] : 'Unspecified';

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Site</p>
          <h1 className="text-2xl font-semibold text-gray-900">{site?.name ?? 'Site details'}</h1>
          {site?.address ? <p className="mt-2 text-sm text-gray-600">{site.address}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          {site ? (
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800 ring-1 ring-gray-200">
              {frequencyLabel}
            </span>
          ) : null}
          {site?.status ? <Badge color={siteHealthColor[site.status]}>{siteHealthCopy[site.status]}</Badge> : null}
          <GhostButton type="button" onClick={() => router.push('/sites')}>
            Back to sites
          </GhostButton>
        </div>
      </div>

      {siteError ? <p className="text-sm text-rose-600">{siteError}</p> : null}

      <Card className="space-y-4">
        <CardHeader title="Site details" subtitle="Overview and notes" />
        {siteLoading ? <p className="text-sm text-gray-600">Loading site details…</p> : null}
        {!siteLoading && site ? (
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Address:</span> {site.address}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Service frequency:</span> {frequencyLabel}
            </p>
            {site.notes ? (
              <p>
                <span className="font-semibold text-gray-900">Notes:</span> {site.notes}
              </p>
            ) : (
              <p className="text-gray-600">No notes added yet.</p>
            )}
          </div>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <CardHeader title="Tasks" subtitle="Tasks for this site will appear here" />
        <p className="text-sm text-gray-600">Task management is coming soon.</p>
      </Card>

      <Card className="space-y-4">
        <CardHeader
          title="Visit history"
          subtitle={visitLoading ? 'Loading visit logs…' : 'Record completed visits and notes'}
          action={
            <Button type="button" onClick={() => setShowForm(true)} disabled={!site || visitLoading || !isFirebaseConfigured}>
              Add visit log
            </Button>
          }
        />
        {visitError ? <p className="text-sm text-rose-600">{visitError}</p> : null}
        {!visitLoading && sortedVisitLogs.length === 0 ? (
          <p className="text-sm text-gray-600">No visits logged yet.</p>
        ) : null}
        {!visitLoading && sortedVisitLogs.length > 0 ? (
          <ul className="space-y-3">
            {sortedVisitLogs.map((log) => (
              <li key={log.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Visited on {log.visitDate}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <p className="font-medium text-gray-800">Completed tasks:</p>
                      <ul className="list-disc pl-5">
                        {log.completedTasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                      {log.notes ? <p className="mt-2 text-gray-600">Notes: {log.notes}</p> : null}
                      {log.photos?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {log.photos.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
                            >
                              📷 Photo
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <Badge color="blue">Site ID: {log.siteId}</Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-xs text-gray-500">
          Visit logging uses the <code>visitLogs</code> collection in Firestore. Ensure environment variables are configured before
          logging visits.
        </p>
      </Card>

      {showForm && site ? (
        <VisitLogDialog onClose={() => setShowForm(false)} onSubmit={handleCreateVisitLog} loading={saving} />
      ) : null}
    </main>
  );
}

function VisitLogDialog({
  onClose,
  onSubmit,
  loading
}: {
  onClose: () => void;
  onSubmit: (form: VisitLogFormState) => Promise<void>;
  loading: boolean;
}) {
  const [formState, setFormState] = useState<VisitLogFormState>({
    visitDate: '',
    completedTasks: '',
    notes: '',
    photos: []
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">New visit log</p>
            <h2 className="text-lg font-semibold text-gray-900">Record a visit</h2>
          </div>
          <GhostButton type="button" onClick={onClose} disabled={loading}>
            Cancel
          </GhostButton>
        </div>

        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(formState);
          }}
        >
          <label className="block text-sm font-medium text-gray-700">
            Visit date
            <input
              required
              type="date"
              value={formState.visitDate}
              onChange={(event) => setFormState((prev) => ({ ...prev, visitDate: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Completed tasks (comma or newline separated)
            <textarea
              required
              value={formState.completedTasks}
              onChange={(event) => setFormState((prev) => ({ ...prev, completedTasks: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={3}
              placeholder="Seasonal pruning, Mulch refresh"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Notes (optional)
            <textarea
              value={formState.notes}
              onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={2}
              placeholder="Observations, follow-ups, issues"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Photos (optional)
            <input
              multiple
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-700"
              onChange={(event) => setFormState((prev) => ({ ...prev, photos: Array.from(event.target.files ?? []) }))}
            />
            <p className="mt-1 text-xs text-gray-500">Uploads are stubbed; URLs will be generated for now.</p>
          </label>

          <div className="flex justify-end gap-3">
            <GhostButton type="button" onClick={onClose} disabled={loading}>
              Cancel
            </GhostButton>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save visit log'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
