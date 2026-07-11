export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserData {
  email: string;
  displayName: string;
  role?: UserRole;
}

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
}