import { z } from 'zod';
import { CaseStatus, CourtLevel, Jurisdiction } from '@/lib/types/case';

export const JudgeSchema = z.object({
  name: z.string().min(1, 'Judge name is required'),
  position: z.string().min(1, 'Judge position is required'),
});

export const CourtSchema = z.object({
  name: z.string().min(1, 'Court name is required'),
  abbreviation: z.string().min(1, 'Court abbreviation is required'),
  jurisdiction: z.enum(['federal', 'state', 'territorial'] as const),
  level: z.enum(['trial', 'appellate', 'supreme'] as const),
});

export const CaseSchema = z.object({
  id: z.string().optional(),
  citation: z.string().min(1, 'Citation is required'),
  title: z.string().min(1, 'Title is required'),
  court: CourtSchema,
  dateDecided: z.coerce.date(),
  docketNumber: z.string().min(1, 'Docket number is required'),
  judges: z.array(JudgeSchema).min(1, 'At least one judge is required'),
  parties: z.object({
    plaintiff: z.string().min(1, 'Plaintiff is required'),
    defendant: z.string().min(1, 'Defendant is required'),
  }),
  summary: z.string().min(1, 'Summary is required'),
  fullText: z.string().min(1, 'Full text is required'),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'pending_review', 'published', 'archived'] as const),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  pdfUrl: z.string().url().optional().or(z.literal('')),
  authorId: z.string().min(1, 'Author is required'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  publishedAt: z.date().optional(),
});

export const CreateCaseSchema = CaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const UpdateCaseSchema = CreateCaseSchema.partial();

export type CaseInput = z.infer<typeof CreateCaseSchema>;
export type CaseUpdate = z.infer<typeof UpdateCaseSchema>;