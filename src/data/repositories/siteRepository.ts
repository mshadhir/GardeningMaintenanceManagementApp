import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  type DocumentReference,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Site, Task, VisitLog } from '@/lib/types';

const defaultSiteFields: Omit<Site, 'id'> = {
  name: '',
  address: '',
  city: '',
  contactName: '',
  contactPhone: '',
  serviceFrequency: '',
  notes: '',
  status: 'on_track',
  nextVisit: '',
  coordinates: { lat: 0, lng: 0 },
  activeTasks: 0,
};

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

function mapSiteData(siteId: string, data: Partial<Site>): Site {
  return {
    ...defaultSiteFields,
    ...data,
    id: siteId,
  };
}

export async function getSites(): Promise<Site[]> {
  const database = ensureDb();
  const snapshot = await getDocs(collection(database, 'sites'));
  return snapshot.docs.map((siteDoc) => mapSiteData(siteDoc.id, siteDoc.data() as Site));
}

export async function getSiteById(id: string): Promise<Site | null> {
  const database = ensureDb();
  const siteRef = doc(database, 'sites', id);
  const siteSnap = await getDoc(siteRef);
  if (!siteSnap.exists()) return null;
  return mapSiteData(siteSnap.id, siteSnap.data() as Site);
}

export async function createSite(site: Omit<Site, 'id'>): Promise<Site> {
  const database = ensureDb();
  const docRef = await addDoc(collection(database, 'sites'), site);
  return { ...site, id: docRef.id };
}

export async function updateTask(siteId: string, taskId: string, data: Partial<Task>): Promise<void> {
  const database = ensureDb();
  // Tasks are stored as a top-level collection keyed by taskId.
  // siteId is used for validation/ownership checks at the call site or via security rules.
  const taskRef: DocumentReference = doc(database, 'tasks', taskId);
  await updateDoc(taskRef, { ...data, siteId });
}

export async function logVisit(visitLog: VisitLog): Promise<VisitLog> {
  const database = ensureDb();
  const docRef = await addDoc(collection(database, 'visitLogs'), visitLog);
  return { ...visitLog, id: docRef.id };
}
