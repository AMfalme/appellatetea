export type NewspaperSection = 
  | 'lead'
  | 'featured'
  | 'frontpage'
  | 'editorial_column'
  | 'editors_desk';

export interface NewspaperSectionConfig {
  id: string;
  section: NewspaperSection;
  articleId?: string;
  articleSlug?: string;
  title?: string;
  excerpt?: string;
  isPlaceholder: boolean;
  order: number;
  updatedAt: Date;
}

export interface NewspaperLayout {
  lead?: NewspaperSectionConfig;
  featured?: NewspaperSectionConfig;
  frontPageMain?: NewspaperSectionConfig;
  frontPageLinks?: NewspaperSectionConfig[];
  editorialColumn?: NewspaperSectionConfig;
  editorsDesk?: NewspaperSectionConfig;
}

export const SECTION_LABELS: Record<NewspaperSection, string> = {
  lead: 'The Lead',
  featured: 'Featured Story',
  frontpage: "Today's Front Page",
  editorial_column: 'Editorial Column',
  editors_desk: "Editor's Desk",
};

export const SECTION_DESCRIPTIONS: Record<NewspaperSection, string> = {
  lead: 'The primary story displayed at the top of the homepage',
  featured: 'One featured story after the lead',
  frontpage: 'Main story with related links on the right side',
  editorial_column: 'Official editorial stance and opinion',
  editors_desk: 'Notes and updates from the editorial team',
};