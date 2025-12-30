'use client';

import { StatCards } from '@/components/sections/StatCards';
import { SiteList } from '@/components/sections/SiteList';
import { TaskBoard } from '@/components/sections/TaskBoard';
import { ScheduleList } from '@/components/sections/ScheduleList';
import { SitesMap } from '@/components/sections/SitesMap';
import { useSites } from '@/hooks/useSites';
import { useState } from 'react';

export default function HomePage() {
  const { sites, tasks, schedule, snapshot } = useSites();
  const [activeSiteId, setActiveSiteId] = useState<string | undefined>();

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Gardening Maintenance</p>
          <h1 className="text-3xl font-semibold text-gray-900">Operations dashboard</h1>
          <p className="text-sm text-gray-600">Manage sites, tasks, schedule, and map visibility in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-gray-200">Firebase ready</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-gray-200">Google Maps</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-gray-200">Tailwind CSS</span>
        </div>
      </header>

      <StatCards snapshot={snapshot} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SiteList sites={sites} onSelect={(site) => setActiveSiteId(site.id)} />
          <TaskBoard initialTasks={tasks} />
        </div>
        <div className="space-y-4 lg:col-span-1">
          <SitesMap sites={sites} activeSiteId={activeSiteId} />
          <ScheduleList schedule={schedule} sites={sites} />
        </div>
      </div>
    </main>
  );
}
