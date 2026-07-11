import { getArticleBySlug, getPublishedArticles } from './articles';
import type { Article } from '@/lib/types/article';
import type { NewspaperSection, NewspaperSectionConfig } from '@/lib/types/newspaper';

const STORAGE_KEY = 'newspaper-sections';

export async function getNewspaperLayout(): Promise<NewspaperSectionConfig[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const sections: NewspaperSectionConfig[] = parsed.sections || getDefaultLayout();
      return sections;
    }
    return getDefaultLayout();
  } catch {
    return getDefaultLayout();
  }
}

export async function getSectionArticle(section: NewspaperSection): Promise<{ article: Article | null; isPlaceholder: boolean }> {
  const layout = await getNewspaperLayout();
  const sectionConfig = layout.find((s) => s.section === section);
  
  if (!sectionConfig || sectionConfig.isPlaceholder || !sectionConfig.articleSlug) {
    return { article: null, isPlaceholder: true };
  }

  const article = await getArticleBySlug(sectionConfig.articleSlug);
  return { article, isPlaceholder: false };
}

export async function getPlaceholderSections(): Promise<NewspaperSection[]> {
  const layout: NewspaperSectionConfig[] = await getNewspaperLayout();
  return layout
    .filter((s) => s.isPlaceholder)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.section);
}

export async function hasPlaceholders(): Promise<boolean> {
  const placeholders = await getPlaceholderSections();
  return placeholders.length > 0;
}

export async function getAdminPlaceholderNotifications(): Promise<Array<{
  section: NewspaperSection;
  label: string;
  message: string;
}>> {
  const placeholders = await getPlaceholderSections();
  
  return placeholders.map((section) => ({
    section,
    label: getSectionLabel(section),
    message: getPlaceholderMessage(section),
  }));
}

function getDefaultLayout(): NewspaperSectionConfig[] {
  const date = new Date();
  return [
    { id: '1', section: 'lead', isPlaceholder: true, order: 1, updatedAt: date },
    { id: '2', section: 'featured', isPlaceholder: true, order: 2, updatedAt: date },
    { id: '3', section: 'frontpage', isPlaceholder: true, order: 3, updatedAt: date },
    { id: '4', section: 'editorial_column', isPlaceholder: true, order: 4, updatedAt: date },
    { id: '5', section: 'editors_desk', isPlaceholder: true, order: 5, updatedAt: date },
  ];
}

function getSectionLabel(section: NewspaperSection): string {
  const labels: Record<NewspaperSection, string> = {
    lead: 'The Lead',
    featured: 'Featured Story',
    frontpage: "Today's Front Page",
    editorial_column: 'Editorial Column',
    editors_desk: "Editor's Desk",
  };
  return labels[section];
}

function getPlaceholderMessage(section: NewspaperSection): string {
  const messages: Record<NewspaperSection, string> = {
    lead: 'No lead story assigned. Please assign an article to this prominent section.',
    featured: 'No featured story selected. Choose a story to highlight.',
    frontpage: 'Front page main story not set. Assign an article for the front page.',
    editorial_column: 'Editorial column is empty. Publish the editorial stance.',
    editors_desk: "Editor's desk section needs content. Add notes and updates.",
  };
  return messages[section];
}