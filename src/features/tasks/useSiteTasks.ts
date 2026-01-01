'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTasksBySite, updateTaskNotes, updateTaskStatus } from '@/data/repositories/taskRepository';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { SiteTask } from '@/lib/types';
import { sampleSiteTasks } from './sampleSiteTasks';

interface UseSiteTasksResult {
  tasks: SiteTask[];
  loading: boolean;
  error: string | null;
  toggleTaskCompletion: (id: string, isDone: boolean) => Promise<void>;
  saveNotes: (id: string, notes: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSiteTasks(siteId: string): UseSiteTasksResult {
  const [tasks, setTasks] = useState<SiteTask[]>([]);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const fallbackTasks = useMemo(
    () => sampleSiteTasks.filter((task) => task.siteId === siteId),
    [siteId]
  );

  const hydrate = useCallback(async () => {
    setLoading(isFirebaseConfigured);
    setError(null);
    if (!siteId) return;

    if (!db) {
      setTasks(fallbackTasks);
      setLoading(false);
      return;
    }

    try {
      const siteTasks = await getTasksBySite(siteId);
      setTasks(siteTasks.length ? siteTasks : fallbackTasks);
    } catch (err) {
      console.error('Failed to fetch site tasks', err);
      setError('Unable to load tasks right now. Showing sample data.');
      setTasks(fallbackTasks);
    } finally {
      setLoading(false);
    }
  }, [fallbackTasks, siteId]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const toggleTaskCompletion = useCallback(
    async (id: string, isDone: boolean) => {
      const lastCompletedOn = isDone ? new Date().toISOString().slice(0, 10) : null;
      let previousTask: SiteTask | undefined;
      setTasks((previous) =>
        previous.map((task) => {
          if (task.id === id) {
            previousTask = task;
            return { ...task, isDone, lastCompletedOn };
          }
          return task;
        })
      );

      if (!db) return;

      try {
        await updateTaskStatus(id, isDone, lastCompletedOn);
      } catch (err) {
        console.error('Failed to update task status', err);
        setError('Could not update task status. Please try again.');
        setTasks((previous) =>
          previous.map((task) =>
            task.id === id && previousTask ? previousTask : task
          )
        );
      }
    },
    []
  );

  const saveNotes = useCallback(async (id: string, notes: string) => {
    setTasks((previous) => previous.map((task) => (task.id === id ? { ...task, notes } : task)));

    if (!db) return;

    try {
      await updateTaskNotes(id, notes);
    } catch (err) {
      console.error('Failed to update task notes', err);
      setError('Could not save notes. Please try again.');
    }
  }, []);

  return { tasks, loading, error, toggleTaskCompletion, saveNotes, refresh: hydrate };
}
