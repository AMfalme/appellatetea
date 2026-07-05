import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './config';

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signUp = async (email: string, password: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  
  return userCredential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const verifyEmail = async (user: User) => {
  await sendEmailVerification(user);
};

export { auth };