'use client';

import { Badge } from '@/components/ui/Badge';
import { Card, CardFooter, CardHeader } from '@/components/ui/Card';
import { GhostButton } from '@/components/ui/Button';
import { serviceFrequencyCopy, siteHealthColor, siteHealthCopy } from '@/lib/format';
import { Site } from '@/lib/types';
import Link from 'next/link';
import { PhoneIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface SiteListProps {
  sites: Site[];
  onSelect?: (site: Site) => void;
}

export function SiteList({ sites, onSelect }: SiteListProps) {
  return (
    <Card className="p-4">
      <CardHeader title="Sites" subtitle="Active properties" action={<GhostButton type="button">Add site</GhostButton>} />
      <ul className="mt-4 space-y-3">
        {sites.map((site) => (
          <li key={site.id} className="rounded-lg border border-gray-100 p-3 hover:border-brand-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-gray-900">{site.name}</h4>
                <p className="text-sm text-gray-600">{site.address}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                  {site.city ? (
                    <span className="inline-flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{site.city}</span>
                  ) : null}
                  {site.phone ? (
                    <span className="inline-flex items-center gap-1"><PhoneIcon className="h-4 w-4" />{site.phone}</span>
                  ) : null}
                  {site.nextVisit ? (
                    <span className="inline-flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4" />Next visit: {site.nextVisit}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4" />Next visit: Not scheduled</span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    Service: {serviceFrequencyCopy[site.serviceFrequency] ?? 'Unspecified'}
                  </span>
                </div>
                {site.notes ? <p className="mt-2 text-sm text-gray-500">{site.notes}</p> : null}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge color={siteHealthColor[site.status ?? 'on_track']}>{siteHealthCopy[site.status ?? 'on_track']}</Badge>
                <p className="text-sm text-gray-500">{site.activeTasks ?? 0} open tasks</p>
                {onSelect ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                    onClick={() => onSelect(site)}
                  >
                    Focus on map
                  </button>
                ) : null}
                <Link href={`/sites/${site.id}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                  View site
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <CardFooter>
        <p className="text-sm text-gray-500">Connected to Firestore when environment variables are set.</p>
      </CardFooter>
    </Card>
  );
}
