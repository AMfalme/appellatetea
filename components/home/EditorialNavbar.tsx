"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PlaceholderBadge } from "./PlaceholderBadge";
import LaunchCountdown from "./LaunchCountdown";
import SearchOverlay from "@/components/features/SearchOverlay";

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
  const [searchOpen, setSearchOpen] = useState(false);

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
      <div className="border-b bg-[#faf8f3] border-neutral-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-3 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            <span>Global Edition</span>
            <span>{today}</span>
            <div className="flex items-center gap-3">
              <span>Volume I · Issue 001</span>
              <PlaceholderBadge />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur border-b border-neutral-300 bg-white/95"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="h-16 flex items-center justify-between">
            {/* Mobile Toggle */}
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
                        group
                        transition-colors
                        after:absolute
                        after:left-0
                        after:bottom-3
                        after:h-px
                        after:w-0
                        after:bg-[#8B1E1E]
                        after:transition-all
                        group-hover:text-[#8B1E1E]
                        group-hover:after:w-full
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
              onClick={() => setSearchOpen(true)}
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

      <LaunchCountdown />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-0 z-[100] bg-white"
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-300">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Menu
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
                      className="font-serif text-3xl group-hover:text-[#8B1E1E]"
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