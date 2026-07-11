import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { UserProfile, UserRole } from '@/lib/types/user';

const USERS_COLLECTION = 'users';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    email: data.email || '',
    displayName: data.displayName || 'User',
    photoURL: data.photoURL,
    role: (data.role as UserRole) || 'viewer',
    isEmailVerified: Boolean(data.isEmailVerified),
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
    lastLoginAt: data.lastLoginAt?.toDate?.(),
  };
}

export async function upsertUserProfile(user: UserProfile): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, user.id);
  
  // Get existing profile to preserve role if it exists
  const existing = await getDoc(ref);
  const existingData = existing.exists() ? existing.data() : null;
  const existingRole = existingData?.role as UserRole | undefined;
  
  await setDoc(ref, {
    ...user,
    role: user.role || existingRole || 'viewer',
    createdAt: user.createdAt || new Date(),
    updatedAt: new Date(),
  }, { merge: true });
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  await updateDoc(ref, {
    role,
    updatedAt: new Date(),
  });
}

export async function listUsers(): Promise<UserProfile[]> {
  const snapshot = await getDocs(collection(db, USERS_COLLECTION));
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      email: data.email || '',
      displayName: data.displayName || 'User',
      photoURL: data.photoURL,
      role: (data.role as UserRole) || 'viewer',
      isEmailVerified: Boolean(data.isEmailVerified),
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate?.(),
    };
  });
}