export type CaseStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type CourtLevel = 'trial' | 'appellate' | 'supreme';
export type Jurisdiction = 'federal' | 'state' | 'territorial';

export interface Court {
  id: string;
  name: string;
  abbreviation: string;
  jurisdiction: Jurisdiction;
  level: CourtLevel;
}

export interface Judge {
  id: string;
  name: string;
  position: string;
}

export interface Case {
  id: string;
  citation: string;
  title: string;
  court: Court;
  dateDecided: Date;
  docketNumber: string;
  judges: Judge[];
  parties: {
    plaintiff: string;
    defendant: string;
  };
  summary: string;
  fullText: string;
  topics: string[];
  tags: string[];
  status: CaseStatus;
  sourceUrl?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
}