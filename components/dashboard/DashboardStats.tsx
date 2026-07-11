"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "14",
    label: "Saved Articles",
    description: "Ready to revisit",
  },
  {
    value: "9",
    label: "Reading Streak",
    description: "Consecutive days",
  },
  {
    value: "23",
    label: "Notebook Entries",
    description: "Personal annotations",
  },
  {
    value: "8",
    label: "Followed Topics",
    description: "Legal interests",
  },
];

export default function DashboardStats() {
  return (
    <section className="bg-[#faf8f3] border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200 border-y border-neutral-200">

          {stats.map((stat, index) => (

            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="py-10 px-6 text-center"
            >

              <p className="font-serif text-5xl text-neutral-900">

                {stat.value}

              </p>

              <p className="mt-4 uppercase tracking-[0.28em] text-[11px] font-semibold text-[#8B1E1E]">

                {stat.label}

              </p>

              <p className="mt-3 text-sm text-neutral-500">

                {stat.description}

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}