'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, GhostButton } from '@/components/ui/Button';
import { getSiteById } from '@/data/repositories/siteRepository';
import { getVisitLogsBySite, logVisit } from '@/data/repositories/visitLogRepository';
import { siteHealthColor, siteHealthCopy } from '@/lib/format';
import { isFirebaseConfigured } from '@/lib/firebase';
import { sampleSites, sampleVisitLogs } from '@/lib/sampleData';
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
  const [site, setSite] = useState<Site | null>(() => sampleSites.find((item) => item.id === siteId) ?? null);
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>(() =>
    sampleVisitLogs.filter((log) => log.siteId === siteId).sort((a, b) => b.visitDate.localeCompare(a.visitDate))
  );
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function hydrateFromFirestore() {
      if (!siteId || !isFirebaseConfigured) return;
      setLoading(true);
      try {
        const [remoteSite, remoteVisitLogs] = await Promise.all([getSiteById(siteId), getVisitLogsBySite(siteId)]);
        setSite(remoteSite ?? null);
        setVisitLogs(
          (remoteVisitLogs.length ? remoteVisitLogs : sampleVisitLogs.filter((log) => log.siteId === siteId)).sort(
            (a, b) => b.visitDate.localeCompare(a.visitDate)
          )
        );
      } catch (error) {
        console.warn('Falling back to sample data after Firestore read error', error);
        setSite(sampleSites.find((item) => item.id === siteId) ?? null);
        setVisitLogs(sampleVisitLogs.filter((log) => log.siteId === siteId).sort((a, b) => b.visitDate.localeCompare(a.visitDate)));
      } finally {
        setLoading(false);
      }
    }

    void hydrateFromFirestore();
  }, [siteId]);

  const handleCreateVisitLog = async (formState: VisitLogFormState) => {
    if (!siteId) return;
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

      const persistedLog = isFirebaseConfigured ? await logVisit(newLogInput) : { ...newLogInput, id: crypto.randomUUID() };
      setVisitLogs((prev) => [persistedLog, ...prev].sort((a, b) => b.visitDate.localeCompare(a.visitDate)));
      setShowForm(false);
    } catch (error) {
      console.error('Failed to log visit', error);
    } finally {
      setSaving(false);
    }
  };

  const sortedVisitLogs = useMemo(() => [...visitLogs].sort((a, b) => b.visitDate.localeCompare(a.visitDate)), [visitLogs]);

  if (!siteId) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-gray-600">Site not found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand-700">Site overview</p>
          <h1 className="text-2xl font-semibold text-gray-900">{site?.name ?? 'Loading site...'}</h1>
          {site ? (
            <p className="mt-2 text-sm text-gray-600">
              {site.address}, {site.city} • Manager: {site.manager} • Phone: {site.phone}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {site ? <Badge color={siteHealthColor[site.status]}>{siteHealthCopy[site.status]}</Badge> : null}
          <GhostButton type="button" onClick={() => router.push('/')}>
            Back to dashboard
          </GhostButton>
        </div>
      </div>

      <Card className="space-y-4">
        <CardHeader
          title="Visit history"
          subtitle={loading ? 'Loading visit logs...' : 'Recent visits and notes'}
          action={
            <Button type="button" onClick={() => setShowForm(true)}>
              Add visit log
            </Button>
          }
        />
        {sortedVisitLogs.length === 0 ? (
          <p className="text-sm text-gray-600">No visits logged yet. Start by adding the first visit log.</p>
        ) : (
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
        )}
        <p className="text-xs text-gray-500">
          Connected to Firestore when environment variables are set. Visit logs are stored under the <code>visitLogs</code>{' '}
          collection.
        </p>
      </Card>

      {showForm ? (
        <VisitLogDialog
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateVisitLog}
          loading={saving}
          defaultDate={site?.nextVisit}
        />
      ) : null}
    </main>
  );
}

function VisitLogDialog({
  onClose,
  onSubmit,
  loading,
  defaultDate
}: {
  onClose: () => void;
  onSubmit: (form: VisitLogFormState) => Promise<void>;
  loading: boolean;
  defaultDate?: string;
}) {
  const [formState, setFormState] = useState<VisitLogFormState>({
    visitDate: defaultDate ?? '',
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
          <GhostButton type="button" onClick={onClose}>
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
            <GhostButton type="button" onClick={onClose}>
              Cancel
            </GhostButton>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save visit log'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
