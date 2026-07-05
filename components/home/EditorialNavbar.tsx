"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  "Supreme Court",
  "Parliament",
  "Policy",
  "African Development",
  "Social Philosophy",
  "Essays",
];

export default function EditorialNavbar() {
  return (
    <>
      {/* Top ribbon */}
      <div className="border-b border-neutral-200 bg-[#faf8f3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-10 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-neutral-500">

          <span>Independent Legal Publication</span>

          <span>ISSUE 001 · JULY 2026</span>

        </div>
      </div>

      {/* Main Navigation */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="
          sticky
          top-0
          z-50
          backdrop-blur-md
          bg-[#faf8f3]/95
          border-b
          border-neutral-200
        "
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="h-20 flex items-center justify-between">

            {/* Left */}
            <button
              className="
                lg:hidden
                p-2
                rounded-full
                hover:bg-neutral-100
              "
            >
              <Menu size={22} />
            </button>

            {/* Logo */}

            <Link href="/" className="group">

              <div className="flex flex-col">

                <span className="font-serif text-3xl font-semibold tracking-tight text-neutral-900">
                  Appellate Tea
                </span>

                <span className="text-[10px] uppercase tracking-[0.35em] text-[#8B1E1E]">
                  Law · Policy · Society
                </span>

              </div>

            </Link>

            {/* Search */}

            <button
              className="
                rounded-full
                p-3
                hover:bg-neutral-100
                transition-colors
              "
            >
              <Search className="h-5 w-5" />
            </button>

          </div>

          {/* Desktop Menu */}

          <nav className="hidden lg:flex justify-center">

            <ul className="flex gap-10 py-4">

              {sections.map((item) => (
                <li key={item}>

                  <Link
                    href="#"
                    className="
                      relative
                      text-sm
                      uppercase
                      tracking-[0.12em]
                      text-neutral-700
                      hover:text-[#8B1E1E]
                      transition-colors
                      after:absolute
                      after:left-0
                      after:-bottom-2
                      after:h-px
                      after:w-0
                      after:bg-[#8B1E1E]
                      hover:after:w-full
                      after:transition-all
                    "
                  >
                    {item}
                  </Link>

                </li>
              ))}

            </ul>

          </nav>

        </div>
      </motion.header>
    </>
  );
}