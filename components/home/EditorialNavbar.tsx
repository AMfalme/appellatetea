"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
  { title: "Latest", href: "/articles" },
  { title: "Supreme Court", href: "/category/supreme-court" },
  { title: "Parliament", href: "/category/parliament" },
  { title: "Policy", href: "/category/policy" },
  { title: "African Development", href: "/category/african-development" },
  { title: "Essays", href: "/category/essays" },
  { title: "About", href: "/about" },
];

export default function EditorialNavbar() {
  const [open, setOpen] = useState(false);

  const today = useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  }, []);

  return (
    <>
      {/* Top Edition Ribbon */}

      <div className="border-b border-neutral-300 bg-[#faf8f3]">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-3 text-[11px] uppercase tracking-[0.22em] text-neutral-500">

            <span>Global Edition</span>

            <span>{today}</span>

            <span>Volume I · Issue 001</span>

          </div>

        </div>

      </div>

      {/* Masthead */}

      <header className="bg-[#faf8f3] border-b border-neutral-300">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

          <div className="border-y border-neutral-300 py-8 text-center">

            <Link href="/" className="inline-block">

              <h1 className="font-serif text-5xl md:text-7xl tracking-tight text-neutral-900">
                Appellate Tea
              </h1>

              <p className="uppercase tracking-[0.45em] text-xs mt-4 text-[#8B1E1E]">
                Law • Policy • Society
              </p>

            </Link>

            <p className="mt-6 max-w-3xl mx-auto text-neutral-600 leading-8 text-lg">
              A digital publication exploring constitutional law,
              judicial thought, legislative developments and African
              development through thoughtful editorial analysis.
            </p>

          </div>

        </div>

      </header>

      {/* Navigation */}

      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-[#faf8f3]/95 backdrop-blur border-b border-neutral-300"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="h-16 flex items-center justify-between">

            {/* Mobile */}

            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-full"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Nav */}

            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex flex-1 justify-center"
            >
              <ul className="flex gap-10">

                {navigation.map((item) => (

                  <li key={item.title}>

                    <Link
                      href={item.href}
                      className="
                        relative
                        py-5
                        uppercase
                        tracking-[0.18em]
                        text-xs
                        text-neutral-700
                        hover:text-[#8B1E1E]
                        transition-colors
                        after:absolute
                        after:left-0
                        after:bottom-3
                        after:h-px
                        after:w-0
                        after:bg-[#8B1E1E]
                        after:transition-all
                        hover:after:w-full
                      "
                    >
                      {item.title}
                    </Link>

                  </li>

                ))}

              </ul>

            </nav>

            {/* Search */}

            <button
              aria-label="Search"
              className="
                flex
                items-center
                gap-3
                border
                border-neutral-300
                px-4
                py-2
                text-sm
                hover:border-[#8B1E1E]
                transition-colors
              "
            >
              <Search size={16} />

              <span className="hidden md:inline text-neutral-500">
                Search articles...
              </span>

            </button>

          </div>

          {/* Daily Brief */}

          <div className="hidden lg:flex items-center justify-center gap-8 border-t border-neutral-200 py-3 text-xs uppercase tracking-[0.18em]">

            <span className="font-semibold text-[#8B1E1E]">
              Today's Brief
            </span>

            <span>3 Supreme Court Decisions</span>

            <span>2 Parliamentary Bills</span>

            <span>1 Editorial Essay</span>

            <span className="text-neutral-500">
              Updated 08:00 EAT
            </span>

          </div>

        </div>

      </motion.div>

      {/* Mobile Menu */}

      <AnimatePresence>

        {open && (

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 z-[100] bg-[#faf8f3]"
          >

            <div className="flex items-center justify-between p-6 border-b border-neutral-300">

              <span className="font-serif text-3xl">
                Appellate Tea
              </span>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
              >
                <X />
              </button>

            </div>

            <nav className="p-8">

              <ul className="space-y-8">

                {navigation.map((item) => (

                  <li key={item.title}>

                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-serif text-3xl hover:text-[#8B1E1E]"
                    >
                      {item.title}
                    </Link>

                  </li>

                ))}

              </ul>

            </nav>

          </motion.aside>

        )}

      </AnimatePresence>
    </>
  );
}