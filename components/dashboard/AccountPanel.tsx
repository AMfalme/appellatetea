"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  {
    title: "Supreme Court",
    followers: "142 Articles",
    description:
      "Landmark judgments, constitutional interpretation and precedent.",
  },
  {
    title: "Constitutional Law",
    followers: "96 Articles",
    description:
      "Fundamental rights, governance and constitutional litigation.",
  },
  {
    title: "Parliament",
    followers: "84 Articles",
    description:
      "Bills, parliamentary debates and legislative reform.",
  },
  {
    title: "Public Policy",
    followers: "73 Articles",
    description:
      "Government decisions, institutions and public administration.",
  },
  {
    title: "African Development",
    followers: "61 Articles",
    description:
      "Law, governance and sustainable development across Africa.",
  },
  {
    title: "Social Philosophy",
    followers: "45 Articles",
    description:
      "Ideas that connect law, ethics and society.",
  },
];

export default function ReadingInterestsSection() {
  return (
    <section className="bg-[#faf8f3] border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

        {/* Heading */}

        <div className="flex items-center gap-5 mb-16">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Your Reading Interests
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        {/* Intro */}

        <div className="max-w-3xl mb-16">

          <h2 className="font-serif text-5xl leading-tight text-neutral-900">

            Topics shaping your personal edition.

          </h2>

          <p className="mt-8 text-lg leading-9 text-neutral-700">

            Follow subjects that matter to your work and interests.
            Your recommendations and daily edition become more relevant
            as your reading preferences evolve.

          </p>

        </div>

        {/* Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-neutral-200">

          {topics.map((topic, index) => (

            <motion.article
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="
                group
                border-r
                border-b
                border-neutral-200
                p-8
                hover:bg-white
                transition-colors
              "
            >

              <p className="uppercase tracking-[0.25em] text-[11px] text-[#8B1E1E] mb-4">

                {topic.followers}

              </p>

              <h3 className="font-serif text-3xl leading-tight text-neutral-900 group-hover:text-[#8B1E1E] transition-colors">

                {topic.title}

              </h3>

              <p className="mt-5 text-neutral-600 leading-8">

                {topic.description}

              </p>

              <Link
                href="#"
                className="
                  mt-8
                  inline-flex
                  items-center
                  gap-2
                  uppercase
                  tracking-[0.18em]
                  text-xs
                  font-semibold
                  text-[#8B1E1E]
                  group/link
                "
              >

                Browse Topic

                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                />

              </Link>

            </motion.article>

          ))}

        </div>

      </div>

    </section>
  );
}