import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  type Firestore
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScheduleEntry } from '@/lib/types';

function ensureDb(): Firestore {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

function getWeekRange(startOfWeek: string) {
  const start = new Date(startOfWeek);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const toIsoDate = (value: Date) => value.toISOString().slice(0, 10);

  return { start: toIsoDate(start), end: toIsoDate(end) };
}

export async function getWeeklySchedule(startOfWeek: string): Promise<ScheduleEntry[]> {
  const database = ensureDb();
  const { start, end } = getWeekRange(startOfWeek);
  const scheduleRef = collection(database, 'scheduleEntries');
  const scheduleQuery = query(scheduleRef, where('day', '>=', start), where('day', '<=', end));
  const snapshot = await getDocs(scheduleQuery);
  return snapshot.docs.map((entry) => entry.data() as ScheduleEntry);
}

export async function upsertScheduleEntry(entry: ScheduleEntry): Promise<void> {
  const database = ensureDb();
  const entryRef = doc(database, 'scheduleEntries', `${entry.day}-${entry.siteId}`);
  await setDoc(entryRef, entry, { merge: true });
}
