import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { serviceFrequencyCopy, siteHealthColor, siteHealthCopy } from '@/lib/format';
import type { Site } from '@/lib/types';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const status = site.status ?? 'on_track';
  const frequencyLabel = serviceFrequencyCopy[site.serviceFrequency] ?? 'Unspecified';

  return (
    <Link href={`/sites/${site.id}`} className="block">
      <Card className="transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{site.address}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
              {site.city ? (
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {site.city}
                </span>
              ) : null}
              {site.nextVisit ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  Next visit: {site.nextVisit}
                </span>
              ) : null}
            </div>
            {site.notes ? <p className="mt-2 text-sm text-gray-500">{site.notes}</p> : null}
          </div>
          <div className="flex flex-col items-end gap-2 text-sm">
            <span className="rounded-full bg-white px-3 py-1 text-gray-800 ring-1 ring-gray-200">
              {frequencyLabel}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${siteHealthColor[status]}`}>
              {siteHealthCopy[status]}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
