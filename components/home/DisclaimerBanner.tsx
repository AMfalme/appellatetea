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
    // Show disclaimer immediately on every page navigation
    // Dismissal only hides it for the current page load
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
              className="bg-gradient-to-br from-[#8B1E1E] to-[#6b1515] text-white shadow-2xl max-w-lg w-full p-8 sm:p-10"
            >
              <div className="flex flex-col items-center text-center">
                <button
                  onClick={handleDismiss}
                  className="self-end p-2 hover:bg-white/20 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={20} />
                </button>

                <p className="text-base sm:text-lg font-serif leading-snug">
                  ☕ Welcome to Appellate Tea — a prototype.
                </p>
                <p className="mt-3 text-sm text-red-100 leading-relaxed">
                  We are brewing something special. Our official launch is{" "}
                  <strong className="text-white">August 1, 2026</strong>.
                  What you see here is a working preview of the vision — 
                  a carefully crafted newspaper that we hope will help you 
                  understand legal and public policy issues more deeply.
                </p>
                <p className="mt-2 text-sm text-red-200 italic">
                  Think of it as a pre-publication proof. 
                  The ink is still drying, but the ideas are ready.
                </p>

                {/* Countdown */}
                <div className="mt-6 w-full border-t border-white/20 pt-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-red-200 mb-3">
                    Launching in
                  </p>
                  <div className="flex justify-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl">{timeLeft.days}</div>
                      <div className="text-xs uppercase tracking-wider text-red-200 mt-1">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl">{timeLeft.hours}</div>
                      <div className="text-xs uppercase tracking-wider text-red-200 mt-1">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl">{timeLeft.minutes}</div>
                      <div className="text-xs uppercase tracking-wider text-red-200 mt-1">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-3xl sm:text-4xl">{timeLeft.seconds}</div>
                      <div className="text-xs uppercase tracking-wider text-red-200 mt-1">Seconds</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 text-sm transition-colors"
                  >
                    <MessageSquare size={16} />
                    Feedback
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 text-sm transition-colors"
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
        className="fixed bottom-6 right-6 z-50 bg-[#8B1E1E] text-white p-4 shadow-lg hover:bg-[#731818] transition-colors"
        aria-label="Give feedback"
      >
        <MessageSquare size={20} />
      </button>
    </>
  );
}