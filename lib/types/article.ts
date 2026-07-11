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
  content?: string;
  bodyJson?: Record<string, unknown>;
  heroImage?: ArticleImage;
  coverImage?: ArticleImage;
  category?: string;
  categoryId?: string;
  categorySlug?: string;
  authorName?: string;
  authorId?: string;
  authorSlug?: string;
  tags?: string[];
  status: ArticleStatus;
  published?: boolean;
  featured?: boolean;
  readingTime?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
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
