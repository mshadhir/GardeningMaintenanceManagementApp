import { Card, CardHeader } from '@/components/ui/Card';
import type { ScheduleEntry, Site, Task } from '@/lib/types';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

interface TodayOverviewProps {
  entries: ScheduleEntry[];
  sites: Site[];
  tasks: Task[];
  dateLabel: string;
}

export function TodayOverview({ entries, sites, tasks, dateLabel }: TodayOverviewProps) {
  return (
    <Card className="space-y-3">
      <CardHeader title="Today" subtitle={dateLabel} action={<CalendarDaysIcon className="h-6 w-6 text-brand-600" />} />
      {entries.length === 0 ? (
        <p className="text-sm text-gray-600">No visits assigned for today. Enjoy the calm or plan ahead.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {entries.map((entry) => {
            const site = sites.find((s) => s.id === entry.siteId);
            const entryTasks = entry.tasks
              .map((taskId) => tasks.find((task) => task.id === taskId)?.title ?? taskId)
              .slice(0, 3);
            return (
              <li key={`${entry.day}-${entry.siteId}`} className="py-3">
                <p className="text-sm font-semibold text-gray-900">{site?.name ?? 'Unassigned site'}</p>
                <p className="text-xs text-gray-600">{site?.city ?? 'Location pending'}</p>
                <ul className="mt-2 space-y-1 text-xs text-gray-700">
                  {entryTasks.map((task) => (
                    <li key={task}>• {task}</li>
                  ))}
                  {entry.tasks.length > entryTasks.length && (
                    <li className="text-gray-500">+{entry.tasks.length - entryTasks.length} more</li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
