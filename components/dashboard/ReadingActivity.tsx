"use client";

import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Clock3, NotebookPen } from "lucide-react";

const metrics = [
  {
    icon: BookOpen,
    label: "Articles Read",
    value: "18",
    description: "This month",
  },
  {
    icon: Clock3,
    label: "Reading Time",
    value: "12 hrs",
    description: "Across all essays",
  },
  {
    icon: NotebookPen,
    label: "Notes Written",
    value: "23",
    description: "Personal annotations",
  },
  {
    icon: TrendingUp,
    label: "Reading Streak",
    value: "9 Days",
    description: "Keep it going",
  },
];

export default function ReadingActivitySection() {
  return (
    <section className="bg-[#faf8f3] border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

        {/* Heading */}

        <div className="flex items-center gap-5 mb-16">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">
            Reading Activity
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Editorial Summary */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >

            <p className="uppercase tracking-[0.3em] text-xs text-[#8B1E1E] mb-5">

              Monthly Summary

            </p>

            <h2 className="font-serif text-5xl leading-tight text-neutral-900">

              A month of thoughtful legal reading.

            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-700">

              Your reading habits continue to focus on constitutional law,
              judicial accountability and African governance. Keep building
              momentum by completing your saved editorials and discovering new
              perspectives from this week's edition.

            </p>

          </motion.div>

          {/* Statistics */}

          <div className="lg:col-span-7">

            <div className="border border-neutral-200 divide-y divide-neutral-200">

              {metrics.map((metric, index) => {

                const Icon = metric.icon;

                return (

                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between px-8 py-8"
                  >

                    <div className="flex items-center gap-5">

                      <Icon
                        size={22}
                        className="text-[#8B1E1E]"
                      />

                      <div>

                        <h3 className="font-medium text-neutral-900">

                          {metric.label}

                        </h3>

                        <p className="text-sm text-neutral-500">

                          {metric.description}

                        </p>

                      </div>

                    </div>

                    <span className="font-serif text-4xl text-neutral-900">

                      {metric.value}

                    </span>

                  </motion.div>

                );

              })}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}