import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export type FeedbackStatus = 'new' | 'read' | 'resolved';

export interface FeedbackMessage {
  id: string;
  text: string;
  authorName: string;
  authorEmail?: string;
  userId?: string;
  createdAt: Date;
  status: FeedbackStatus;
}

export const FEEDBACK_STATUSES: FeedbackStatus[] = ['new', 'read', 'resolved'];

/**
 * Store feedback submitted through the public site widget so that the admin
 * inbox can pick it up in real time. The widget also keeps a local copy as a
 * fallback when Firestore is unavailable.
 */
export async function submitFeedback(input: {
  text: string;
  authorName?: string;
  authorEmail?: string;
  userId?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'feedback'), {
    text: input.text,
    authorName: input.authorName || 'Guest',
    authorEmail: input.authorEmail || '',
    userId: input.userId || '',
    status: 'new' as FeedbackStatus,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

function normalizeFeedback(
  docSnap: QueryDocumentSnapshot<DocumentData>
): FeedbackMessage {
  const data = docSnap.data();
  const rawCreated = data.createdAt as unknown;
  const createdAt =
    rawCreated && typeof (rawCreated as { toDate?: () => Date }).toDate === 'function'
      ? (rawCreated as { toDate: () => Date }).toDate()
      : new Date();

  return {
    id: docSnap.id,
    text: data.text || '',
    authorName: data.authorName || 'Guest',
    authorEmail: data.authorEmail || undefined,
    userId: data.userId || undefined,
    createdAt,
    status: (data.status as FeedbackStatus) || 'new',
  };
}

/**
 * Subscribe to the feedback inbox (newest first). Returns an unsubscribe
 * function. This keeps the admin page chat-like in that new submissions
 * appear in real time without a manual refresh.
 */
export function subscribeFeedback(
  onMessages: (messages: FeedbackMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, 'feedback'),
    orderBy('createdAt', 'desc'),
    limit(200)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      onMessages(snapshot.docs.map(normalizeFeedback));
    },
    (error) => {
      onError?.(error);
    }
  );
}

/** Fetch a snapshot of the latest feedback (one-off, used on dashboards). */
export async function listFeedback(maxResults = 200): Promise<FeedbackMessage[]> {
  const q = query(
    collection(db, 'feedback'),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(normalizeFeedback);
}

/** Count feedback, optionally filtered by status. */
export async function countFeedback(status?: FeedbackStatus): Promise<number> {
  const base = collection(db, 'feedback');
  const q = status
    ? query(base, where('status', '==', status))
    : query(base);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<void> {
  await updateDoc(doc(db, 'feedback', id), {
    status,
    updatedAt: Timestamp.now(),
  });
}