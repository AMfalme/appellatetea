"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContinueReadingPanel from "@/components/dashboard/ContinueReading";
import SavedArticlesSection from "@/components/dashboard/SavedArticles";
import EditorialRecommendationsSection from "@/components/dashboard/EditorialRecommendations";
import ReadingActivitySection from "@/components/dashboard/ReadingActivity";
import ReaderNotebookSection from "@/components/dashboard/ReaderNotebook";
import ReadingInterestsSection from "@/components/dashboard/AccountPanel";
import { getSectionArticle } from "@/lib/services/newspaper";

const DEFAULT_LEAD = {
  title: "How Administrative Justice Could Redefine Constitutional Governance Across Africa",
  excerpt: "Continue exploring the landmark judgment that is quietly reshaping administrative fairness, judicial accountability, and constitutional governance throughout the continent.",
  category: "Constitutional Law",
  progress: 72,
  readTime: "14 min read",
  href: "#",
};

const DEFAULT_FEATURED = {
  title: "The Quiet Constitutional Revolution Hidden Inside Recent Judicial Decisions",
  excerpt: "Exploring how recent Supreme Court decisions are reshaping administrative law and constitutional governance across the continent.",
  category: "Supreme Court",
  readTime: "12 min read",
  href: "#",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [leadArticle, setLeadArticle] = useState<any>(DEFAULT_LEAD);
  const [isLeadPlaceholder, setIsLeadPlaceholder] = useState(true);
  const [featuredArticle, setFeaturedArticle] = useState<any>(DEFAULT_FEATURED);
  const [isFeaturedPlaceholder, setIsFeaturedPlaceholder] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (user) {
      // Load lead article
      getSectionArticle('lead').then(result => {
        if (result.article) {
          setLeadArticle({
            title: result.article.title,
            excerpt: result.article.excerpt,
            category: result.article.category,
            progress: 0,
            readTime: `${result.article.readingTime} min read`,
            href: `/articles/${result.article.slug}`,
          });
        }
        setIsLeadPlaceholder(result.isPlaceholder);
      });

      // Load featured article
      getSectionArticle('featured').then(result => {
        if (result.article) {
          setFeaturedArticle({
            title: result.article.title,
            excerpt: result.article.excerpt,
            category: result.article.category,
            readTime: `${result.article.readingTime} min read`,
            href: `/articles/${result.article.slug}`,
          });
        }
        setIsFeaturedPlaceholder(result.isPlaceholder);
      });
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">Loading profile…</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <DashboardHeader name={user.displayName || "Reader"} onSignOut={() => router.push("/")} />
      
      <ContinueReadingPanel article={leadArticle} isPlaceholder={isLeadPlaceholder} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-[#8B1E1E]">
              02 • Featured Story
            </span>
            {isFeaturedPlaceholder && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-300">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                Placeholder
              </span>
            )}
          </div>
          <h3 className="font-serif text-3xl leading-tight text-neutral-900 mb-4">
            {featuredArticle.title}
          </h3>
          <p className="text-lg leading-9 text-neutral-700 mb-6">
            {featuredArticle.excerpt}
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <span className="uppercase tracking-[0.25em] text-[#8B1E1E]">
              {featuredArticle.category}
            </span>
            <span>{featuredArticle.readTime}</span>
          </div>
        </div>
      </div>
      
      <SavedArticlesSection />
      <EditorialRecommendationsSection isPlaceholder={isLeadPlaceholder} />
      <ReadingActivitySection />
      <ReaderNotebookSection />
      <ReadingInterestsSection />
    </div>
  );
}