"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ArrowRight, CheckCircle, Newspaper } from "lucide-react";
import { db } from "@/lib/firebase/config";

/**
 * The newsletter signup, reduced to a sidebar card.
 *
 * The Firestore `source` stays "newsletter-section" so the existing
 * /admin/subscribers counters keep reporting these signups correctly.
 */
export default function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await addDoc(collection(db, "earlyAccessSubscribers"), {
        email: email.trim().toLowerCase(),
        subscribedAt: serverTimestamp(),
        source: "newsletter-section",
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="border border-slate-200 bg-amber-50/40 p-6">
      <div className="flex items-center gap-3">
        <Newspaper size={18} className="text-[#8B1E1E]" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8B1E1E]">
          The Morning Brief
        </p>
      </div>

      <h3 className="mt-4 font-serif text-2xl leading-snug text-amber-950 text-balance">
        Begin your week with thoughtful legal analysis.
      </h3>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        One curated edition each week: judgments, policy and long-form commentary.
      </p>

      {status === "success" ? (
        <div className="mt-5 flex items-start gap-3 border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">
            You&apos;re subscribed. Welcome to the early access list.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full border border-slate-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#8B1E1E]"
          />

          {status === "error" && (
            <p className="text-sm text-red-700" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-2 bg-[#8B1E1E] py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#731818] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      <p className="mt-4 text-xs text-neutral-500">
        Free forever. Unsubscribe whenever you wish.
      </p>
    </div>
  );
}
