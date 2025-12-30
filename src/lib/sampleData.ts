import { DashboardSnapshot, ScheduleItem, Site, Task } from './types';

export const sampleSites: Site[] = [
  {
    id: 'site-1',
    name: 'Green Meadows Estate',
    address: '123 Greenway Blvd',
    city: 'Portland, OR',
    contactName: 'Alyssa Hart',
    contactPhone: '(555) 201-4433',
    serviceFrequency: 'Weekly',
    notes: 'Focus on winter pruning and irrigation checks.',
    manager: 'Alyssa Hart',
    phone: '(555) 201-4433',
    status: 'on_track',
    nextVisit: '2024-12-31',
    coordinates: { lat: 45.5152, lng: -122.6784 },
    activeTasks: 6
  },
  {
    id: 'site-2',
    name: 'Lakeside Villas',
    address: '980 Lake Shore Dr',
    city: 'Seattle, WA',
    contactName: 'Jacob Mills',
    contactPhone: '(555) 667-2399',
    serviceFrequency: 'Bi-weekly',
    notes: 'Drainage issues near the north entrance.',
    manager: 'Jacob Mills',
    phone: '(555) 667-2399',
    status: 'at_risk',
    nextVisit: '2025-01-02',
    coordinates: { lat: 47.6062, lng: -122.3321 },
    activeTasks: 4
  },
  {
    id: 'site-3',
    name: 'Sunrise Corporate Campus',
    address: '4100 Innovation Way',
    city: 'San Jose, CA',
    contactName: 'Priya Desai',
    contactPhone: '(555) 842-7788',
    serviceFrequency: 'Monthly',
    notes: 'Irrigation controller upgrade scheduled.',
    manager: 'Priya Desai',
    phone: '(555) 842-7788',
    status: 'delayed',
    nextVisit: '2025-01-04',
    coordinates: { lat: 37.3382, lng: -121.8863 },
    activeTasks: 7
  },
];

export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    siteId: 'site-1',
    title: 'Seasonal pruning',
    description: 'Prune flowering shrubs and remove dead branches.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-12-31',
    assignee: 'Lucia Kim',
    category: 'maintenance'
  },
  {
    id: 'task-2',
    siteId: 'site-2',
    title: 'Drainage inspection',
    description: 'Check standing water after rainfall and clear gutters.',
    priority: 'medium',
    status: 'todo',
    dueDate: '2025-01-02',
    assignee: 'Samir Patel',
    category: 'inspection'
  },
  {
    id: 'task-3',
    siteId: 'site-3',
    title: 'Irrigation controller upgrade',
    description: 'Replace controller and test zones 1-4.',
    priority: 'high',
    status: 'todo',
    dueDate: '2025-01-03',
    assignee: 'Karla Gomez',
    category: 'irrigation'
  },
  {
    id: 'task-4',
    siteId: 'site-1',
    title: 'Mulch refresh',
    description: 'Top up mulch on flower beds near main lobby.',
    priority: 'low',
    status: 'done',
    dueDate: '2024-12-27',
    assignee: 'Omar Reed',
    category: 'landscaping'
  }
];

export const sampleSchedule: ScheduleItem[] = [
  {
    id: 'schedule-1',
    siteId: 'site-1',
    date: '2024-12-31',
    timeWindow: '8:00 AM - 12:00 PM',
    crewLead: 'Lucia Kim',
    tasks: ['task-1', 'task-4']
  },
  {
    id: 'schedule-2',
    siteId: 'site-2',
    date: '2025-01-02',
    timeWindow: '9:00 AM - 1:00 PM',
    crewLead: 'Samir Patel',
    tasks: ['task-2']
  },
  {
    id: 'schedule-3',
    siteId: 'site-3',
    date: '2025-01-04',
    timeWindow: '7:00 AM - 11:00 AM',
    crewLead: 'Karla Gomez',
    tasks: ['task-3']
  }
];

export const sampleSnapshot: DashboardSnapshot = {
  siteCount: sampleSites.length,
  tasksDueThisWeek: 5,
  highPriorityTasks: 3,
  visitsScheduled: sampleSchedule.length,
};
