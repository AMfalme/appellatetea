'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserProfile, upsertUserProfile } from '@/lib/services/users';
import type { UserProfile } from '@/lib/types/user';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        const existingProfile = await getUserProfile(fbUser.uid);
        
        if (existingProfile) {
          console.log('[AuthProvider] Existing profile found:', existingProfile);
          // Preserve existing role from Firestore and update login timestamp
          const updatedProfile = {
            ...existingProfile,
            lastLoginAt: new Date(),
          };
          
          // Update lastLoginAt in Firestore
          await upsertUserProfile(updatedProfile);
          console.log('[AuthProvider] Updated profile with lastLoginAt:', updatedProfile);
          
          setUser(updatedProfile);
        } else {
          console.log('[AuthProvider] No existing profile, creating new with viewer role');
          // Create new profile with default viewer role
          const newProfile: UserProfile = {
            id: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'User',
            photoURL: fbUser.photoURL || undefined,
            role: 'viewer',
            isEmailVerified: fbUser.emailVerified,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
          };
          
          await upsertUserProfile(newProfile);
          setUser(newProfile);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}