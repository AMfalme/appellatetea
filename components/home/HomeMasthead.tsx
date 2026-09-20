"use client";

import { useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import SearchOverlay from "@/components/features/SearchOverlay";

/** Nothing to subscribe to — the store is the browser clock. */
const subscribeToClock = () => () => {};

function getTodayLabel(): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

/**
 * Compact, non-sticky edition strip.
 *
 * This replaces the previous full-height editorial masthead (edition ribbon +
 * second sticky nav + daily brief row) so the landing page keeps a single
 * sticky header owned by `app/layout.tsx` and loses ~110px of stacked chrome.
 */
export default function HomeMasthead() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Server snapshot is empty, so the mount and the server always agree.
  const today = useSyncExternalStore(subscribeToClock, getTodayLabel, () => "");

  return (
    <>
      <div className="border-b border-neutral-300 bg-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-neutral-500 lg:px-10">
          <span>Global Edition</span>

          <span className="hidden tabular-nums sm:inline">{today}</span>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Volume I · Issue 001</span>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 border border-neutral-300 px-3 py-1 tracking-[0.22em] text-neutral-600 transition-colors hover:border-[#8B1E1E] hover:text-[#8B1E1E]"
            >
              <Search size={13} />
              Search
            </button>
          </div>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
