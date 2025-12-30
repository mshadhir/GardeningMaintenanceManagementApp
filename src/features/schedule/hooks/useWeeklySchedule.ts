import { useEffect, useMemo, useState } from 'react';
import { getWeeklySchedule, upsertScheduleEntry } from '@/data/repositories/scheduleRepository';
import { isFirebaseConfigured } from '@/lib/firebase';
import { sampleSchedule } from '@/lib/sampleData';
import type { ScheduleEntry } from '@/lib/types';

function toScheduleEntry(date: string): Pick<ScheduleEntry, 'day'> {
  return { day: date };
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getStartOfWeek(date: Date): string {
  const cloned = new Date(date);
  const day = cloned.getDay(); // Sunday = 0
  const diff = cloned.getDate() - (day === 0 ? 6 : day - 1);
  cloned.setDate(diff);
  return toIsoDate(cloned);
}

function getEndOfWeek(startOfWeek: string): string {
  const start = new Date(startOfWeek);
  start.setDate(start.getDate() + 6);
  return toIsoDate(start);
}

function getSampleEntries(startOfWeek: string): ScheduleEntry[] {
  const endOfWeek = getEndOfWeek(startOfWeek);
  return sampleSchedule
    .filter((item) => item.date >= startOfWeek && item.date <= endOfWeek)
    .map((item) => ({
      ...toScheduleEntry(item.date),
      siteId: item.siteId,
      tasks: item.tasks
    }));
}

export function useWeeklySchedule() {
  const [weekStart, setWeekStart] = useState<string>(getStartOfWeek(new Date()));
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const rangeLabel = useMemo(() => {
    const endOfWeek = getEndOfWeek(weekStart);
    const startDate = new Date(weekStart);
    const endDate = new Date(endOfWeek);
    const format = (date: Date) =>
      date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${format(startDate)} – ${format(endDate)}`;
  }, [weekStart]);

  useEffect(() => {
    async function hydrate() {
      setLoading(true);
      setError(null);
      try {
        if (isFirebaseConfigured) {
          const weeklyEntries = await getWeeklySchedule(weekStart);
          setEntries(weeklyEntries);
        } else {
          setEntries(getSampleEntries(weekStart));
        }
      } catch (err) {
        console.warn('Falling back to sample schedule after Firestore read error', err);
        setEntries(getSampleEntries(weekStart));
        setError('Unable to load schedule from Firestore. Showing sample data instead.');
      } finally {
        setLoading(false);
      }
    }

    void hydrate();
  }, [weekStart]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isFirebaseConfigured) {
        setEntries(getSampleEntries(weekStart));
        return;
      }
      const weeklyEntries = await getWeeklySchedule(weekStart);
      setEntries(weeklyEntries);
    } catch (err) {
      console.error('Failed to refresh weekly schedule', err);
      setError('Unable to refresh schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (entry: ScheduleEntry) => {
    if (isFirebaseConfigured) {
      await upsertScheduleEntry(entry);
    }
    setEntries((prev) => {
      const existingIndex = prev.findIndex(
        (existing) => existing.day === entry.day && existing.siteId === entry.siteId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  };

  const goToToday = () => setWeekStart(getStartOfWeek(new Date()));

  return {
    entries,
    loading,
    error,
    weekStart,
    rangeLabel,
    refresh,
    saveEntry,
    goToToday
  };
}
