"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Supreme Court",
    description:
      "Landmark judgments, constitutional interpretation and precedent.",
    articles: 126,
  },
  {
    title: "Parliament",
    description:
      "Bills, legislative reform and parliamentary debate explained.",
    articles: 84,
  },
  {
    title: "Policy",
    description:
      "Public policy, governance and institutional reform.",
    articles: 71,
  },
  {
    title: "African Development",
    description:
      "Law as a catalyst for sustainable growth across the continent.",
    articles: 59,
  },
  {
    title: "Social Philosophy",
    description:
      "Where legal systems meet history, ethics and society.",
    articles: 43,
  },
  {
    title: "Judicial Appointments",
    description:
      "Appointments, interviews and leadership within the judiciary.",
    articles: 31,
  },
];

export default function Categories() {
  return (
    <section className="bg-[#faf8f3] py-28 border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Heading */}

        <div className="flex items-center gap-5 mb-20">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#8B1E1E]">
            05 • Browse the Publication
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        {/* Intro */}

        <div className="max-w-3xl mb-20">

          <h2 className="font-serif text-5xl md:text-6xl leading-tight text-neutral-900">

            Explore every corner of the publication.

          </h2>

          <p className="mt-8 text-lg leading-9 text-neutral-700">

            Browse our growing collection of long-form essays, legal
            analysis and policy commentary organised by subject.

          </p>

        </div>

        {/* Editorial Index */}

        <div className="border-y border-neutral-300">

          {categories.map((category, index) => (

            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              className="
                border-b
                last:border-b-0
                border-neutral-200
              "
            >

              <Link
                href="#"
                className="
                  group
                  grid
                  lg:grid-cols-12
                  gap-8
                  items-center
                  py-10
                  transition-colors
                  hover:bg-white/60
                "
              >

                {/* Count */}

                <div className="lg:col-span-2">

                  <div className="font-serif text-5xl text-neutral-300">

                    {String(category.articles).padStart(2, "0")}

                  </div>

                </div>

                {/* Title */}

                <div className="lg:col-span-4">

                  <h3
                    className="
                      font-serif
                      text-3xl
                      text-neutral-900
                      group-hover:text-[#8B1E1E]
                      transition-colors
                    "
                  >
                    {category.title}
                  </h3>

                </div>

                {/* Description */}

                <div className="lg:col-span-5">

                  <p className="leading-8 text-neutral-600">

                    {category.description}

                  </p>

                </div>

                {/* Arrow */}

                <div className="lg:col-span-1 flex justify-end">

                  <ArrowRight
                    className="
                      h-6
                      w-6
                      text-neutral-400
                      transition-all
                      group-hover:text-[#8B1E1E]
                      group-hover:translate-x-2
                    "
                  />

                </div>

              </Link>

            </motion.article>

          ))}

        </div>

      </div>

    </section>
  );
}