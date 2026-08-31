"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { listUsers } from "@/lib/services/users";
import { countFeedback } from "@/lib/services/feedback";
import { getAdminPlaceholderNotifications } from "@/lib/services/newspaper";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/Button";
import { StatCard, type StatAccent } from "@/components/admin/StatCard";
import {
  Users,
  Mail,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  FilePlus,
  MessageSquare,
  Newspaper as NewspaperIcon,
} from "lucide-react";

interface SectionAlert {
  section: string;
  label: string;
  message: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [memberCount, setMemberCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [alerts, setAlerts] = useState<SectionAlert[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    try {
      const [members, subscribersSnapshot, publishedSnapshot, notifications, newFeedback] =
        await Promise.all([
          listUsers(),
          getCountFromServer(collection(db, "earlyAccessSubscribers")),
          getCountFromServer(
            query(collection(db, "articles"), where("status", "==", "published"))
          ),
          getAdminPlaceholderNotifications(),
          countFeedback("new"),
        ]);

      setMemberCount(members.length);
      setSubscriberCount(subscribersSnapshot.data().count);
      setPublishedCount(publishedSnapshot.data().count);
      setFeedbackCount(newFeedback);
      setAlerts(
        notifications.map((n) => ({
          section: n.section,
          label: n.label,
          message: n.message,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workspace overview");
    }
  };

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
      // Data fetching pattern used across the app (see app/dashboard/page.tsx).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadOverview();
    }
  }, [loading, user, router]);

  type StatItem = {
  label: string;
  value: number;
  href: string;
  icon: ComponentType<{ className?: string }>;
  hint: string;
  accent: StatAccent;
};

const stats: StatItem[] = [
    {
      label: "Members",
      value: memberCount,
      href: "/admin/users",
      icon: Users,
      hint: "People with an account",
      accent: "blue",
    },
    {
      label: "Subscribers",
      value: subscriberCount,
      href: "/admin/subscribers",
      icon: Mail,
      hint: "Early access sign-ups",
      accent: "violet",
    },
    {
      label: "Published Articles",
      value: publishedCount,
      href: "/admin/cases",
      icon: FileText,
      hint: "Live on the site",
      accent: "emerald",
    },
    {
      label: "New Feedback",
      value: feedbackCount,
      href: "/admin/feedback",
      icon: MessageSquare,
      hint: "Awaiting review",
      accent: "amber",
    },
    {
      label: "Placeholder Alerts",
      value: alerts.length,
      href: "/admin/newspaper",
      icon: AlertTriangle,
      hint: "Sections needing content",
      accent: "red",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-8 text-sm text-neutral-600 sm:px-6 lg:px-10">
        Loading workspace…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm">
            <h1 className="font-serif text-2xl text-neutral-900">Access Denied</h1>
            <p className="mt-3 text-sm text-neutral-600">
              You need administrator access to view this workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }
return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B1E1E]">
              Admin Console
            </p>
            <h1 className="mt-2 font-serif text-4xl text-neutral-900">Overview</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Welcome back,{" "}
              <span className="font-medium text-neutral-800">
                {user.displayName || user.email}
              </span>
              . Here’s what’s happening across the publication.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/cases/new">
              <Button variant="primary">
                <FilePlus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <NewspaperIcon className="mr-2 h-4 w-4" />
                View Public Site
              </Button>
            </Link>
          </div>
        </header>

        {error ? (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#8B1E1E]">
            {error}
          </p>
        ) : null}

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              href={stat.href}
              icon={stat.icon}
              hint={stat.hint}
              accent={stat.accent}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Section placeholders */}
          <section className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-yellow-900">
                Section placeholders
              </h2>
              <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-800">
                {alerts.length} pending
              </span>
            </div>
            <p className="mt-2 text-sm text-yellow-700">
              These newspaper sections still need an article assigned.
            </p>

            {alerts.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {alerts.map((notification) => (
                  <li
                    key={notification.section}
                    className="rounded-lg border border-yellow-300 bg-white p-4"
                  >
                    <p className="font-medium text-yellow-900">
                      {notification.label}
                    </p>
                    <p className="mt-1 text-xs text-yellow-700">
                      {notification.message}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-yellow-600">
                All sections have content assigned. Great job!
              </p>
            )}

            <Link
              href="/admin/newspaper"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#8B1E1E] underline underline-offset-4 hover:text-[#8B1E1E]/80"
            >
              Manage newspaper layout <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Quick actions */}
          <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-xl text-neutral-900">Quick actions</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Jump straight to the tools you use most.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/admin/cases" className="block">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" /> Manage articles
                </Button>
              </Link>
              <Link href="/admin/cases/new" className="block">
                <Button variant="outline" className="w-full">
                  <FilePlus className="mr-2 h-4 w-4" /> Create article
                </Button>
              </Link>
              <Link href="/admin/newspaper" className="block">
                <Button variant="outline" className="w-full">
                  <NewspaperIcon className="mr-2 h-4 w-4" /> Manage newspaper layout
                </Button>
              </Link>
              <Link href="/admin/subscribers" className="block">
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> View subscribers
                </Button>
              </Link>
              <Link href="/admin/feedback" className="block">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> Review feedback
                </Button>
              </Link>
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" /> Manage members & roles
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
