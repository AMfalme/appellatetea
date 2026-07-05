"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f3]">

      {/* Paper Texture */}

      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[length:22px_22px]" />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-28">

        {/* Section Number */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-12"
        >
          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#8B1E1E]">
            01 • Editorial
          </span>

          <div className="flex-1 h-px bg-neutral-300" />
        </motion.div>

        {/* Editorial Statement */}

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .1 }}
          className="
            font-serif
            text-center
            text-5xl
            md:text-7xl
            leading-[1.08]
            text-neutral-900
          "
        >
          Law is more than precedent.
          <br />
          It is the story of society in motion.
        </motion.h1>

        {/* Supporting Copy */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .25 }}
          className="
            mt-10
            max-w-3xl
            mx-auto
            text-center
            text-xl
            leading-9
            text-neutral-600
          "
        >
          Appellate Tea explores Supreme Court decisions,
          legislative reform, public policy and African development
          through thoughtful editorial analysis that places people,
          institutions and history at the centre of every story.
        </motion.p>

        {/* Today's Lead */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .45 }}
          className="
            mt-24
            border-y
            border-neutral-300
            py-10
          "
        >

          <div className="uppercase tracking-[0.35em] text-xs text-[#8B1E1E] font-semibold mb-6">

            Today's Lead Essay

          </div>

          <Link
            href="/articles/how-a-quiet-supreme-court-decision"
            className="group block"
          >

            <h2
              className="
                font-serif
                text-4xl
                md:text-5xl
                leading-tight
                text-neutral-900
                group-hover:text-[#8B1E1E]
                transition-colors
              "
            >
              How a Quiet Supreme Court Decision Could Redefine
              Administrative Justice Across Africa
            </h2>

            <p
              className="
                mt-8
                max-w-3xl
                text-lg
                leading-9
                text-neutral-600
              "
            >
              Behind seemingly technical constitutional language
              lies a judgment capable of reshaping administrative
              law, accountability and institutional independence
              for decades to come.
            </p>

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-6
                text-sm
                uppercase
                tracking-widest
                text-neutral-500
              "
            >
              <span>14 min read</span>

              <span>•</span>

              <span>Constitutional Law</span>

              <span>•</span>

              <span>Editorial Analysis</span>
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-3
                mt-10
                text-[#8B1E1E]
                font-semibold
              "
            >
              Continue Reading

              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </div>

          </Link>

        </motion.div>

      </div>

    </section>
  );
}