import { useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScheduleDayColumn } from './ScheduleDayColumn';
import type { ScheduleEntry, Site, Task } from '@/lib/types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface WeeklyScheduleGridProps {
  weekStart: string;
  entries: ScheduleEntry[];
  sites: Site[];
  tasks: Task[];
  rangeLabel: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function WeeklyScheduleGrid({
  weekStart,
  entries,
  sites,
  tasks,
  rangeLabel,
  loading,
  error,
  onRefresh
}: WeeklyScheduleGridProps) {
  const weekDays = useMemo(() => {
    const start = new Date(weekStart);
    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(start);
      date.setDate(start.getDate() + idx);
      return toIsoDate(date);
    });
  }, [weekStart]);

  const todayIso = toIsoDate(new Date());

  return (
    <Card className="space-y-4">
      <CardHeader
        title="Weekly schedule"
        subtitle={rangeLabel}
        action={
          <Button className="bg-white text-gray-800 ring-1 ring-inset ring-gray-200 hover:bg-gray-50" onClick={onRefresh} disabled={loading}>
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-gray-600">Loading schedule...</p>
      ) : error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-600">No schedule entries for this week.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {weekDays.map((day) => (
          <ScheduleDayColumn
            key={day}
            date={day}
            entries={entries.filter((entry) => entry.day === day)}
            sites={sites}
            tasks={tasks}
            isToday={day === todayIso}
          />
        ))}
      </div>
    </Card>
  );
}
