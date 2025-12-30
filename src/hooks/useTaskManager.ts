'use client';

import { useCallback, useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleTasks } from '@/lib/sampleData';
import { Task } from '@/lib/types';

export function useTaskManager(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = useCallback(
    async (task: Omit<Task, 'id'>) => {
      const localTask: Task = { ...task, id: crypto.randomUUID() };
      setTasks((prev) => [...prev, localTask]);

      if (db) {
        try {
          const docRef = await addDoc(collection(db, 'tasks'), task);
          setTasks((prev) => prev.map((existing) => (existing.id === localTask.id ? { ...existing, id: docRef.id } : existing)));
          return { ...task, id: docRef.id };
        } catch (error) {
          console.error('Failed to persist new task to Firestore', error);
        }
      }
      return localTask;
    },
    []
  );

  const updateTaskStatus = useCallback(async (id: string, status: Task['status']) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));

    if (db) {
      try {
        await updateDoc(doc(collection(db, 'tasks'), id), { status });
      } catch (error) {
        console.error('Failed to update task status in Firestore', error);
      }
    }
  }, []);

  const resetToSample = useCallback(() => setTasks(sampleTasks), []);

  return { tasks, addTask, updateTaskStatus, resetToSample, setTasks };
}
