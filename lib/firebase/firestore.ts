import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';

export type FirestoreCollection = 'cases' | 'authors' | 'users' | 'settings';

export interface PaginatedResult<T> {
  data: T[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

// Generic CRUD operations
export const createDocument = async <T>(
  collectionName: FirestoreCollection,
  id: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<T> => {
  const now = new Date();
  const docRef = doc(db, collectionName, id);
  
  await setDoc(docRef, {
    ...data,
    createdAt: now,
    updatedAt: now,
  } as T & { createdAt: Date; updatedAt: Date });
  
  return { id, ...data, createdAt: now, updatedAt: now } as T;
};

export const getDocument = async <T>(
  collectionName: FirestoreCollection,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  
  return null;
};

export const updateDocument = async <T>(
  collectionName: FirestoreCollection,
  id: string,
  data: Partial<Omit<T, 'id' | 'createdAt'>>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  } as T & { updatedAt: Date });
};

export const deleteDocument = async (
  collectionName: FirestoreCollection,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const listDocuments = async <T>(
  collectionName: FirestoreCollection,
  constraints: QueryConstraint[] = [],
  limitCount: number = 10
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints, limit(limitCount));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

export const listDocumentsPaginated = async <T>(
  collectionName: FirestoreCollection,
  constraints: QueryConstraint[] = [],
  pageSize: number = 10,
  lastVisible: DocumentSnapshot | null = null
): Promise<PaginatedResult<T>> => {
  let q = query(collection(db, collectionName), ...constraints, orderBy('createdAt', 'desc'));
  
  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }
  
  q = query(q, limit(pageSize + 1));
  
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > pageSize;
  const data = docs.slice(0, pageSize).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
  
  return {
    data,
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
};

// Collection reference helper
export const getCollectionRef = (collectionName: FirestoreCollection) => {
  return collection(db, collectionName);
};