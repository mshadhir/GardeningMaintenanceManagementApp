'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSiteById } from '@/data/repositories/siteRepository';
import { siteHealthColor, siteHealthCopy } from '@/lib/format';
import { sampleSites } from '@/lib/sampleData';
import { Site } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function SiteDetailPage() {
  const params = useParams<{ siteId: string }>();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    async function fetchSite() {
      setLoading(true);
      try {
        const record = await getSiteById(params.siteId);
        if (record) {
          setSite(record);
          setUsingSample(false);
          setError(null);
        } else {
          const fallback = sampleSites.find((s) => s.id === params.siteId) ?? null;
          setSite(fallback);
          setUsingSample(Boolean(fallback));
          setError('Site not found in Firestore.');
        }
      } catch (err) {
        console.error('Failed to fetch site from Firestore', err);
        const fallback = sampleSites.find((s) => s.id === params.siteId) ?? null;
        setSite(fallback);
        setUsingSample(Boolean(fallback));
        setError('Unable to load site from Firestore. Showing sample data when available.');
      } finally {
        setLoading(false);
      }
    }

    void fetchSite();
  }, [params.siteId]);

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      {loading ? (
        <Card className="space-y-4">
          <CardHeader title="Loading site..." subtitle="Fetching details" />
          <p className="text-sm text-gray-600">Please wait while we load the site details.</p>
        </Card>
      ) : !site ? (
        <Card className="space-y-4">
          <CardHeader title="Site unavailable" subtitle="No record found" />
          <p className="text-sm text-gray-600">We couldn’t find this site. It may have been removed.</p>
          <Link href="/sites" className="text-brand-700 hover:text-brand-800">
            Return to sites
          </Link>
        </Card>
      ) : (
        <>
          {error ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          ) : null}
          {usingSample ? (
            <div className="rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Showing sample data while Firestore is unavailable.
            </div>
          ) : null}

          <Card className="space-y-4">
            <CardHeader title={site.name} subtitle="Site overview" />
            <div className="flex flex-wrap gap-2">
              <Badge color={siteHealthColor[site.status]}>{siteHealthCopy[site.status]}</Badge>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {site.serviceFrequency}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4" />
                {site.address}
                {site.city ? ` · ${site.city}` : ''}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-6 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</dt>
                <dd className="text-sm font-semibold text-gray-900">{site.contactName}</dd>
                <dd className="inline-flex items-center gap-1 text-sm text-gray-700">
                  <PhoneIcon className="h-4 w-4" />
                  {site.contactPhone}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next visit</dt>
                <dd className="text-sm text-gray-900">{site.nextVisit || 'Not scheduled'}</dd>
                <dd className="text-xs text-gray-600">{site.activeTasks} open tasks</dd>
              </div>
            </dl>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
              <p className="mt-2 rounded-md border border-gray-100 bg-white p-3 text-sm text-gray-700">{site.notes}</p>
            </div>

            <Link
              href="/sites"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View all sites
            </Link>
          </Card>
        </>
      )}
    </main>
  );
}
