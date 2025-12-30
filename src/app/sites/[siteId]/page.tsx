'use client';

import { MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { SiteTasksSection } from '@/features/tasks/SiteTasksSection';
import { sampleSites } from '@/lib/sampleData';

export default function SiteTasksPage() {
  const params = useParams();
  const siteIdParam = params?.siteId;
  const siteId = Array.isArray(siteIdParam) ? siteIdParam[0] : siteIdParam;

  const site = useMemo(() => sampleSites.find((candidate) => candidate.id === siteId), [siteId]);

  if (!siteId) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          A site ID is required to view tasks.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <p className="text-sm font-medium text-brand-700">Site tasks</p>
        <h1 className="text-3xl font-semibold text-gray-900">{site?.name ?? 'Site details'}</h1>
        <p className="text-sm text-gray-600">Viewing task checklist for site ID: {siteId}</p>
      </header>

      {site ? (
        <Card>
          <div className="space-y-2">
            <p className="text-base font-semibold text-gray-900">Site overview</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {site.address}, {site.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                Manager: {site.manager}
              </span>
              <span className="inline-flex items-center gap-1">
                <PhoneIcon className="h-4 w-4" />
                {site.phone}
              </span>
            </div>
          </div>
        </Card>
      ) : null}

      <SiteTasksSection siteId={siteId} siteName={site?.name} />
    </main>
  );
}
