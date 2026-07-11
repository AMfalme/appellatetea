"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, CalendarDays, User2 } from "lucide-react";
import { motion } from "framer-motion";
import { getSectionArticle } from "@/lib/services/newspaper";
import { PlaceholderBadge } from "./PlaceholderBadge";
import type { Article } from "@/lib/types/article";

export default function FeaturedStory() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useEffect(() => {
    void getSectionArticle('featured').then((result) => {
      setArticle(result.article);
      setIsPlaceholder(result.isPlaceholder);
    });
  }, []);

  // Always render with fallback placeholder content
  const displayArticle = article || {
    title: "The Quiet Constitutional Revolution Hidden Inside Recent Judicial Decisions",
    excerpt: "Exploring how recent Supreme Court decisions are reshaping administrative law and constitutional governance across the continent.",
    category: "Supreme Court",
    readingTime: 12,
    slug: "featured-placeholder",
    heroImage: { url: "/media/supreme.jpg", alt: "Supreme Court building" }
  };

  return (
    <section className=" py-28 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Heading */}

        <div className="flex items-center gap-5 mb-20">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#8B1E1E]">
            02 • Featured Story
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Image */}

          <motion.figure
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden">

              <Image
                src={displayArticle.heroImage?.url || "/media/supreme.jpg"}
                alt={displayArticle.heroImage?.alt || displayArticle.title}
                width={1400}
                height={900}
                className="aspect-[4/3] object-cover w-full transition-transform duration-700 hover:scale-[1.03]"
              />

            </div>

            <figcaption className="mt-4 text-sm text-neutral-500 italic">
              Supreme Court Building • Editorial Archive
            </figcaption>

          </motion.figure>

          {/* Story */}

          <motion.article
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="lg:col-span-5"
          >

            <div className="flex items-center gap-3">
              <p className="uppercase tracking-[0.3em] text-xs text-[#8B1E1E] font-semibold">
                {displayArticle.category}
              </p>
              <PlaceholderBadge />
            </div>

            <h2 className="mt-5 font-serif text-5xl leading-tight text-neutral-900">
              {displayArticle.title}
            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-700">
              {displayArticle.excerpt}
            </p>

            {/* Metadata */}

            <div className="grid grid-cols-2 gap-6 mt-12 text-sm text-neutral-600">

              <div className="flex items-center gap-2">
                <User2 size={16} />
                Editorial Desk
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                {displayArticle.readingTime} min read
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                {new Date().toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}
              </div>

              <div>
                Global Edition
              </div>

            </div>

            {/* Editorial Rule */}

            <div className="my-12 h-px bg-neutral-300" />

            <Link
              href={displayArticle.slug && !isPlaceholder ? `/articles/${displayArticle.slug}` : '#'}
              className="inline-flex items-center gap-3 font-semibold text-[#8B1E1E] group"
            >
              Read the Full Analysis

              <ArrowRight className="transition-transform group-hover:translate-x-1" />

            </Link>

          </motion.article>

        </div>

      </div>
    </section>
  );
}