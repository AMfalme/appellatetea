"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  subscribeFeedback,
  updateFeedbackStatus,
  type FeedbackMessage,
  type FeedbackStatus,
} from "@/lib/services/feedback";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils/cn";
import { Inbox, MessageSquare, CheckCircle2, Mail, Clock3 } from "lucide-react";

type Filter = "all" | FeedbackStatus;

const STATUS_META: Record<
  FeedbackStatus,
  { label: string; badge: string; dot: string }
> = {
  new: {
    label: "New",
    badge: "bg-[#8B1E1E]/10 text-[#8B1E1E]",
    dot: "bg-[#8B1E1E]",
  },
  read: {
    label: "Read",
    badge: "bg-neutral-100 text-neutral-600",
    dot: "bg-neutral-400",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  },
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "resolved", label: "Resolved" },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminFeedbackPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState<string | null>(null);

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
      // Real-time chat-like feed: new submissions appear without a refresh.
      const unsubscribe = subscribeFeedback(
        (next) => setMessages(next),
        (err) =>
          setError(err instanceof Error ? err.message : "Unable to load feedback"),
      );
      return unsubscribe;
    }
  }, [loading, user, router]);

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: messages.length,
      new: 0,
      read: 0,
      resolved: 0,
    };
    for (const message of messages) {
      result[message.status] += 1;
    }
    return result;
  }, [messages]);

  const filtered = useMemo(
    () => (filter === "all" ? messages : messages.filter((m) => m.status === filter)),
    [messages, filter]
  );

  const handleStatus = async (id: string, status: FeedbackStatus) => {
    try {
      await updateFeedbackStatus(id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update feedback");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-8 text-sm text-neutral-600 sm:px-6 lg:px-10">
        Loading feedback…
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }
return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B1E1E]">
              Engagement
            </p>
            <h1 className="mt-2 font-serif text-4xl text-neutral-900">
              Feedback Inbox
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Messages submitted through the on-site feedback widget. New
              submissions appear here in real time.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-500 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live
          </div>
        </header>

        {error ? (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#8B1E1E]">
            {error}
          </p>
        ) : null}

        {/* Status summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {FILTERS.filter((f) => f.key !== "all").map((f) => {
            const meta = STATUS_META[f.key as FeedbackStatus];
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className="group rounded-lg border border-neutral-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#8B1E1E]/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                      meta.badge
                    )}
                  >
                    {meta.label}
                  </span>
                  <span className="font-serif text-3xl text-neutral-900">
                    {counts[f.key]}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                  {f.key === "new" ? (
                    <Mail className="h-3.5 w-3.5" />
                  ) : f.key === "read" ? (
                    <Clock3 className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Click to filter
                </p>
              </button>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="mt-8 flex gap-2 border-b border-neutral-200">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-4 py-2 text-sm capitalize transition-colors",
                filter === f.key
                  ? "border-b-2 border-[#8B1E1E] font-medium text-[#8B1E1E]"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {f.label}
              <span className="ml-1.5 text-xs text-neutral-400">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        {/* Chat-like feed */}
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center shadow-sm">
              <Inbox className="mx-auto h-10 w-10 text-neutral-300" />
              <p className="mt-4 font-medium text-neutral-700">
                {messages.length === 0
                  ? "No feedback yet"
                  : "No messages in this view"}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Submissions from the site widget will show up here the moment a
                user sends them.
              </p>
            </div>
          ) : (
            filtered.map((message) => {
              const meta = STATUS_META[message.status];
              return (
                <article
                  key={message.id}
                  className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8B1E1E]/10 font-semibold text-[#8B1E1E]">
                      {initials(message.authorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <p className="font-semibold text-neutral-900">
                          {message.authorName}
                        </p>
                        {message.authorEmail ? (
                          <span className="text-xs text-neutral-500">
                            {message.authorEmail}
                          </span>
                        ) : null}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
                            meta.badge
                          )}
                        >
                          <span
                            className={cn("h-1.5 w-1.5 rounded-full", meta.dot)}
                          />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        {formatDate(message.createdAt)}
                      </p>

                      {/* Message bubble */}
                      <div className="mt-3 max-w-2xl rounded-2xl rounded-tl-sm border border-neutral-200 bg-neutral-50 px-4 py-3">
                        <p className="text-sm leading-relaxed text-neutral-800">
                          {message.text}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.status === "new" ? (
                          <button
                            type="button"
                            onClick={() => handleStatus(message.id, "read")}
                            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Mark as read
                          </button>
                        ) : null}
                        {message.status !== "resolved" ? (
                          <button
                            type="button"
                            onClick={() => handleStatus(message.id, "resolved")}
                            className="inline-flex items-center gap-1.5 rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark resolved
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStatus(message.id, "read")}
                            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                          >
                            <Clock3 className="h-3.5 w-3.5" />
                            Reopen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <MessageSquare className="h-3.5 w-3.5" />
          Feedback is reviewed by the editorial team
        </p>
      </div>
    </div>
  );
}