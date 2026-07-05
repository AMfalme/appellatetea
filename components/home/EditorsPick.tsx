"use client";

import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { motion } from "framer-motion";

const picks = [
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
    <section className="bg-neutral-950 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex items-center gap-5 mb-16">

          <div className="flex-1 h-px bg-neutral-700" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#d24a43]">
            Editor's Picks
          </span>

          <div className="flex-1 h-px bg-neutral-700" />

        </div>

        <div className="grid lg:grid-cols-3 gap-12">

          {picks.map((pick, index) => (
            <motion.article
              key={pick.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-t border-neutral-700 pt-6"
            >
              <p className="uppercase tracking-[0.25em] text-[11px] text-[#d24a43] mb-3">
                {pick.category}
              </p>

              <h3 className="font-serif text-3xl leading-snug hover:text-[#d24a43] transition-colors">
                <Link href="#">
                  {pick.title}
                </Link>
              </h3>

              <div className="flex items-center gap-2 mt-6 text-sm text-neutral-400">
                <Clock3 size={15} />
                {pick.read}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 mt-8 text-sm uppercase tracking-widest text-[#d24a43] group"
              >
                Read Essay

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </motion.article>
          ))}

        </div>

      </div>
    </section>
  );
}