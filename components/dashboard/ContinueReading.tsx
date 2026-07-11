"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, Clock3 } from "lucide-react";

interface ReadingContinueProps {
  article?: {
    title: string;
    excerpt: string;
    category: string;
    progress: number;
    readTime: string;
    href: string;
  };
}

export default function ContinueReadingPanel({
  article = {
    title:
      "How Administrative Justice Could Redefine Constitutional Governance Across Africa",
    excerpt:
      "Continue exploring the landmark judgment that is quietly reshaping administrative fairness, judicial accountability, and constitutional governance throughout the continent.",
    category: "Constitutional Law",
    progress: 72,
    readTime: "14 min read",
    href: "/articles/how-administrative-justice-could-redefine-governance",
  },
}: ReadingContinueProps) {
  return (
    <section className="bg-[#faf8f3] border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

        <div className="grid lg:grid-cols-12 gap-14">

          {/* Main Story */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >

            <p className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E] mb-6">

              Continue Reading

            </p>

            <h2 className="font-serif text-4xl md:text-6xl leading-tight text-neutral-900">

              {article.title}

            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-neutral-700">

              {article.excerpt}

            </p>

            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-neutral-500">

              <span className="uppercase tracking-[0.25em] text-[#8B1E1E]">
                {article.category}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {article.readTime}
              </span>

            </div>

            <Link
              href={article.href}
              className="
                inline-flex
                items-center
                gap-3
                mt-12
                font-semibold
                text-[#8B1E1E]
                group
              "
            >

              Continue Reading

              <ArrowRight
                className="
                  h-5
                  w-5
                  transition-transform
                  group-hover:translate-x-1
                "
              />

            </Link>

          </motion.div>

          {/* Reading Progress */}

          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >

            <div className="border-l border-neutral-300 pl-8">

              <p className="uppercase tracking-[0.3em] text-xs text-[#8B1E1E] mb-8">

                Reading Progress

              </p>

              <div className="text-6xl font-serif text-neutral-900">

                {article.progress}%

              </div>

              <div className="mt-6 h-2 bg-neutral-200 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${article.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-[#8B1E1E]"
                />

              </div>

              <p className="mt-5 text-neutral-600 leading-8">

                You've completed <strong>{article.progress}%</strong> of this
                editorial. Pick up exactly where you left off.

              </p>

              <div className="border-t border-neutral-200 mt-10 pt-8 space-y-5">

                <div className="flex justify-between text-sm">

                  <span className="text-neutral-500">
                    Estimated Time Left
                  </span>

                  <span className="font-medium text-neutral-900">
                    4 minutes
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-neutral-500">
                    Last Opened
                  </span>

                  <span className="font-medium text-neutral-900">
                    Today
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-neutral-500">
                    Saved
                  </span>

                  <span className="flex items-center gap-2 font-medium text-neutral-900">

                    <Bookmark size={14} />

                    Yes

                  </span>

                </div>

              </div>

            </div>

          </motion.aside>

        </div>

      </div>

    </section>
  );
}