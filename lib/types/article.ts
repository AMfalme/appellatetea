export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface ArticleImage {
  publicId: string;
  url: string;
  alt?: string;
}

export interface ArticleBase {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  bodyJson?: Record<string, unknown>;
  heroImage?: ArticleImage;
  category?: string;
  categorySlug?: string;
  authorName?: string;
  authorSlug?: string;
  tags?: string[];
  status: ArticleStatus;
  featured?: boolean;
  readingTime?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Article extends ArticleBase {
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface HomePageContent {
  featuredArticle: Article;
  mainArticles: Article[];
  briefArticles: Article[];
  categories: Array<{ name: string; slug: string; description: string }>;
}
