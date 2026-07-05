import { z } from 'zod';
import { UserRole } from '@/lib/types/user';

export const UserProfileSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  displayName: z.string().min(1, 'Display name is required'),
  photoURL: z.string().url().optional().or(z.literal('')),
  role: z.enum(['admin', 'editor', 'viewer'] as const),
  isEmailVerified: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastLoginAt: z.date().optional(),
});

export const CreateUserSchema = UserProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  isEmailVerified: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type UserProfileInput = z.infer<typeof CreateUserSchema>;
export type UserProfileUpdate = z.infer<typeof UpdateUserSchema>;