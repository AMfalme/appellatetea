import { z } from 'zod';

export const SocialLinkSchema = z.object({
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

export const AuthorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().min(1, 'Bio is required'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  title: z.string().optional(),
  organization: z.string().optional(),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  socialLinks: SocialLinkSchema.optional(),
  isActive: z.boolean().default(true),
});

export const CreateAuthorSchema = AuthorSchema.omit({
  id: true,
});

export const UpdateAuthorSchema = CreateAuthorSchema.partial();

export type AuthorInput = z.infer<typeof CreateAuthorSchema>;
export type AuthorUpdate = z.infer<typeof UpdateAuthorSchema>;