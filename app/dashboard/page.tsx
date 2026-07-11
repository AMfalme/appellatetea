"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ContinueReadingPanel from "@/components/dashboard/ContinueReading";
import SavedArticlesSection from "@/components/dashboard/SavedArticles";
import EditorialRecommendationsSection from "@/components/dashboard/EditorialRecommendations";
import ReadingActivitySection from "@/components/dashboard/ReadingActivity";
import ReaderNotebookSection from "@/components/dashboard/ReaderNotebook";
import ReadingInterestsSection from "@/components/dashboard/AccountPanel";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">Loading profile…</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <DashboardHeader name={user.displayName || "Reader"} onSignOut={() => router.push("/")} />
      <ContinueReadingPanel />
      <SavedArticlesSection />
      <EditorialRecommendationsSection />
      <ReadingActivitySection />
      <ReaderNotebookSection />
      <ReadingInterestsSection />
    </div>
  );
}
