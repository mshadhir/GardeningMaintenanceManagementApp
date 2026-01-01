import type { ScheduleEntry, Site, Task } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MapPinIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ScheduleDayColumnProps {
  date: string;
  entries: ScheduleEntry[];
  sites: Site[];
  tasks: Task[];
  isToday?: boolean;
}

export function ScheduleDayColumn({ date, entries, sites, tasks, isToday }: ScheduleDayColumnProps) {
  const displayDate = new Date(date);
  const dayLabel = displayDate.toLocaleDateString(undefined, { weekday: 'short' });
  const dateLabel = displayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div
      className={clsx(
        'flex min-h-[240px] flex-col gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm',
        isToday && 'border-brand-200 ring-1 ring-brand-300'
      )}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{dayLabel}</p>
          <p className="text-xs text-gray-600">{dateLabel}</p>
        </div>
        {isToday && <Badge color="bg-emerald-100 text-emerald-800">Today</Badge>}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No visits scheduled.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const site = sites.find((s) => s.id === entry.siteId);
            const entryTasks = entry.tasks
              .map((taskId) => tasks.find((task) => task.id === taskId)?.title ?? taskId)
              .slice(0, 3);

            return (
              <Card key={`${entry.day}-${entry.siteId}`} className="space-y-2 border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{site?.name ?? 'Unassigned site'}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      {site?.city ?? 'Pending location'}
                    </p>
                  </div>
                  <Badge>{entry.tasks.length} tasks</Badge>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <ClipboardDocumentListIcon className="h-4 w-4 text-gray-500" />
                  <div className="space-y-1">
                    {entryTasks.map((title) => (
                      <p key={title} className="truncate">
                        {title}
                      </p>
                    ))}
                    {entry.tasks.length > entryTasks.length && (
                      <p className="text-gray-500">+{entry.tasks.length - entryTasks.length} more</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
