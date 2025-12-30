import { notFound } from 'next/navigation';
import { getSiteById } from '@/data/repositories/siteRepository';
import type { Site } from '@/lib/types';
import Link from 'next/link';

export const revalidate = 0;

export default async function SiteDetailPage({ params }: { params: { siteId: string } }) {
  const site: Site | null = await getSiteById(params.siteId);

  if (!site) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-700">Site</p>
          <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
          <p className="mt-1 text-sm text-gray-600">{site.address}</p>
        </div>
        <Link
          href="/sites"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back to sites
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="text-sm text-gray-900">{site.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Service frequency</dt>
            <dd className="text-sm text-gray-900 capitalize">{site.serviceFrequency ?? 'Not set'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="text-sm text-gray-900">{site.notes ?? 'No notes yet.'}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Coming soon</p>
        </div>
        <p className="mt-2 text-sm text-gray-600">Task management for this site will appear here.</p>
      </section>
    </main>
  );
}
