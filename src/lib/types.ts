export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type SiteHealth = 'on_track' | 'at_risk' | 'delayed';
export type VisitOutcome = 'completed' | 'partial' | 'missed';
export type RoleKey = 'admin' | 'manager' | 'crew' | 'viewer';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  contactName: string;
  contactPhone: string;
  serviceFrequency: string;
  notes: string;
  manager?: string;
  phone?: string;
  status: SiteHealth;
  nextVisit: string;
  coordinates: Coordinates;
  activeTasks: number;
  services?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  siteId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignee: string;
  category: 'maintenance' | 'landscaping' | 'irrigation' | 'inspection';
  attachments?: string[];
  checklist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleItem {
  id: string;
  siteId: string;
  date: string;
  timeWindow: string;
  crewLead: string;
  tasks: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSnapshot {
  siteCount: number;
  tasksDueThisWeek: number;
  highPriorityTasks: number;
  visitsScheduled: number;
}

export interface VisitLog {
  id: string;
  siteId: string;
  visitDate: string;
  crewLead: string;
  outcome: VisitOutcome;
  completedTasks: string[];
  notes?: string;
  photos?: string[];
  weatherSummary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRole {
  id: string;
  key: RoleKey;
  name: string;
  description?: string;
  permissions?: string[];
  assignedUsers?: string[];
  createdAt?: string;
  updatedAt?: string;
}
