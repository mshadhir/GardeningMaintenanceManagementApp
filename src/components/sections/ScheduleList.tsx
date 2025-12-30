import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScheduleItem, Site } from '@/lib/types';
import { MapPinIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ScheduleListProps {
  schedule: ScheduleItem[];
  sites: Site[];
}

export function ScheduleList({ schedule, sites }: ScheduleListProps) {
  return (
    <Card className="p-4">
      <CardHeader title="Schedule" subtitle="Upcoming site visits" />
      <ul className="mt-4 space-y-3">
        {schedule.map((item) => {
          const site = sites.find((s) => s.id === item.siteId);
          return (
            <li key={item.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">{site?.name ?? 'Site'}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{site?.city ?? 'Pending location'}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1"><ClockIcon className="h-4 w-4" />{item.date} • {item.timeWindow}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1"><UserIcon className="h-4 w-4" />Crew lead: {item.crewLead}</p>
                </div>
                <Badge color="bg-emerald-100 text-emerald-800">{item.tasks.length} tasks</Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
