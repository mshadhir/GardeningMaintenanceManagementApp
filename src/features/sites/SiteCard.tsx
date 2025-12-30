import Link from 'next/link';
import type { SiteCardProps } from './types';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

const frequencyCopy: Record<NonNullable<SiteCardProps['site']['serviceFrequency']>, string> = {
  weekly: 'Weekly',
  fortnightly: 'Fortnightly',
  monthly: 'Monthly',
};

export function SiteCard({ site, href }: SiteCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand-700">{site.name}</p>
          <p className="mt-1 text-sm text-gray-700 flex items-center gap-1">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            {site.address}
          </p>
          {site.serviceFrequency ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
              <CalendarIcon className="h-4 w-4 text-brand-600" />
              {frequencyCopy[site.serviceFrequency]}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
