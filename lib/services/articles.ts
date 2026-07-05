import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Article, HomePageContent } from '@/lib/types/article';

const COLLECTION = 'articles';

function normalizeArticle(doc: any): Article {
  const data = doc.data() || {};
  return {
    id: doc.id,
    slug: data.slug || doc.id,
    title: data.title || 'Untitled article',
    excerpt: data.excerpt || '',
    body: data.body || '',
    bodyJson: data.bodyJson,
    heroImage: data.heroImage,
    category: data.category || 'Editorial',
    categorySlug: data.categorySlug || 'editorial',
    authorName: data.authorName || 'Editorial Desk',
    authorSlug: data.authorSlug || 'editorial-desk',
    tags: data.tags || [],
    status: data.status || 'published',
    featured: Boolean(data.featured),
    readingTime: data.readingTime || 8,
    publishedAt: data.publishedAt?.toDate?.().toISOString?.() || data.publishedAt || new Date().toISOString(),
    createdAt: data.createdAt?.toDate?.().toISOString?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() || data.updatedAt,
    seo: data.seo,
  };
}

export async function getPublishedArticles(limitCount = 8): Promise<Article[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(normalizeArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    const fallback = await getPublishedArticles(1);
    return fallback[0] || null;
  }

  return normalizeArticle(snapshot.docs[0]);
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const [featuredArticle, articles] = await Promise.all([
    getFeaturedArticle(),
    getPublishedArticles(6),
  ]);

  const mainArticles = articles.filter((article) => article.id !== featuredArticle?.id).slice(0, 3);
  const briefArticles = articles.filter((article) => article.id !== featuredArticle?.id).slice(3, 6);

  return {
    featuredArticle: featuredArticle || {
      id: 'fallback-featured',
      slug: 'how-one-supreme-court-decision',
      title: 'How One Supreme Court Decision Quietly Reshaped Administrative Justice',
      excerpt: 'Most constitutional judgments disappear into legal databases. Others quietly redefine governance for decades.',
      body: '',
      category: 'Constitutional Law',
      categorySlug: 'constitutional-law',
      authorName: 'Editorial Desk',
      authorSlug: 'editorial-desk',
      status: 'published',
      featured: true,
      readingTime: 14,
      publishedAt: new Date().toISOString(),
    },
    mainArticles,
    briefArticles,
    categories: [
      { name: 'Constitutional Law', slug: 'constitutional-law', description: 'Judicial reasoning and constitutional doctrine.' },
      { name: 'Parliament', slug: 'parliament', description: 'Legislative reform and public law.' },
      { name: 'African Development', slug: 'african-development', description: 'The legal architecture of development.' },
    ],
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    where('slug', '==', slug),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return normalizeArticle(snapshot.docs[0]);
}
