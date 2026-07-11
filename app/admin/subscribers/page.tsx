"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Mail, Users, Download } from "lucide-react";

interface EarlyAccessSubscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp | null;
  source: string;
}

export default function SubscribersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [subscribers, setSubscribers] = useState<EarlyAccessSubscriber[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
      return;
    }

    if (!loading && user && user.role !== "admin") {
      router.replace("/");
      return;
    }

    if (!loading && user?.role === "admin") {
      loadSubscribers();
    }
  }, [loading, user, router]);

  const loadSubscribers = async () => {
    setLoadingData(true);
    try {
      const q = query(
        collection(db, "earlyAccessSubscribers"),
        orderBy("subscribedAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EarlyAccessSubscriber[];
      setSubscribers(data);
    } catch (err) {
      console.error("Failed to load subscribers:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const exportCSV = () => {
    const headers = "Email,Subscribed At,Source\n";
    const rows = subscribers
      .map((s) => {
        const date = s.subscribedAt?.toDate().toISOString() || "N/A";
        return `${s.email},${date},${s.source}`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "early-access-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">
        Loading workspace…
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#8B1E1E] mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </Link>

          <div className="flex flex-col gap-4 rounded border border-neutral-200 bg-white p-8 shadow-sm md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#8B1E1E]/10 rounded flex items-center justify-center shrink-0">
                <Mail size={22} className="text-[#8B1E1E]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#8B1E1E]">
                  Early Access
                </p>
                <h1 className="mt-1 font-serif text-3xl text-neutral-900">
                  Subscribers
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
                  First-day early access subscribers — users who signed up before the
                  official August 1, 2026 launch.
                </p>
              </div>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border border-neutral-300 hover:border-[#8B1E1E] px-4 py-2 text-sm transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Total</p>
            <p className="mt-2 font-serif text-3xl text-neutral-900">{subscribers.length}</p>
          </div>
          <div className="rounded border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Newsletter</p>
            <p className="mt-2 font-serif text-3xl text-neutral-900">
              {subscribers.filter((s) => s.source === "newsletter-section").length}
            </p>
          </div>
          <div className="rounded border border-neutral-200 bg-white p-6 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Other</p>
            <p className="mt-2 font-serif text-3xl text-neutral-900">
              {subscribers.filter((s) => s.source !== "newsletter-section").length}
            </p>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="rounded border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="font-serif text-xl text-neutral-900">All Subscribers</h2>
          </div>

          {loadingData ? (
            <div className="p-12 text-center text-sm text-neutral-500">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-100 rounded" />
                ))}
              </div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={40} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-500">No subscribers yet.</p>
              <p className="text-sm text-neutral-400 mt-1">
                Subscribers will appear here when users sign up via the newsletter form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {subscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-2"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-neutral-400 shrink-0" />
                    <span className="text-sm text-neutral-900">{sub.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500 shrink-0">
                    <span className="bg-neutral-100 px-2 py-1">{sub.source}</span>
                    <span>
                      {sub.subscribedAt
                        ? sub.subscribedAt.toDate().toLocaleDateString("en", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}