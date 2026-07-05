"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { motion } from "framer-motion";

const briefs = [
  {
    category: "Parliament",
    title: "Why Kenya's latest data protection amendments deserve closer scrutiny.",
    time: "6 min read",
  },
  {
    category: "Policy",
    title: "The growing influence of constitutional commissions across East Africa.",
    time: "5 min read",
  },
  {
    category: "Development",
    title: "Infrastructure, law and public trust: an overlooked relationship.",
    time: "7 min read",
  },
];

const stories = [
  {
    category: "Social Philosophy",
    title: "When justice becomes memory: why societies never forget landmark judgments.",
    read: "8 min",
  },
  {
    category: "Judiciary",
    title: "Inside the quiet evolution of judicial appointments across Africa.",
    read: "10 min",
  },
  {
    category: "Constitution",
    title: "Can constitutional interpretation keep pace with technology?",
    read: "11 min",
  },
];

export default function EditorialGrid() {
  return (
    <section className="bg-[#faf8f3] py-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}

        <div className="flex items-center gap-5 mb-16">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Latest Analysis
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Main Story */}

          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <Image
              src="/images/editorial/parliament.jpg"
              alt=""
              width={1200}
              height={700}
              className="aspect-[16/9] object-cover w-full mb-8"
            />

            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#8B1E1E] mb-3">
              Parliament
            </p>

            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-neutral-900">
              Beyond the Bill: How Legislative Drafting Quietly Shapes National
              Identity
            </h2>

            <p className="mt-6 text-lg leading-9 text-neutral-700">
              Every bill carries assumptions about society, power and public
              life. Looking beyond political debate reveals how legislative
              drafting influences future generations.
            </p>

            <div className="flex items-center gap-6 mt-8 text-sm text-neutral-500">

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                9 min read
              </span>

              <span>Editorial Desk</span>

            </div>

            <Link
              href="#"
              className="inline-flex items-center gap-3 mt-8 text-[#8B1E1E] font-medium group"
            >
              Read Analysis

              <ArrowRight className="transition-transform group-hover:translate-x-1" />

            </Link>
          </motion.article>

          {/* Briefs */}

          <aside className="lg:col-span-4">

            <h3 className="uppercase tracking-[0.25em] text-xs font-semibold text-neutral-500 mb-8">
              Latest Briefs
            </h3>

            <div className="space-y-8">

              {briefs.map((brief) => (
                <article
                  key={brief.title}
                  className="border-b border-neutral-200 pb-8"
                >
                  <p className="uppercase tracking-[0.2em] text-[11px] text-[#8B1E1E] mb-2">
                    {brief.category}
                  </p>

                  <h4 className="font-serif text-2xl leading-snug hover:text-[#8B1E1E] transition-colors">
                    <Link href="#">
                      {brief.title}
                    </Link>
                  </h4>

                  <p className="text-sm text-neutral-500 mt-3">
                    {brief.time}
                  </p>

                </article>
              ))}

            </div>

          </aside>

        </div>

        {/* Lower Stories */}

        <div className="grid md:grid-cols-3 gap-12 mt-24">

          {stories.map((story) => (
            <motion.article
              key={story.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-t border-neutral-300 pt-6"
            >

              <p className="uppercase tracking-[0.25em] text-[11px] text-[#8B1E1E] font-semibold mb-3">
                {story.category}
              </p>

              <h3 className="font-serif text-3xl leading-snug hover:text-[#8B1E1E] transition-colors">

                <Link href="#">
                  {story.title}
                </Link>

              </h3>

              <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">

                <Clock3 size={15} />

                {story.read} read

              </div>

            </motion.article>
          ))}

        </div>

      </div>
    </section>
  );
}