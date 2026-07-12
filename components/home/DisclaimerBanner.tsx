"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

const DISMISSED_KEY = "disclaimer-dismissed";
const LAUNCH_DATE = new Date("2026-08-01T00:00:00");

export default function DisclaimerBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const now = new Date();
      const diff = LAUNCH_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("feedback") || "[]");
      existing.push({ text: feedbackText, date: new Date().toISOString() });
      localStorage.setItem("feedback", JSON.stringify(existing));
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackSent(false);
        setFeedbackText("");
      }, 2000);
    } catch (err) {
      console.error("Failed to save feedback:", err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-[#0d0f32] to-[#0c0827] shadow-2xl max-w-lg w-full p-8 sm:p-10"
            >
              <div className="flex flex-col items-center text-center">
                <button
                  onClick={handleDismiss}
                  className="self-end p-2 hover:bg-white/10 transition-colors rounded"
                  aria-label="Dismiss"
                >
                  <X size={20} className="!text-blue-200" />
                </button>

                <p className="text-base sm:text-lg font-serif leading-snug !text-amber-300">
                  ☕ Welcome to Appellate Tea.
                </p>
                <p className="mt-3 text-sm !text-blue-200 leading-relaxed">
                  We are brewing something special. Our official launch is{" "}
                  <strong className="!text-amber-300">August 1, 2026</strong>.
                  What you see here is a working preview of the vision — 
                  a carefully crafted newspaper that we hope will help you 
                  understand legal and public policy issues more deeply.
                </p>
                <p className="mt-2 text-sm !text-blue-300 italic">
                  Think of it as a pre-publication proof. 
                  The ink is still drying, but the ideas are ready.
                </p>

                {/* Countdown */}
                <div className="mt-6 w-full border-t border-blue-400/20 pt-6">
                  <p className="text-xs uppercase tracking-[0.25em] !text-blue-300 mb-3">
                    Launching in
                  </p>
                  <div className="flex justify-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl !text-amber-300">{timeLeft.days}</div>
                      <div className="text-xs uppercase tracking-wider !text-blue-300 mt-1">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl !text-amber-300">{timeLeft.hours}</div>
                      <div className="text-xs uppercase tracking-wider !text-blue-300 mt-1">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl !text-amber-300">{timeLeft.minutes}</div>
                      <div className="text-xs uppercase tracking-wider !text-blue-300 mt-1">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl !text-amber-300">{timeLeft.seconds}</div>
                      <div className="text-xs uppercase tracking-wider !text-blue-300 mt-1">Seconds</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center gap-2 bg-blue-400/20 hover:bg-blue-400/30 !text-blue-100 px-4 py-2 text-sm transition-colors"
                  >
                    <MessageSquare size={16} />
                    Feedback
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="bg-blue-400/20 hover:bg-blue-400/30 !text-blue-100 px-4 py-2 text-sm transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowFeedback(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-xl max-w-md w-full p-6 sm:p-8"
            >
              {feedbackSent ? (
                <div className="text-center py-8">
                  <p className="font-serif text-2xl text-neutral-900">Thank you! 🙏</p>
                  <p className="mt-2 text-sm text-neutral-600">Your feedback helps us improve.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#8B1E1E] mb-1">Early Access</p>
                      <h3 className="font-serif text-2xl text-neutral-900">Share Your Thoughts</h3>
                    </div>
                    <button
                      onClick={() => setShowFeedback(false)}
                      className="p-2 hover:bg-neutral-100 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-neutral-600 mb-6">
                    This is a prototype and we want to hear from you. 
                    What works? What would you improve? What topics should we cover?
                  </p>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Your feedback..."
                      rows={4}
                      className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-[#8B1E1E]"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!feedbackText.trim()}
                      className="w-full bg-[#8B1E1E] text-white px-6 py-3 text-sm font-semibold hover:bg-[#731818] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Send Feedback
                    </button>
                  </form>

                  <p className="mt-4 text-xs text-neutral-400 text-center">
                    Your feedback will be reviewed by the editorial team.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#0d0f32] text-white p-4 shadow-lg hover:bg-[#1a1d5e] transition-colors"
        aria-label="Give feedback"
      >
        <MessageSquare size={20} />
      </button>
    </>
  );
}