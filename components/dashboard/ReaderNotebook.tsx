"use client";

import Link from "next/link";
import { ArrowRight, NotebookPen, Quote } from "lucide-react";
import { motion } from "framer-motion";

const notes = [
  {
    article: "Administrative Justice Across Africa",
    note:
      "The court distinguishes procedural fairness from substantive review—an important shift for future constitutional litigation.",
    date: "Today",
  },
  {
    article: "Judicial Appointments",
    note:
      "Judicial independence depends as much on transparent appointment processes as it does on constitutional safeguards.",
    date: "Yesterday",
  },
  {
    article: "Public Participation",
    note:
      "Meaningful consultation requires influence, not merely attendance.",
    date: "3 days ago",
  },
];

export default function ReaderNotebookSection() {
  return (
    <section className="bg-[#faf8f3] border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

        {/* Heading */}

        <div className="flex items-center gap-5 mb-16">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Reader's Notebook
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >

            <NotebookPen
              className="text-[#8B1E1E] mb-6"
              size={42}
            />

            <h2 className="font-serif text-5xl leading-tight text-neutral-900">

              Your legal thinking,
              captured over time.

            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-700">

              Every highlight, quotation and observation you make becomes
              part of your personal legal notebook, helping you revisit
              important arguments long after you've finished reading.

            </p>

            <Link
              href="#"
              className="inline-flex items-center gap-3 mt-10 font-semibold text-[#8B1E1E] group"
            >

              View All Notes

              <ArrowRight className="transition-transform group-hover:translate-x-1" />

            </Link>

          </motion.div>

          {/* Notes */}

          <div className="lg:col-span-8 space-y-10">

            {notes.map((note, index) => (

              <motion.article
                key={note.article}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="border-l-2 border-[#8B1E1E] pl-8"
              >

                <div className="flex items-center gap-3 mb-5">

                  <Quote
                    size={18}
                    className="text-[#8B1E1E]"
                  />

                  <span className="uppercase tracking-[0.25em] text-[11px] font-semibold text-[#8B1E1E]">

                    {note.article}

                  </span>

                </div>

                <blockquote className="font-serif text-2xl leading-relaxed text-neutral-900">

                  “{note.note}”

                </blockquote>

                <p className="mt-6 text-sm text-neutral-500">

                  Added {note.date}

                </p>

              </motion.article>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}