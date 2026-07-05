"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Striking Editorial Statement & Image */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#8B1E1E]" />
                <span className="uppercase tracking-[0.3em] text-xs font-bold text-[#8B1E1E]">
                  01 • The Lead
                </span>
              </div>
              {/* Catchy Newspaper-Style Hero Image Wrapper */}
              <div className="relative w-full aspect-[4/3] rounded bg-neutral-100 overflow-hidden border border-neutral-200 shadow-sm mt-8">
                <Image
                  src="/images/hero-editorial.jpg" // Replace with your actual image path
                  alt="Law and society in motion editorial artwork"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out"
                  sizes="(max-w-1024px) 100vw, 33vw"
                  priority
                />
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-[1.1] tracking-tight">
                Law is more than precedent.
              </h1>
              
              <p className="font-serif italic text-xl text-neutral-500 leading-relaxed border-l-2 border-neutral-200 pl-4">
                It is the story of society in motion.
              </p>

              
            </motion.div>
          </div>

          {/* Right Column: Featured Front-Page Article */}
          <div className="lg:col-span-8 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-12 lg:pt-0 lg:pl-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link href="/articles/how-a-quiet-supreme-court-decision" className="group block space-y-6">
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-neutral-500 font-medium">
                  <span>Constitutional Law</span>
                  <span>•</span>
                  <span>14 min read</span>
                </div>

                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-neutral-900 leading-[1.15] tracking-tight group-hover:text-[#8B1E1E] transition-colors duration-300">
                  How a Quiet Supreme Court Decision Could Redefine Administrative Justice Across Africa
                </h2>

                <p className="text-neutral-600 text-lg md:text-xl leading-relaxed max-w-3xl">
                  Behind seemingly technical constitutional language lies a judgment capable of reshaping 
                  administrative law, accountability, and institutional independence for decades to come.
                </p>

                <div className="inline-flex items-center gap-3 text-[#8B1E1E] font-semibold tracking-wider text-sm uppercase pt-4 border-b border-transparent group-hover:border-[#8B1E1E] transition-all">
                  Continue Reading
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}