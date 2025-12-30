import { SiteHealth, TaskPriority, TaskStatus } from './types';

export const statusCopy: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Completed'
};

export const priorityCopy: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const siteHealthCopy: Record<SiteHealth, string> = {
  on_track: 'On track',
  at_risk: 'At risk',
  delayed: 'Delayed'
};

export const statusColor: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-amber-100 text-amber-800',
  done: 'bg-emerald-100 text-emerald-800'
};

export const priorityColor: Record<TaskPriority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800'
};

export const siteHealthColor: Record<SiteHealth, string> = {
  on_track: 'bg-emerald-100 text-emerald-800',
  at_risk: 'bg-amber-100 text-amber-800',
  delayed: 'bg-rose-100 text-rose-800'
};
