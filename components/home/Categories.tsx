"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Supreme Court",
    description:
      "Landmark judgments, constitutional interpretation and precedent.",
    articles: "126 Articles",
  },
  {
    title: "Parliament",
    description:
      "Bills, legislative reform and parliamentary debate explained.",
    articles: "84 Articles",
  },
  {
    title: "Policy",
    description:
      "Public policy, governance and institutional reform.",
    articles: "71 Articles",
  },
  {
    title: "African Development",
    description:
      "Law as a catalyst for sustainable growth across the continent.",
    articles: "59 Articles",
  },
  {
    title: "Social Philosophy",
    description:
      "Where legal systems meet history, ethics and society.",
    articles: "43 Articles",
  },
  {
    title: "Judicial Appointments",
    description:
      "Interviews, appointments and judicial leadership analysis.",
    articles: "31 Articles",
  },
];

export default function Categories() {
  return (
    <section className="bg-[#faf8f3] py-24 border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

        <div className="flex items-center gap-5 mb-16">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Explore Topics
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-neutral-200">

          {categories.map((category, index) => (

            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="
                p-8
                border-b
                border-r
                border-neutral-200
                hover:bg-white
                transition-colors
                group
              "
            >

              <div className="text-xs uppercase tracking-[0.25em] text-[#8B1E1E] mb-4">
                {category.articles}
              </div>

              <h3 className="font-serif text-3xl leading-tight text-neutral-900 mb-5 group-hover:text-[#8B1E1E] transition-colors">

                {category.title}

              </h3>

              <p className="text-neutral-600 leading-8 mb-8">

                {category.description}

              </p>

              <Link
                href="#"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  uppercase
                  tracking-widest
                  text-[#8B1E1E]
                "
              >
                Explore

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

              </Link>

            </motion.article>

          ))}

        </div>

      </div>

    </section>
  );
}