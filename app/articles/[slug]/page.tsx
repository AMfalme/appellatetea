import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock3, User2 } from 'lucide-react';
import { getArticleBySlug } from '@/lib/services/articles';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.readingTime} min read</span>
        </div>

        <h1 className="font-serif text-4xl leading-tight md:text-6xl">
          {article.title}
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-9 text-neutral-700">
          {article.excerpt}
        </p>

        <div className="mt-10 flex flex-wrap gap-8 border-b border-neutral-200 pb-10 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <User2 size={16} />
            {article.authorName}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently published'}
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {article.readingTime} min read
          </div>
        </div>

        {article.heroImage?.url ? (
          <div className="mt-12 overflow-hidden rounded border border-neutral-200">
            <Image
              src={article.heroImage.url}
              alt={article.heroImage.alt || article.title}
              width={1600}
              height={1000}
              className="h-[420px] w-full object-cover"
            />
          </div>
        ) : null}

        <div className="prose prose-neutral mt-14 max-w-none text-lg leading-9 text-neutral-700">
          <p>{article.body}</p>
        </div>

        <div className="mt-16 border-t border-neutral-200 pt-8">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8B1E1E]">
            ← Back to home
          </Link>
        </div>
      </div>
    </article>
  );
}
