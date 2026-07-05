"use client";

import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f3] border-b border-neutral-200">

      {/* subtle background */}
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[length:22px_22px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* Top spacing */}
        <div className="pt-24 pb-20">

          {/* Publication Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="tracking-[0.35em] uppercase text-xs text-[#8B1E1E] font-semibold">
              Digital Publication
            </span>
          </motion.div>

          {/* Logo */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="
              text-center
              font-serif
              font-semibold
              text-neutral-900
              text-6xl
              md:text-8xl
              leading-none
            "
          >
            Appellate Tea
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
            className="origin-center h-px bg-neutral-300 max-w-md mx-auto my-10"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .3 }}
            className="
              max-w-3xl
              mx-auto
              text-center
              text-xl
              md:text-2xl
              leading-relaxed
              text-neutral-700
            "
          >
            Transforming{" "}
            <span className="font-semibold text-neutral-900">
              Supreme Court decisions,
            </span>{" "}
            parliamentary debates and African policy into thoughtful narratives
            that connect law with society.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .45 }}
            className="flex justify-center mt-12"
          >
            <Link
              href="/articles"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#8B1E1E]
                px-8
                py-4
                text-white
                transition-all
                hover:bg-[#701616]
              "
            >
              Read Today's Feature

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

          {/* Featured Story */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .6 }}
            className="
              mt-24
              border-t
              border-neutral-300
              pt-14
            "
          >
            <div className="grid lg:grid-cols-12 gap-12">

              {/* Left */}
              <div className="lg:col-span-8">

                <div className="uppercase tracking-[0.25em] text-xs text-[#8B1E1E] font-semibold mb-4">
                  Featured Analysis
                </div>

                <h2
                  className="
                    font-serif
                    text-4xl
                    md:text-6xl
                    leading-tight
                    text-neutral-900
                  "
                >
                  How a Quiet Supreme Court Decision Could Redefine
                  Administrative Justice Across Africa
                </h2>

                <p
                  className="
                    mt-8
                    text-lg
                    leading-9
                    text-neutral-700
                    max-w-3xl
                  "
                >
                  Behind seemingly technical constitutional language lies a
                  decision capable of reshaping administrative law,
                  accountability and institutional independence for decades to
                  come. We unpack the judgment through history, philosophy and
                  public policy—not just legal doctrine.
                </p>

                <Link
                  href="/articles/how-a-quiet-supreme-court-decision"
                  className="
                    inline-flex
                    items-center
                    gap-3
                    mt-10
                    text-[#8B1E1E]
                    font-semibold
                    hover:gap-4
                    transition-all
                  "
                >
                  Continue Reading

                  <ArrowRight className="h-5 w-5" />
                </Link>

              </div>

              {/* Right Sidebar */}
              <aside className="lg:col-span-4">

                <div className="border-l border-neutral-300 pl-8">

                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Clock3 size={16} />
                    14 min read
                  </div>

                  <div className="space-y-8">

                    <div>

                      <div className="uppercase tracking-widest text-xs text-[#8B1E1E] mb-2">
                        Category
                      </div>

                      <p className="text-neutral-900 font-medium">
                        Constitutional Law
                      </p>

                    </div>

                    <div>

                      <div className="uppercase tracking-widest text-xs text-[#8B1E1E] mb-2">
                        Published
                      </div>

                      <p className="text-neutral-700">
                        July 2026
                      </p>

                    </div>

                    <div>

                      <div className="uppercase tracking-widest text-xs text-[#8B1E1E] mb-2">
                        Themes
                      </div>

                      <div className="space-y-2 text-neutral-700">

                        <p>Judicial Independence</p>

                        <p>Administrative Justice</p>

                        <p>Public Accountability</p>

                        <p>African Development</p>

                      </div>

                    </div>

                  </div>

                </div>

              </aside>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}