import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

export async function getTasksForDate(dateKey: string): Promise<Task[]> {
  const database = ensureDb();
  const tasksRef = collection(database, 'tasks');
  const tasksQuery = query(tasksRef, where('dueDate', '==', dateKey));
  const snapshot = await getDocs(tasksQuery);

  return snapshot.docs.map((taskDoc) => ({ id: taskDoc.id, ...(taskDoc.data() as Task) }));
}

export async function markTaskComplete(taskId: string): Promise<void> {
  const database = ensureDb();
  const taskRef = doc(database, 'tasks', taskId);
  await updateDoc(taskRef, { status: 'done' });
}
