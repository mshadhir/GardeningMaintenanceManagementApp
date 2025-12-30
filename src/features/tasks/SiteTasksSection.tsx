'use client';

import { useMemo, useState } from 'react';
import { Card, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SiteTask } from '@/lib/types';
import { useSiteTasks } from './useSiteTasks';

interface SiteTasksSectionProps {
  siteId: string;
  siteName?: string;
}

function formatDate(date: string | null): string {
  if (!date) return 'Not completed yet';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function SiteTaskItem({
  task,
  onToggle,
  onSaveNotes
}: {
  task: SiteTask;
  onToggle: (id: string, isDone: boolean) => void;
  onSaveNotes: (id: string, notes: string) => void;
}) {
  const [notesDraft, setNotesDraft] = useState<string>(task.notes ?? '');

  const handleBlur = () => {
    if (notesDraft !== (task.notes ?? '')) {
      onSaveNotes(task.id, notesDraft.trim());
    }
  };

  return (
    <li className="rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <input
          id={`task-${task.id}`}
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          checked={task.isDone}
          onChange={(event) => onToggle(task.id, event.target.checked)}
        />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor={`task-${task.id}`} className="text-base font-semibold text-gray-900">
              {task.title}
            </label>
            <Badge color={task.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}>
              {task.isDone ? 'Completed' : 'Open'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Last completed: {formatDate(task.lastCompletedOn ?? null)}</p>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor={`notes-${task.id}`}>
              Notes
            </label>
            <textarea
              id={`notes-${task.id}`}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={2}
              placeholder="Add notes for this task"
              value={notesDraft}
              onChange={(event) => setNotesDraft(event.target.value)}
              onBlur={handleBlur}
            />
            <p className="text-xs text-gray-500">Notes save automatically when you click away.</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export function SiteTasksSection({ siteId, siteName }: SiteTasksSectionProps) {
  const { tasks, loading, error, toggleTaskCompletion, saveNotes, refresh } = useSiteTasks(siteId);
  const openCount = useMemo(() => tasks.filter((task) => !task.isDone).length, [tasks]);

  return (
    <Card className="p-4">
      <CardHeader
        title={siteName ? `${siteName} tasks` : 'Site tasks'}
        subtitle="Checklist and visit notes"
        action={
          <div className="flex items-center gap-2">
            <Badge color="bg-white text-gray-700 border border-gray-200">Open: {openCount}</Badge>
            <Button type="button" onClick={refresh} disabled={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
          Loading tasks…
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      {!loading && tasks.length === 0 ? (
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
          No tasks found for this site yet.
        </div>
      ) : null}

      {tasks.length ? (
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <SiteTaskItem
              key={task.id}
              task={task}
              onToggle={toggleTaskCompletion}
              onSaveNotes={saveNotes}
            />
          ))}
        </ul>
      ) : null}

      <CardFooter>
        <p className="text-sm text-gray-500">
          Checking a task will set today as the last completed date. Notes save on blur.
        </p>
      </CardFooter>
    </Card>
  );
}
