import { getArticleBySlug, getPublishedArticles } from "@/lib/services/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock3, CalendarDays, User2 } from "lucide-react";
import { ArticleAuthGate } from "@/components/features/ArticleAuthGate";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const relatedArticles = (await getPublishedArticles(4))
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#faf8f3]">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#8B1E1E] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wider text-neutral-500 mb-6">
          <span className="text-[#8B1E1E] font-semibold">{article.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock3 size={14} />
            {article.readingTime} min read
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CalendarDays size={14} />
            {new Date(article.publishedAt || Date.now()).toLocaleDateString("en", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <User2 size={16} />
          <span>{article.authorName}</span>
        </div>

        {/* Hero Image */}
        {article.heroImage?.url && (
          <div className="relative w-full aspect-[16/9] mb-10 overflow-hidden rounded">
            <Image
              src={article.heroImage.url}
              alt={article.heroImage.alt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        <p className="text-xl leading-relaxed text-neutral-700 mb-8 font-serif italic border-l-4 border-[#8B1E1E] pl-6">
          {article.excerpt}
        </p>

        {/* Body - gated behind auth */}
        <ArticleAuthGate>
          <div className="prose prose-lg max-w-none prose-neutral">
            {article.body.split('\n').map((paragraph, i) => (
              paragraph.trim() ? (
                <p key={i} className="text-lg leading-9 text-neutral-700 mb-6">
                  {paragraph}
                </p>
              ) : null
            ))}
          </div>
        </ArticleAuthGate>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-neutral-200 bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center gap-5 mb-12">
              <div className="flex-1 h-px bg-neutral-300" />
              <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
                Related Articles
              </span>
              <div className="flex-1 h-px bg-neutral-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/articles/${related.slug}`}
                  className="group block"
                >
                  {related.heroImage?.url && (
                    <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded">
                      <Image
                        src={related.heroImage.url}
                        alt={related.heroImage.alt || related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <p className="text-xs uppercase tracking-wider text-[#8B1E1E] mb-2">
                    {related.category}
                  </p>
                  <h3 className="font-serif text-xl leading-snug text-neutral-900 group-hover:text-[#8B1E1E] transition-colors">
                    {related.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {related.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock3 size={12} />
                      {related.readingTime} min read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
