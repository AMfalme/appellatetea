"use client";

import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="bg-[#8B1E1E] text-white py-32">

      <div className="max-w-4xl mx-auto px-6 text-center">

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .7 }}
          className="
            uppercase
            tracking-[0.35em]
            text-xs
            text-red-200
            mb-10
          "
        >
          Our Editorial Philosophy
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: .2 }}
          viewport={{ once: true }}
          className="
            font-serif
            text-4xl
            md:text-6xl
            leading-tight
          "
        >
          "The law is never merely about statutes or judgments.
          It is ultimately about people, power, institutions,
          and the stories that shape society."
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: .4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <p className="uppercase tracking-[0.3em] text-sm text-red-200">
            Appellate Tea Editorial Desk
          </p>
        </motion.div>

      </div>

    </section>
  );
}