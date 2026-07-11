import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
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
    body: data.body || data.content || '',
    content: data.content || data.body || '',
    bodyJson: data.bodyJson,
    heroImage: data.heroImage || data.coverImage,
    coverImage: data.coverImage || data.heroImage,
    category: data.category || 'Editorial',
    categoryId: data.categoryId,
    categorySlug: data.categorySlug || 'editorial',
    authorName: data.authorName || 'Editorial Desk',
    authorId: data.authorId,
    authorSlug: data.authorSlug || 'editorial-desk',
    tags: data.tags || [],
    status: data.status || (data.published ? 'published' : 'draft'),
    published: Boolean(data.published ?? (data.status === 'published')),
    featured: Boolean(data.featured),
    readingTime: data.readingTime || 8,
    publishedAt: data.publishedAt?.toDate?.().toISOString?.() || data.publishedAt || new Date().toISOString(),
    createdAt: data.createdAt?.toDate?.().toISOString?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() || data.updatedAt,
    seoTitle: data.seoTitle || data.seo?.title,
    seoDescription: data.seoDescription || data.seo?.description,
    canonical: data.canonical,
    seo: data.seo,
  };
}

export async function getPublishedArticles(limitCount = 8): Promise<Article[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  const articles = snapshot.docs.map(normalizeArticle);
  
  // Sort in memory to avoid requiring a Firestore composite index
  return articles
    .sort((a, b) => {
      const dateA = new Date(b.publishedAt || 0).getTime();
      const dateB = new Date(a.publishedAt || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, limitCount);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'published'),
    where('featured', '==', true),
    limit(20)
  );

  const snapshot = await getDocs(q);
  const articles = snapshot.docs.map(normalizeArticle);
  
  // Sort in memory to avoid requiring a Firestore composite index
  const featured = articles
    .sort((a, b) => {
      const dateA = new Date(b.publishedAt || 0).getTime();
      const dateB = new Date(a.publishedAt || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, 1);
  
  if (featured.length === 0) {
    const fallback = await getPublishedArticles(1);
    return fallback[0] || null;
  }

  return featured[0];
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

export async function getDraftArticles(limitCount = 50): Promise<Article[]> {
  const q = query(
    collection(db, COLLECTION),
    where('status', 'in', ['draft', 'pending_review', 'archived']),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(normalizeArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  return normalizeArticle(snapshot);
}

export async function createArticle(data: Partial<Article>): Promise<string> {
  const now = new Date();
  const docRef = doc(collection(db, COLLECTION));
  
  const articleData = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(articleData).filter(([_, v]) => v !== undefined)
  );
  
  await setDoc(docRef, cleanData as any);
  return docRef.id;
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  
  const updateData = {
    ...data,
    updatedAt: new Date(),
  };
  
  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );
  
  await updateDoc(docRef, cleanData as any);
}

export async function deleteArticle(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  
  // Soft delete by setting live to false
  await updateDoc(docRef, {
    live: false,
    updatedAt: new Date(),
  });
}
