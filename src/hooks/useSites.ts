'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { sampleSchedule, sampleSites, sampleTasks } from '@/lib/sampleData';
import { DashboardSnapshot, ScheduleItem, Site, Task } from '@/lib/types';

interface UseSitesResult {
  sites: Site[];
  tasks: Task[];
  schedule: ScheduleItem[];
  snapshot: DashboardSnapshot;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useSites(): UseSitesResult {
  const [sites, setSites] = useState<Site[]>(sampleSites);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(sampleSchedule);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);

  const snapshot: DashboardSnapshot = useMemo(
    () => ({
      siteCount: sites.length,
      tasksDueThisWeek: tasks.filter((task) => task.status !== 'done').length,
      highPriorityTasks: tasks.filter((task) => task.priority === 'high').length,
      visitsScheduled: schedule.length,
    }),
    [sites.length, tasks, schedule.length]
  );

  useEffect(() => {
    async function hydrateFromFirestore() {
      if (!db) return;
      try {
        const siteSnapshot = await getDocs(collection(db, 'sites'));
        const taskSnapshot = await getDocs(collection(db, 'tasks'));
        const scheduleSnapshot = await getDocs(collection(db, 'schedule'));

        const siteData = siteSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Site[];
        const taskData = taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[];
        const scheduleData = scheduleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ScheduleItem[];

        setSites(siteData.length ? siteData : sampleSites);
        setTasks(taskData.length ? taskData : sampleTasks);
        setSchedule(scheduleData.length ? scheduleData : sampleSchedule);
      } catch (error) {
        console.warn('Falling back to sample data after Firestore read error', error);
        setSites(sampleSites);
        setTasks(sampleTasks);
        setSchedule(sampleSchedule);
      } finally {
        setLoading(false);
      }
    }

    if (db) {
      void hydrateFromFirestore();
    }
  }, []);

  const refresh = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const siteSnapshot = await getDocs(collection(db, 'sites'));
      const taskSnapshot = await getDocs(collection(db, 'tasks'));
      const scheduleSnapshot = await getDocs(collection(db, 'schedule'));

      setSites(siteSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Site[]);
      setTasks(taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Task[]);
      setSchedule(scheduleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ScheduleItem[]);
    } catch (error) {
      console.error('Failed to refresh Firestore data', error);
    } finally {
      setLoading(false);
    }
  };

  return { sites, tasks, schedule, snapshot, loading, refresh };
}
