'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getSites } from '@/data/repositories/siteRepository';
import { siteHealthColor, siteHealthCopy } from '@/lib/format';
import { sampleSites } from '@/lib/sampleData';
import { Site } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { ChevronRightIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingSample, setUsingSample] = useState(false);

  useEffect(() => {
    async function fetchSites() {
      setLoading(true);
      try {
        const fetched = await getSites();
        setSites(fetched);
        setError(null);
        setUsingSample(false);
      } catch (err) {
        console.error('Failed to fetch sites from Firestore', err);
        setError('Unable to load sites from Firestore. Showing sample data instead.');
        setSites(sampleSites);
        setUsingSample(true);
      } finally {
        setLoading(false);
      }
    }

    void fetchSites();
  }, []);

  const subtitle = useMemo(() => {
    if (loading) return 'Loading sites...';
    if (sites.length === 0) return 'No sites available';
    return `${sites.length} site${sites.length === 1 ? '' : 's'}`;
  }, [loading, sites.length]);

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Properties</p>
          <h1 className="text-3xl font-semibold text-gray-900">Sites directory</h1>
          <p className="text-sm text-gray-600">View and manage service details for each property.</p>
        </div>
        <Link
          href="/sites/new"
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Add new site
        </Link>
      </header>

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
        <CardHeader title="Sites" subtitle={subtitle} />
        {loading ? (
          <div className="flex items-center justify-center rounded-md border border-dashed border-gray-200 py-10 text-sm text-gray-600">
            Loading sites...
          </div>
        ) : sites.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-sm text-gray-700">
            <p className="font-semibold">No sites yet</p>
            <p className="text-gray-600">Add your first property to start tracking visits and service notes.</p>
            <Link href="/sites/new" className="text-brand-700 hover:text-brand-800">
              Create a site
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sites.map((site) => (
              <li key={site.id} className="py-4">
                <Link href={`/sites/${site.id}`} className="group block rounded-lg p-2 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{site.name}</h3>
                        <Badge color={siteHealthColor[site.status]}>{siteHealthCopy[site.status]}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {site.address}
                        {site.city ? ` · ${site.city}` : ''}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          {site.contactName} ({site.contactPhone})
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {site.serviceFrequency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{site.notes}</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 transition group-hover:text-gray-500" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
