"use client";

import { motion } from "framer-motion";
import { ArrowRight, Newspaper } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="bg-[#f4f1ea] py-32 border-y border-neutral-200">

      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >

            <div className="flex items-center gap-4 mb-8">

              <Newspaper
                size={34}
                className="text-[#8B1E1E]"
              />

              <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#8B1E1E]">

                07 • The Morning Brief

              </span>

            </div>

            <h2 className="font-serif text-5xl md:text-6xl leading-tight text-neutral-900">

              Begin your week
              <br />
              with thoughtful legal analysis.

            </h2>

            <p className="mt-8 text-lg leading-9 text-neutral-700">

              Receive our editorial briefing featuring landmark judgments,
              policy developments, parliamentary debates and long-form
              commentary delivered with clarity—not sensationalism.

            </p>

            <div className="mt-10 space-y-3 text-neutral-600">

              <p>• Weekly editorial briefing</p>

              <p>• Supreme Court & parliamentary updates</p>

              <p>• African development insights</p>

              <p>• No spam. Ever.</p>

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="
              bg-white
              border
              border-neutral-200
              p-10
              shadow-sm
            "
          >

            <h3 className="font-serif text-3xl text-neutral-900">

              Join thousands of thoughtful readers.

            </h3>

            <p className="mt-4 text-neutral-600 leading-8">

              Subscribe to receive one carefully curated edition each week.

            </p>

            <form className="mt-10 space-y-5">

              <input
                type="email"
                placeholder="Your email address"
                className="
                  w-full
                  border
                  border-neutral-300
                  px-6
                  py-4
                  outline-none
                  focus:border-[#8B1E1E]
                "
              />

              <button
                className="
                  w-full
                  bg-[#8B1E1E]
                  hover:bg-[#731818]
                  transition-colors
                  text-white
                  py-4
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                Subscribe

                <ArrowRight size={18} />

              </button>

            </form>

            <p className="mt-6 text-sm text-neutral-500">

              Free forever. Unsubscribe whenever you wish.

            </p>

          </motion.div>

        </div>

      </div>

    </section>
  );
}