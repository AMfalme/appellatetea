"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturedStory() {
  return (
    <section className="bg-[#faf8f3] py-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Heading */}

        <div className="flex items-center gap-5 mb-14">

          <div className="h-px flex-1 bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Featured Story
          </span>

          <div className="h-px flex-1 bg-neutral-300" />

        </div>

        {/* Story */}

        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Image */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative overflow-hidden">

              <Image
                src="/images/editorial/supreme-court.jpg"
                alt="Supreme Court"
                width={1200}
                height={900}
                className="
                  object-cover
                  aspect-[4/3]
                  w-full
                  transition-transform
                  duration-700
                  hover:scale-105
                "
              />

              <div className="absolute top-6 left-6 bg-[#8B1E1E] text-white text-xs uppercase tracking-[0.25em] px-4 py-2">
                Lead Analysis
              </div>

            </div>
          </motion.div>

          {/* Content */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >

            {/* Category */}

            <p className="uppercase tracking-[0.3em] text-xs text-[#8B1E1E] font-semibold mb-5">
              Constitutional Law
            </p>

            {/* Headline */}

            <h2 className="font-serif text-5xl leading-tight text-neutral-900">

              How One Supreme Court Decision Quietly Reshaped Administrative Justice

            </h2>

            {/* Standfirst */}

            <p className="mt-8 text-lg leading-9 text-neutral-700">

              Most constitutional judgments fade into legal databases,
              referenced only by scholars and practitioners.

              Some, however, alter the trajectory of governance without
              attracting widespread public attention.

              This week's featured analysis explores one such judgment,
              revealing its implications for accountability,
              administrative fairness and democratic institutions
              across Africa.

            </p>

            {/* Meta */}

            <div className="flex flex-wrap gap-6 mt-10 text-sm text-neutral-500">

              <div className="flex items-center gap-2">

                <Clock3 size={16} />

                <span>14 min read</span>

              </div>

              <span>Editorial Desk</span>

              <span>July 2026</span>

            </div>

            {/* CTA */}

            <Link
              href="/articles/how-one-supreme-court-decision"
              className="
                inline-flex
                items-center
                gap-3
                mt-12
                text-[#8B1E1E]
                font-semibold
                group
              "
            >

              Continue Reading

              <ArrowRight
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-2
                "
              />

            </Link>

          </motion.div>

        </div>

      </div>
    </section>
  );
}