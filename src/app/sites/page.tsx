'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SiteCard } from '@/components/sites/SiteCard';
import { getSites } from '@/data/repositories/siteRepository';
import type { Site } from '@/lib/types';

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSites();
        setSites(data);
      } catch (err) {
        console.error('Failed to fetch sites', err);
        setError('Unable to load sites. Please ensure Firestore is configured.');
      } finally {
        setLoading(false);
      }
    };

    void fetchSites();
  }, []);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Sites</p>
          <h1 className="text-2xl font-semibold text-gray-900">Property portfolio</h1>
          <p className="text-sm text-gray-600">View and manage all properties your teams service.</p>
        </div>
        <Link href="/sites/new">
          <Button type="button">Add site</Button>
        </Link>
      </header>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {loading ? (
        <Card className="p-4">
          <p className="text-sm text-gray-600">Loading sites…</p>
        </Card>
      ) : null}

      {!loading && sites.length === 0 ? (
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No sites yet</h2>
          <p className="mt-2 text-sm text-gray-600">Get started by adding your first site.</p>
          <Link href="/sites/new" className="mt-4 inline-flex justify-center">
            <Button type="button">Add a site</Button>
          </Link>
        </Card>
      ) : null}

      {!loading && sites.length > 0 ? (
        <div className="space-y-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : null}
    </main>
  );
}
