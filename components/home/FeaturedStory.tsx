"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, CalendarDays, User2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedStory() {
  return (
    <section className="bg-[#faf8f3] py-28 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Heading */}

        <div className="flex items-center gap-5 mb-20">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#8B1E1E]">
            02 • Featured Story
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Image */}

          <motion.figure
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden">

              <Image
                src="/images/editorial/supreme-court.jpg"
                alt="Supreme Court"
                width={1400}
                height={900}
                className="aspect-[4/3] object-cover w-full transition-transform duration-700 hover:scale-[1.03]"
              />

            </div>

            <figcaption className="mt-4 text-sm text-neutral-500 italic">
              Supreme Court Building • Editorial Archive
            </figcaption>

          </motion.figure>

          {/* Story */}

          <motion.article
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7 }}
            className="lg:col-span-5"
          >

            <p className="uppercase tracking-[0.3em] text-xs text-[#8B1E1E] font-semibold">
              Constitutional Law
            </p>

            <h2 className="mt-5 font-serif text-5xl leading-tight text-neutral-900">
              How One Supreme Court Decision Quietly Reshaped
              Administrative Justice
            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-700">
              Most constitutional judgments disappear into legal databases,
              referenced only by scholars and practitioners. Others quietly
              redefine governance for decades.

              This analysis examines one overlooked decision whose influence
              extends far beyond the courtroom, affecting administrative
              justice, public accountability and institutional independence
              throughout Africa.
            </p>

            {/* Metadata */}

            <div className="grid grid-cols-2 gap-6 mt-12 text-sm text-neutral-600">

              <div className="flex items-center gap-2">
                <User2 size={16} />
                Editorial Desk
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                14 min read
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                5 July 2026
              </div>

              <div>
                Global Edition
              </div>

            </div>

            {/* Editorial Rule */}

            <div className="my-12 h-px bg-neutral-300" />

            <Link
              href="/articles/how-one-supreme-court-decision"
              className="inline-flex items-center gap-3 font-semibold text-[#8B1E1E] group"
            >
              Read the Full Analysis

              <ArrowRight className="transition-transform group-hover:translate-x-1" />

            </Link>

          </motion.article>

        </div>

      </div>
    </section>
  );
}