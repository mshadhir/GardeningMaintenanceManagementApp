import { Card } from '@/components/ui/Card';
import { DashboardSnapshot } from '@/lib/types';
import { ChartBarIcon, ClipboardDocumentListIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const icons = {
  siteCount: ShieldCheckIcon,
  tasksDueThisWeek: ClipboardDocumentListIcon,
  highPriorityTasks: ChartBarIcon,
  visitsScheduled: MapPinIcon,
};

const labels: Record<keyof DashboardSnapshot, string> = {
  siteCount: 'Active sites',
  tasksDueThisWeek: 'Open tasks',
  highPriorityTasks: 'High priority',
  visitsScheduled: 'Visits scheduled',
};

const accentColors: Record<keyof DashboardSnapshot, string> = {
  siteCount: 'bg-emerald-100 text-emerald-700',
  tasksDueThisWeek: 'bg-amber-100 text-amber-700',
  highPriorityTasks: 'bg-rose-100 text-rose-700',
  visitsScheduled: 'bg-blue-100 text-blue-700',
};

export function StatCards({ snapshot }: { snapshot: DashboardSnapshot }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {(Object.keys(snapshot) as (keyof DashboardSnapshot)[]).map((key) => {
        const Icon = icons[key];
        return (
          <Card key={key} className="p-4">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${accentColors[key]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-gray-500">{labels[key]}</p>
                <p className="text-2xl font-semibold text-gray-900">{snapshot[key]}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
