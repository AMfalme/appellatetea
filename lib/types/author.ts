export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  title?: string;
  organization?: string;
  specialties: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AuthorStats {
  totalCases: number;
  publishedCases: number;
  totalViews: number;
  lastPublishedAt?: Date;
}