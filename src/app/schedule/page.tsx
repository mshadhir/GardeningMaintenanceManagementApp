'use client';

import { useMemo } from 'react';
import { WeeklyScheduleGrid } from '@/features/schedule/components/WeeklyScheduleGrid';
import { TodayOverview } from '@/features/schedule/components/TodayOverview';
import { useWeeklySchedule } from '@/features/schedule/hooks/useWeeklySchedule';
import { useSites } from '@/hooks/useSites';
import { Button } from '@/components/ui/Button';

export default function SchedulePage() {
  const { sites, tasks, loading: sitesLoading } = useSites();
  const { entries, loading: scheduleLoading, error, weekStart, rangeLabel, refresh, goToToday } = useWeeklySchedule();

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
    []
  );

  const todayEntries = entries.filter((entry) => entry.day === todayIso);
  const loading = sitesLoading || scheduleLoading;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Scheduling</p>
          <h1 className="text-3xl font-semibold text-gray-900">Weekly route planner</h1>
          <p className="text-sm text-gray-600">See which crews and sites are covered each day, with a quick glance at today&apos;s stops.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={goToToday} disabled={loading} className="bg-white text-gray-800 ring-1 ring-inset ring-gray-200 hover:bg-gray-50">
            Today
          </Button>
          <Button onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </div>
      </header>

      <TodayOverview entries={todayEntries} sites={sites} tasks={tasks} dateLabel={todayLabel} />

      <WeeklyScheduleGrid
        weekStart={weekStart}
        entries={entries}
        sites={sites}
        tasks={tasks}
        rangeLabel={rangeLabel}
        loading={loading}
        error={error}
        onRefresh={refresh}
      />
    </main>
  );
}
