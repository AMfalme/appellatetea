"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Globe2, Landmark, Quote, Scale, User2 } from "lucide-react";
import { motion } from "framer-motion";
import { getSectionArticle } from "@/lib/services/newspaper";
import {
  CURATED_STORIES,
  EDITORIAL_STATEMENT,
  PULL_QUOTE,
  safeImageSrc,
  storyFromArticle,
  type EditorialStory,
} from "./editorialContent";

/** The publication's three editorial principles, kept as compact rows. */
const PRINCIPLES = [
  {
    icon: Scale,
    title: "Beyond case summaries",
    detail: "We explain why judgments matter, not simply what courts decided.",
  },
  {
    icon: Landmark,
    title: "Law in context",
    detail: "Every decision connects to politics, institutions and history.",
  },
  {
    icon: Globe2,
    title: "An African perspective",
    detail: "Grounded in African legal systems, engaging global constitutional thought.",
  },
];

const FALLBACK_LEAD: EditorialStory =
  CURATED_STORIES.find((story) => story.id === "archive-supreme-court-administrative-justice") ??
  CURATED_STORIES[0];

/**
 * The masthead split: the editorial statement and pull-quote sit on the left,
 * the lead story on the right. This absorbs the two full-width dark banners
 * (the old EditorsPick quote block and QuoteSection) that repeated the same
 * statements as separate sections further down the page.
 */
export default function FrontPage() {
  const [lead, setLead] = useState<EditorialStory | null>(null);
  const [isPlaceholder, setIsPlaceholder] = useState(true);

  useEffect(() => {
    void getSectionArticle("lead").then((result) => {
      if (result.article) setLead(storyFromArticle(result.article));
      setIsPlaceholder(result.isPlaceholder || !result.article);
    });
  }, []);

  const story = lead ?? FALLBACK_LEAD;
  const href = isPlaceholder ? "#front-page" : story.href;
  const heroSrc = safeImageSrc(story.image) ?? "/media/justice.png";

  return (
    <section id="lead" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial statement + pull-quote */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-0 lg:col-span-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8B1E1E]">
              01 • From the Masthead
            </p>

            <h1 className="mt-4 text-balance font-serif text-4xl leading-[1.1] tracking-tight text-amber-950 md:text-5xl">
              {EDITORIAL_STATEMENT.headline}
            </h1>

            <p className="mt-4 border-l-2 border-slate-200 pl-4 font-serif text-xl italic leading-relaxed text-neutral-500">
              {EDITORIAL_STATEMENT.standfirst}
            </p>

            <blockquote className="mt-8 border-l-2 border-[#8B1E1E] bg-amber-50/40 p-5">
              <Quote size={20} className="text-[#8B1E1E]" />
              <p className="mt-3 font-serif text-xl leading-snug text-amber-950">
                {PULL_QUOTE.quote}
              </p>
              <footer className="mt-3 text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                {PULL_QUOTE.attribution}
              </footer>
            </blockquote>

            <ul className="mt-8 space-y-4">
              {PRINCIPLES.map(({ icon: Icon, title, detail }) => (
                <li key={title} className="flex gap-3 border-t border-slate-200 pt-4">
                  <Icon size={16} className="mt-1 shrink-0 text-[#8B1E1E]" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The lead story */}
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-w-0 lg:col-span-8 lg:border-l lg:border-slate-200 lg:pl-12"
          >
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-neutral-500">
              <span className="font-semibold text-[#8B1E1E]">{story.category}</span>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={13} />
                {story.readingTime} min read
              </span>
            </div>

            <figure className="mt-4">
              <Link href={href} className="block overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={"/media/justice.png"}
                  alt={story.imageAlt || story.title}
                  width={1200}
                  height={675}
                  preload
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </Link>
              {story.imageCaption && (
                <figcaption className="mt-3 text-xs italic text-neutral-500">
                  {story.imageCaption}
                </figcaption>
              )}
            </figure>

            <h2 className="mt-5 text-balance font-serif text-3xl leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
              <Link href={href} className="transition-colors hover:text-[#8B1E1E]">
                {story.title}
              </Link>
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">{story.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-2">
                <User2 size={15} />
                {story.author}
              </span>

              {story.date && <span>{story.date}</span>}

              <Link
                href={href}
                className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.18em] text-[#8B1E1E] transition-colors hover:text-[#731818]"
              >
                Continue Reading
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>

        </div>
      </div>
    </section>
  );
}

