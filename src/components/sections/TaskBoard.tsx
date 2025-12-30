'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button, GhostButton } from '@/components/ui/Button';
import { priorityColor, priorityCopy, statusColor, statusCopy } from '@/lib/format';
import { Task } from '@/lib/types';
import { useTaskManager } from '@/hooks/useTaskManager';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface TaskBoardProps {
  initialTasks: Task[];
}

const categories: Task['category'][] = ['maintenance', 'landscaping', 'irrigation', 'inspection'];

export function TaskBoard({ initialTasks }: TaskBoardProps) {
  const { tasks, updateTaskStatus, addTask } = useTaskManager(initialTasks);
  const [filter, setFilter] = useState<Task['category'] | 'all'>('all');

  const filteredTasks = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((task) => task.category === filter)),
    [filter, tasks]
  );

  const handleQuickAdd = async () => {
    await addTask({
      siteId: 'site-1',
      title: 'Quick follow-up',
      description: 'Check irrigation coverage near entrance.',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().slice(0, 10),
      assignee: 'Unassigned',
      category: 'maintenance',
    });
  };

  return (
    <Card className="p-4">
      <CardHeader
        title="Tasks"
        subtitle="Track work across sites"
        action={
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none"
              value={filter}
              onChange={(event) => setFilter(event.target.value as Task['category'] | 'all')}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <Button type="button" onClick={handleQuickAdd}>
              Add task
            </Button>
          </div>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="rounded-lg border border-gray-100 p-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">{task.category}</p>
                <h4 className="text-base font-semibold text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <Badge color={priorityColor[task.priority]}>{priorityCopy[task.priority]}</Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>Assignee: {task.assignee}</span>
              <span>Due: {task.dueDate}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Badge color={statusColor[task.status]}>{statusCopy[task.status]}</Badge>
              <div className="flex items-center gap-2">
                {task.status !== 'todo' ? (
                  <GhostButton type="button" onClick={() => updateTaskStatus(task.id, 'todo')}>
                    Move to To do
                  </GhostButton>
                ) : null}
                {task.status !== 'in_progress' ? (
                  <GhostButton type="button" onClick={() => updateTaskStatus(task.id, 'in_progress')}>
                    Start
                  </GhostButton>
                ) : null}
                {task.status !== 'done' ? (
                  <Button type="button" onClick={() => updateTaskStatus(task.id, 'done')}>
                    Complete
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>No tasks match this filter.</span>
          </div>
          <GhostButton type="button" onClick={() => setFilter('all')}>
            Clear filter
          </GhostButton>
        </div>
      ) : null}
    </Card>
  );
}
