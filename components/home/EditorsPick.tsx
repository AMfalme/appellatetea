"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { PlaceholderBadge } from "./PlaceholderBadge";

const essays = [
  {
    category: "Judicial Appointments",
    title:
      "Preparing for the Bench: What Every Judicial Candidate Should Understand Beyond the Law.",
    read: "12 min read",
  },
  {
    category: "African Development",
    title:
      "Why Strong Institutions Matter More Than Strong Leaders.",
    read: "9 min read",
  },
  {
    category: "Social Philosophy",
    title:
      "Can Law Change Society, or Does Society Change the Law First?",
    read: "11 min read",
  },
];

export default function EditorsPick() {
  return (
    <section className="bg-neutral-950 text-white py-28">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

          <div className="flex items-center gap-5 mb-20">

            <div className="flex-1 h-px bg-neutral-700" />

            <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#d24a43]">
             04 • From the Editor's Desk
            </span>
            <PlaceholderBadge />

            <div className="flex-1 h-px bg-neutral-700" />

          </div>

        {/* Editorial */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >

          <Quote
            className="mx-auto mb-8 text-[#d24a43]"
            size={42}
          />

          <h2 className="font-serif text-5xl md:text-6xl leading-tight">

            Every judgment deserves more than a summary.

          </h2>

          <p className="mt-10 text-xl leading-9 text-neutral-300">

            Courts resolve disputes, but they also reveal the values,
            tensions and aspirations of society.

            At Appellate Tea, we believe legal analysis should move
            beyond citations and precedent to explore the historical,
            political and philosophical questions that shape public life.

          </p>

          <div className="mt-10 text-sm uppercase tracking-[0.3em] text-neutral-500">

            — Editorial Board

          </div>

        </motion.div>

        {/* Essays */}

        <div className="grid lg:grid-cols-3 gap-12 mt-24">

          {essays.map((essay, index) => (

            <motion.article
              key={essay.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * .08 }}
              className="group border-t border-neutral-700 pt-8"
            >

              <p className="uppercase tracking-[0.25em] text-[11px] font-semibold text-[#d24a43]">

                {essay.category}

              </p>

              <h3 className="mt-5 font-serif text-3xl leading-snug group-hover:text-[#8B1E1E] transition-colors">

                <Link href="#">

                  {essay.title}

                </Link>

              </h3>

              <div className="mt-8 flex items-center gap-2 text-sm text-neutral-400">

                <Clock3 size={15} />

                {essay.read}

              </div>

              <Link
                href="#"
                className="
                  inline-flex
                  items-center
                  gap-3
                  mt-8
                  font-semibold
                  text-[#d24a43]
                  group
                "
              >

                Read Essay

                <ArrowRight
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

              </Link>

            </motion.article>

          ))}

        </div>

      </div>

    </section>
  );
}