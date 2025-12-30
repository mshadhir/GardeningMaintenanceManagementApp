import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteTask } from '@/lib/types';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

export async function getTasksBySite(siteId: string): Promise<SiteTask[]> {
  const database = ensureDb();
  const taskQuery = query(collection(database, 'tasks'), where('siteId', '==', siteId));
  const snapshot = await getDocs(taskQuery);
  return snapshot.docs.map((taskDoc) => ({ id: taskDoc.id, ...(taskDoc.data() as SiteTask) }));
}

export async function createTask(task: Omit<SiteTask, 'id'>): Promise<SiteTask> {
  const database = ensureDb();
  const docRef = await addDoc(collection(database, 'tasks'), task);
  return { ...task, id: docRef.id };
}

export async function updateTaskStatus(
  id: string,
  isDone: boolean,
  lastCompletedOn: string | null
): Promise<void> {
  const database = ensureDb();
  const taskRef = doc(database, 'tasks', id);
  await updateDoc(taskRef, { isDone, lastCompletedOn });
}

export async function updateTaskNotes(id: string, notes: string): Promise<void> {
  const database = ensureDb();
  const taskRef = doc(database, 'tasks', id);
  await updateDoc(taskRef, { notes });
}
