import { SiteTask } from '@/lib/types';

export const sampleSiteTasks: SiteTask[] = [
  {
    id: 'site-task-1',
    siteId: 'site-1',
    title: 'Check irrigation coverage near lobby',
    isDone: false,
    lastCompletedOn: null,
    notes: 'Zone 3 sprinkler still needs adjustment.'
  },
  {
    id: 'site-task-2',
    siteId: 'site-1',
    title: 'Refresh mulch by main walkway',
    isDone: true,
    lastCompletedOn: '2024-12-28',
    notes: 'Completed during last visit; monitor for weeds.'
  },
  {
    id: 'site-task-3',
    siteId: 'site-2',
    title: 'Inspect drainage near north entrance',
    isDone: false,
    lastCompletedOn: null,
    notes: 'Standing water after heavy rain.'
  }
];
