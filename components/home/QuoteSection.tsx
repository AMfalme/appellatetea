"use client";

import { motion } from "framer-motion";
import { Scale, Landmark, Globe2 } from "lucide-react";

const principles = [
  {
    icon: Scale,
    title: "Beyond Case Summaries",
    description:
      "We explain why judgments matter, not simply what courts decided.",
  },
  {
    icon: Landmark,
    title: "Law in Context",
    description:
      "Every decision is connected to politics, institutions, history and society.",
  },
  {
    icon: Globe2,
    title: "An African Perspective",
    description:
      "Grounded in African legal systems while engaging global constitutional thought.",
  },
];

export default function QuoteSection() {
  return (
    <section className="bg-[#8B1E1E] text-white py-28">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >

          <p className="uppercase tracking-[0.4em] text-xs text-red-200 mb-8">
            06 • Why Appellate Tea Exists
          </p>

          <h2 className="font-serif text-5xl md:text-6xl leading-tight">

            Law deserves explanation,
            <br />
            not simplification.

          </h2>

          <p className="mt-10 text-xl leading-9 text-red-100">

            Appellate Tea exists to bridge rigorous legal scholarship and
            accessible storytelling. We believe every judgment, every bill,
            and every policy debate carries a deeper story about people,
            institutions and the future of society.

          </p>

        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 mt-24">

          {principles.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="text-center"
              >

                <div className="flex justify-center mb-6">

                  <Icon
                    size={34}
                    className="text-red-200"
                  />

                </div>

                <h3 className="font-serif text-3xl">

                  {item.title}

                </h3>

                <p className="mt-6 leading-8 text-red-100">

                  {item.description}

                </p>

              </motion.article>

            );

          })}

        </div>

      </div>

    </section>
  );
}