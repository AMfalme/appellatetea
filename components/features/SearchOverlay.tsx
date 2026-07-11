"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { searchArticlesByTitle } from "@/lib/services/articles";
import type { Article } from "@/lib/types/article";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when overlay opens
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset state when overlay closes
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const articles = await searchArticlesByTitle(searchQuery);
      setResults(articles);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-2xl max-w-2xl mx-auto mt-24 sm:mt-32"
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-neutral-200 px-6 py-4">
              <Search size={20} className="text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search articles by title..."
                className="w-full ml-4 text-lg outline-none text-neutral-900 placeholder-neutral-400 bg-transparent"
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 transition-colors shrink-0"
                aria-label="Close search"
              >
                <X size={20} className="text-neutral-500" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="p-8 text-center">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-neutral-100" />
                    ))}
                  </div>
                </div>
              )}

              {!loading && searched && results.length === 0 && (
                <div className="p-12 text-center">
                  <Search size={40} className="mx-auto text-neutral-300 mb-4" />
                  <p className="text-neutral-600">No articles found for &ldquo;{query}&rdquo;</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Try a different search term.
                  </p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="divide-y divide-neutral-100">
                  {results.map((article) => (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      onClick={onClose}
                      className="flex items-start gap-4 px-6 py-5 hover:bg-neutral-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#8B1E1E] mb-1">
                          {article.category}
                        </p>
                        <h3 className="font-serif text-lg text-neutral-900 group-hover:text-[#8B1E1E] transition-colors leading-snug">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="mt-1 text-sm text-neutral-600 line-clamp-1">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock3 size={12} />
                            {article.readingTime} min read
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-neutral-300 group-hover:text-[#8B1E1E] mt-2 shrink-0 transition-colors"
                      />
                    </Link>
                  ))}
                </div>
              )}

              {!loading && !searched && (
                <div className="p-12 text-center">
                  <Search size={40} className="mx-auto text-neutral-200 mb-4" />
                  <p className="text-neutral-400 text-sm">
                    Type to search articles by title
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}