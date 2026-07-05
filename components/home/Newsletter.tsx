"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="bg-[#f4f1ea] py-28 border-y border-neutral-200">
      <div className="max-w-3xl mx-auto px-6 text-center">

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="uppercase tracking-[0.35em] text-xs text-[#8B1E1E] mb-6"
        >
          Stay Informed
        </motion.p>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif text-5xl md:text-6xl text-neutral-900 leading-tight"
        >
          Receive thoughtful legal analysis, not inbox clutter.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: .15 }}
          viewport={{ once: true }}
          className="mt-8 text-lg leading-9 text-neutral-600"
        >
          Join readers who want carefully researched commentary on
          constitutional law, public policy, African development,
          and judicial thought.
        </motion.p>

        <motion.form
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: .3 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col md:flex-row gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="
              flex-1
              border
              border-neutral-300
              bg-white
              px-6
              py-4
              outline-none
              focus:border-[#8B1E1E]
            "
          />

          <button
            className="
              bg-[#8B1E1E]
              text-white
              px-8
              py-4
              inline-flex
              items-center
              justify-center
              gap-3
              hover:bg-[#731818]
              transition-colors
            "
          >
            Subscribe

            <ArrowRight size={18} />
          </button>
        </motion.form>

        <p className="mt-6 text-sm text-neutral-500">
          One thoughtful edition. No spam. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
}