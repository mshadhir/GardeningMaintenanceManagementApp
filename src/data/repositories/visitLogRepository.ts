import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { VisitLog } from '@/lib/types';

function ensureDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Ensure Firebase config is set.');
  }
  return db;
}

export async function logVisit(visitLog: Omit<VisitLog, 'id'>): Promise<VisitLog> {
  const database = ensureDb();
  const docRef = await addDoc(collection(database, 'visitLogs'), visitLog);
  return { ...visitLog, id: docRef.id };
}

export async function getVisitLogsBySite(siteId: string): Promise<VisitLog[]> {
  const database = ensureDb();
  const visitLogQuery = query(collection(database, 'visitLogs'), where('siteId', '==', siteId), orderBy('visitDate', 'desc'));
  const snapshot = await getDocs(visitLogQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as VisitLog) }));
}
