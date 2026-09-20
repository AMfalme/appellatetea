"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  Clock3,
  LayoutGrid,
  Minus,
  Newspaper,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getPublishedArticles } from "@/lib/services/articles";
import { getSectionArticle } from "@/lib/services/newspaper";
import type { Article } from "@/lib/types/article";
import NewsletterCard from "./NewsletterCard";
import {
  CATEGORY_RIBBON,
  EDITORS_DESK_FALLBACK,
  SUB_GRID_SLOTS,
  TOP_READS_COUNT,
  buildStoryPool,
  matchesCategory,
  safeImageSrc,
  storyFromArticle,
  type EditorialStory,
} from "./editorialContent";

interface CategoryStat {
  name: string;
  count: number;
}

/**
 * Reader notebook store: `localStorage` is an external system, so it is read
 * through `useSyncExternalStore` instead of an effect (no cascading renders and
 * no hydration mismatch — the server snapshot is always empty).
 */
const NOTEBOOK_KEY = "at-reader-notebook";
const notebookListeners = new Set<() => void>();
let notebookCache: string | null = null;

function readNotebook(): string {
  if (notebookCache !== null) return notebookCache;

  try {
    notebookCache = window.localStorage.getItem(NOTEBOOK_KEY) ?? "";
  } catch {
    // Storage can be unavailable (private browsing); the notebook stays session-only.
    notebookCache = "";
  }

  return notebookCache;
}

function subscribeToNotebook(callback: () => void) {
  notebookListeners.add(callback);
  return () => {
    notebookListeners.delete(callback);
  };
}

function writeNotebook(value: string) {
  notebookCache = value;

  try {
    window.localStorage.setItem(NOTEBOOK_KEY, value);
  } catch {
    // Ignore persistence errors; the textarea still works for this session.
  }

  notebookListeners.forEach((listener) => listener());
}

/**
 * The front-page body: a compact category ribbon above an asymmetric newspaper
 * grid — lead story plus sub-grid on the left, sticky sidebar on the right.
 * Filtering swaps cards in place, so selecting a subject never pushes the rest
 * of the page downward.
 */
export default function NewsGrid() {
  const [stories, setStories] = useState<EditorialStory[]>([]);
  const [editorStory, setEditorStory] = useState<EditorialStory>(EDITORS_DESK_FALLBACK);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_RIBBON[0]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const note = useSyncExternalStore(subscribeToNotebook, readNotebook, () => "");

  useEffect(() => {
    void getPublishedArticles(12)
      .then((articles: Article[]) => setStories(buildStoryPool(articles)))
      .catch((error: unknown) => {
        console.error("Failed to load published articles:", error);
        setStories(buildStoryPool([]));
      })
      .finally(() => setIsLoading(false));
  }, []);

  // The Editor's Desk note reuses whatever article is assigned to that slot.
  useEffect(() => {
    void getSectionArticle("editors_desk").then((result) => {
      if (result.article) {
        setEditorStory({ ...storyFromArticle(result.article), category: "Editor's Desk" });
      }
    });
  }, []);

  // Reader notebook: local to this device, no backend writes.
  const updateNote = (value: string) => writeNotebook(value);

  const filtered = stories.filter((story) => matchesCategory(story, activeCategory));
  const visible = savedOnly
    ? filtered.filter((story) => bookmarked.includes(story.id))
    : filtered;

  const lead = visible[0];
  const leadImage = safeImageSrc(lead?.image);
  const subStories = visible.slice(1, 1 + SUB_GRID_SLOTS);
  const topReads = visible.slice(1 + SUB_GRID_SLOTS, 1 + SUB_GRID_SLOTS + TOP_READS_COUNT);
  const savedCount = stories.filter((story) => bookmarked.includes(story.id)).length;

  const categories: CategoryStat[] = CATEGORY_RIBBON.map((name) => ({
    name,
    count: stories.filter((story) => matchesCategory(story, name)).length,
  }));

  const toggleBookmark = (id: string) => {
    setBookmarked((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const resetFilters = () => {
    setSavedOnly(false);
    setActiveCategory(CATEGORY_RIBBON[0]);
  };

  const statusLabel = isLoading
    ? "Loading the latest editions…"
    : `${visible.length} ${visible.length === 1 ? "story" : "stories"} · ${
        savedOnly ? "Saved" : activeCategory
      }`;

  return (
    <section id="front-page" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        {/* Section head */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8B1E1E]">
              02 • Front Page
            </p>
            <h2 className="mt-2 font-serif text-3xl text-amber-950 md:text-4xl">
              Today&apos;s coverage
            </h2>
          </div>

          <p className="text-sm text-neutral-500" aria-live="polite">
            {statusLabel}
          </p>
        </div>

        {/* Compact category ribbon — filtering swaps cards in place */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="Filter stories by subject"
              className="flex shrink-0 gap-2"
            >
              {categories.map(({ name, count }) => {
                const active = !savedOnly && name === activeCategory;

                return (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSavedOnly(false);
                      setActiveCategory(name);
                    }}
                    className={[
                      "inline-flex shrink-0 items-center gap-2 whitespace-nowrap border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors",
                      active
                        ? "border-[#8B1E1E] bg-[#8B1E1E] text-white"
                        : "border-slate-200 bg-white text-neutral-700 hover:border-[#8B1E1E] hover:text-[#8B1E1E]",
                    ].join(" ")}
                  >
                    {name}
                    <span
                      className={[
                        "text-[10px] tabular-nums",
                        active ? "text-white/70" : "text-neutral-400",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-2">
              Saved
              <button
                type="button"
                role="switch"
                aria-checked={savedOnly}
                aria-label="Show only saved stories"
                onClick={() => setSavedOnly((current) => !current)}
                className={[
                  "relative inline-flex h-5 w-9 items-center rounded-full border transition-colors",
                  savedOnly ? "border-[#8B1E1E] bg-[#8B1E1E]" : "border-slate-300 bg-slate-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform",
                    savedOnly ? "translate-x-5" : "translate-x-0.5",
                  ].join(" ")}
                />
              </button>
              <span className="tabular-nums">{savedCount}</span>
            </span>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 border border-slate-200 px-2.5 py-1.5 font-medium text-neutral-600 transition-colors hover:border-[#8B1E1E] hover:text-[#8B1E1E]"
            >
              <Minus size={13} />
              Clear filters
            </button>
          </div>
        </div>


        {/* Asymmetric newspaper grid */}
        <div className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            {!lead ? (
              <div className="border border-slate-200 bg-slate-50 p-8">
                <p className="font-serif text-2xl text-amber-950">
                  Nothing matches this selection yet.
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {savedOnly
                    ? "You have not saved a story in this section. Save one from the grid and it will appear here."
                    : "Try another subject from the ribbon above."}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 border border-[#8B1E1E] px-4 py-2 text-sm font-semibold text-[#8B1E1E] transition-colors hover:bg-[#8B1E1E] hover:text-white"
                >
                  Show all stories
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeCategory}-${savedOnly ? "saved" : "all"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <article className="group">
                {leadImage && (
                  <figure>
                    <Link
                      href={lead.href}
                      className="block overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      <Image
                        src={leadImage}
                        alt={lead.imageAlt || lead.title}
                        width={1200}
                        height={675}
                        sizes="(max-width: 1024px) 100vw, 65vw"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </Link>
                    {(lead.imageCaption || lead.date) && (
                      <figcaption className="mt-3 text-xs italic text-neutral-500">
                        {lead.imageCaption}
                        {lead.imageCaption && lead.date ? " • " : ""}
                        {lead.date}
                      </figcaption>
                    )}
                  </figure>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                  <span className="font-semibold text-[#8B1E1E]">{lead.category}</span>
                  <span aria-hidden>•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {lead.readingTime} min read
                  </span>
                </div>

                <h3 className="mt-3 text-balance font-serif text-3xl leading-tight text-neutral-900 transition-colors group-hover:text-[#8B1E1E] md:text-4xl">
                  <Link href={lead.href}>{lead.title}</Link>
                </h3>

                <p className="mt-4 text-lg leading-8 text-neutral-700">{lead.excerpt}</p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-neutral-500">
                  <span>{lead.author}</span>

                  {lead.date && (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} />
                      {lead.date}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleBookmark(lead.id)}
                    aria-pressed={bookmarked.includes(lead.id)}
                    className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-[#8B1E1E] hover:text-[#8B1E1E]"
                  >
                    {bookmarked.includes(lead.id) ? <Check size={14} /> : <Bookmark size={14} />}
                    {bookmarked.includes(lead.id) ? "Saved" : "Save"}
                  </button>

                  <Link
                    href={lead.href}
                    className="ml-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B1E1E] transition-colors hover:text-[#731818]"
                  >
                    Read the full analysis
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>

              <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-slate-200 pt-8 sm:grid-cols-2">
                {subStories.map((story) => (
                  <article key={story.id} className="group flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B1E1E]">
                        {story.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(story.id)}
                        aria-pressed={bookmarked.includes(story.id)}
                        aria-label={
                          bookmarked.includes(story.id)
                            ? `Remove ${story.title} from saved stories`
                            : `Save ${story.title}`
                        }
                        className="text-neutral-400 transition-colors hover:text-[#8B1E1E]"
                      >
                        {bookmarked.includes(story.id) ? <Check size={15} /> : <Bookmark size={15} />}
                      </button>
                    </div>

                    <h4 className="mt-2 text-balance font-serif text-xl leading-snug text-neutral-900 transition-colors group-hover:text-[#8B1E1E]">
                      <Link href={story.href}>{story.title}</Link>
                    </h4>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
                      {story.excerpt}
                    </p>

                    <p className="mt-3 inline-flex items-center gap-2 text-xs text-neutral-500">
                      <Clock3 size={13} />
                      {story.readingTime} min read · {story.author}
                    </p>
                  </article>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        )}

          </div>

          <aside className="min-w-0 lg:col-span-5 xl:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              {/* Top reads */}
              <div className="border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Newspaper size={16} className="text-[#8B1E1E]" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-950">
                    Top Reads
                  </h3>
                </div>

                {topReads.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-neutral-600">
                    No further reads in this section — clear the filters to see the full desk.
                  </p>
                ) : (
                  <ol className="divide-y divide-slate-200">
                    {topReads.map((story, index) => (
                      <li key={story.id} className="py-3 first:pt-4">
                        <Link href={story.href} className="group flex gap-3">
                          <span className="font-serif text-2xl leading-none tabular-nums text-slate-300">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8B1E1E]">
                              {story.category}
                            </span>
                            <span className="mt-1 block text-sm font-medium leading-6 text-neutral-900 transition-colors group-hover:text-[#8B1E1E]">
                              {story.title}
                            </span>
                            <span className="mt-1 block text-xs text-neutral-500">
                              {story.readingTime} min read
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Editor's desk */}
              <div className="border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <LayoutGrid size={16} className="text-[#8B1E1E]" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-950">
                    Editor&apos;s Desk
                  </h3>
                </div>

                <h4 className="mt-4 text-balance font-serif text-2xl leading-snug text-amber-950">
                  {editorStory.title}
                </h4>

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-neutral-600">
                  {editorStory.excerpt}
                </p>

                <Link
                  href={editorStory.href}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8B1E1E] transition-colors hover:text-[#731818]"
                >
                  Read the note
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Reader notebook — private to this browser */}
              <div className="border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Bookmark size={16} className="text-[#8B1E1E]" />
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-950">
                    Reader Notebook
                  </h3>
                </div>

                <label htmlFor="reader-note" className="sr-only">
                  Reader notebook
                </label>
                <textarea
                  id="reader-note"
                  rows={3}
                  value={note}
                  onChange={(event) => updateNote(event.target.value)}
                  placeholder="Jot down a citation or a thread to follow…"
                  className="mt-4 w-full resize-y border border-slate-300 bg-white p-3 text-sm leading-6 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#8B1E1E]"
                />
                <p className="mt-2 text-xs text-neutral-500">
                  {note.trim() ? "Saved on this device." : "Private to this browser."}
                </p>
              </div>

              {/* The old full-width newsletter row, folded into the sidebar */}
              <NewsletterCard />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

