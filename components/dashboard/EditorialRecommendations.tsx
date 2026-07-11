"use client";

import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { PlaceholderBadge } from "@/components/home/PlaceholderBadge";

const recommendations = [
  {
    category: "Supreme Court",
    title:
      "The Quiet Constitutional Revolution Hidden Inside Recent Judicial Decisions",
    read: "12 min read",
  },
  {
    category: "Parliament",
    title:
      "Why Legislative Drafting Matters More Than Parliamentary Debate",
    read: "8 min read",
  },
  {
    category: "Social Philosophy",
    title:
      "Justice, Memory and the Stories Every Constitution Leaves Behind",
    read: "10 min read",
  },
];

interface EditorialRecommendationsProps {
  isPlaceholder?: boolean;
}

export default function EditorialRecommendationsSection({ isPlaceholder = false }: EditorialRecommendationsProps) {
  return (
    <section className="bg-[#faf8f3] border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

        {/* Heading */}

        <div className="flex items-center gap-3 mb-16">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Editor's Desk
          </span>
          {isPlaceholder && <PlaceholderBadge />}
          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Featured Recommendation */}

          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >

            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#8B1E1E] mb-5">
              Recommended For You
            </p>

            <h2 className="font-serif text-5xl leading-tight text-neutral-900">

              Constitutional Interpretation Is Quietly Becoming Africa's Most
              Important Public Conversation

            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-700">

              Based on your recent reading history, this editorial continues the
              themes of judicial accountability, constitutional governance and
              institutional reform explored in your previous articles.

            </p>

            <div className="flex items-center gap-6 mt-10 text-sm text-neutral-500">

              <span className="flex items-center gap-2">

                <Clock3 size={15} />

                15 min read

              </span>

              <span>Editor's Recommendation</span>

            </div>

            <Link
              href="#"
              className="inline-flex items-center gap-3 mt-10 text-[#8B1E1E] font-semibold group"
            >

              Read Editorial

              <ArrowRight className="transition-transform group-hover:translate-x-1" />

            </Link>

          </motion.article>

          {/* Sidebar */}

          <aside className="lg:col-span-5 border-l border-neutral-300 lg:pl-10">

            <p className="uppercase tracking-[0.25em] text-xs text-neutral-500 mb-8">

              More Recommendations

            </p>

            <div className="space-y-8">

              {recommendations.map((article, index) => (

                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="border-b border-neutral-200 pb-8"
                >

                  <p className="uppercase tracking-[0.2em] text-[11px] text-[#8B1E1E] mb-3">

                    {article.category}

                  </p>

                  <h3 className="font-serif text-2xl leading-snug hover:text-[#8B1E1E] transition-colors">

                    <Link href="#">

                      {article.title}

                    </Link>

                  </h3>

                  <div className="flex items-center gap-2 mt-4 text-sm text-neutral-500">

                    <Clock3 size={14} />

                    {article.read}

                  </div>

                </motion.article>

              ))}

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}