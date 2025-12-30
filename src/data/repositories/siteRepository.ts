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

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

function validateCoordinates(siteId: string, coordinates: Site['coordinates'] | undefined): Site['coordinates'] {
  if (!coordinates) {
    throw new Error(`Site "${siteId}" is missing geocoded coordinates.`);
  }

  const { lat, lng } = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error(`Site "${siteId}" has invalid coordinate values.`);
  }

  return { lat, lng };
}

function mapSiteDocument(siteDoc: QueryDocumentSnapshot | DocumentSnapshot): Site {
  const rawData = siteDoc.data() as Partial<Omit<Site, 'id'>>;
  const coordinates = validateCoordinates(siteDoc.id, rawData?.coordinates);

  return {
    id: siteDoc.id,
    ...(rawData as Omit<Site, 'id'>),
    coordinates,
  };
}

export async function getSites(): Promise<Site[]> {
  const database = ensureDb();
  const snapshot = await getDocs(collection(database, 'sites'));
  return snapshot.docs.map(mapSiteDocument);
}

export async function getSiteById(id: string): Promise<Site | null> {
  const database = ensureDb();
  const siteRef = doc(database, 'sites', id);
  const siteSnap = await getDoc(siteRef);
  if (!siteSnap.exists()) return null;
  return mapSiteDocument(siteSnap);
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
