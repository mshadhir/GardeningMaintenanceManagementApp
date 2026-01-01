import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  type DocumentReference,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Site, Task } from '@/lib/types';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

export async function getSites(): Promise<Site[]> {
  const database = ensureDb();
  const snapshot = await getDocs(collection(database, 'sites'));
  return snapshot.docs.map((siteDoc) => ({ id: siteDoc.id, ...(siteDoc.data() as Site) }));
}

export async function getSiteById(id: string): Promise<Site | null> {
  const database = ensureDb();
  const siteRef = doc(database, 'sites', id);
  const siteSnap = await getDoc(siteRef);
  if (!siteSnap.exists()) return null;
  return { id: siteSnap.id, ...(siteSnap.data() as Site) };
}

export async function createSite(site: Omit<Site, 'id'>): Promise<Site> {
  const database = ensureDb();
  const docRef = await addDoc(collection(database, 'sites'), site);
  return { ...site, id: docRef.id };
}

export async function updateSite(id: string, data: Partial<Site>): Promise<void> {
  const database = ensureDb();
  const siteRef = doc(database, 'sites', id);
  await updateDoc(siteRef, data);
}

export async function updateTask(siteId: string, taskId: string, data: Partial<Task>): Promise<void> {
  const database = ensureDb();
  // Tasks are stored as a top-level collection keyed by taskId.
  // siteId is used for validation/ownership checks at the call site or via security rules.
  const taskRef: DocumentReference = doc(database, 'tasks', taskId);
  await updateDoc(taskRef, { ...data, siteId });
}
