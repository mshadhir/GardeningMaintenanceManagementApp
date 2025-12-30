import { getSites } from '@/data/repositories/siteRepository';
import { SiteCard } from '@/features/sites/SiteCard';
import type { Site } from '@/lib/types';
import Link from 'next/link';

export const revalidate = 0;

export default async function SitesPage() {
  const sites: Site[] = await getSites();

  if (!sites.length) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">Sites</p>
            <h1 className="text-3xl font-bold text-gray-900">Manage properties</h1>
            <p className="text-sm text-gray-600">Add and track gardening sites across your portfolio.</p>
          </div>
          <Link
            href="/sites/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Add site
          </Link>
        </div>
        <div className="mt-10 rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600">
          <p className="text-lg font-semibold text-gray-900">No sites yet</p>
          <p className="mt-2 text-sm text-gray-600">Create your first site to start scheduling work.</p>
          <Link
            href="/sites/new"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Create site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">Sites</p>
          <h1 className="text-3xl font-bold text-gray-900">Manage properties</h1>
          <p className="text-sm text-gray-600">Add and track gardening sites across your portfolio.</p>
        </div>
        <Link
          href="/sites/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Add site
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} href={`/sites/${site.id}`} />
        ))}
      </div>
    </main>
  );
}
