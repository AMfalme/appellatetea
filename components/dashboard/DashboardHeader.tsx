"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/firebase/auth";

interface DashboardHeaderProps {
  name?: string;
  onSignOut?: () => void;
}

export default function DashboardHeader({
  name = "Reader",
  onSignOut,
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="border-b border-neutral-200 bg-[#faf8f3]">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">

        {/* Masthead */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
        >

          <div>

            <div className="flex items-center gap-3 text-[#8B1E1E] mb-5">

              <Newspaper size={18} />

              <span className="uppercase tracking-[0.35em] text-xs font-semibold">
                The Appellate Tea
              </span>

            </div>

            <h1 className="font-serif text-5xl md:text-6xl text-neutral-900 leading-none">

              My Edition

            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-neutral-500">

              <span>Issue 014</span>

              <span>•</span>

              <span>Reader Copy</span>

              <span>•</span>

              <span>{today}</span>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <Link
              href="/"
              className="text-sm uppercase tracking-[0.2em] text-neutral-500 hover:text-[#8B1E1E] transition-colors"
            >
              View Publication
            </Link>

            <Button
              variant="outline"
              className="rounded-none border-neutral-300"
              onClick={async () => {
                await signOut();
                onSignOut?.();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>

          </div>

        </motion.div>

        {/* Greeting */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-16 border-t border-neutral-300 pt-12"
        >

          <p className="uppercase tracking-[0.35em] text-xs text-[#8B1E1E] mb-4">

            Reader's Desk

          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 leading-tight">

            Good afternoon, {name}.

          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-9 text-neutral-600">

            Welcome back to your personal edition of Appellate Tea.
            Continue your reading journey, revisit saved analyses,
            discover fresh editorial recommendations, and stay informed
            on the legal developments shaping society.

          </p>

        </motion.div>

      </div>

    </section>
  );
}