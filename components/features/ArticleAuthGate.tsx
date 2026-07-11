"use client";

import { ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, signInWithGoogle } from "@/lib/firebase/auth";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Link from "next/link";

interface ArticleAuthGateProps {
  children: ReactNode;
}

export function ArticleAuthGate({ children }: ArticleAuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in failed:", err);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse h-6 w-48 bg-neutral-200 mx-auto rounded" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-12 border border-neutral-200 bg-white p-8 sm:p-12 text-center"
    >
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-[#8B1E1E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn size={28} className="text-[#8B1E1E]" />
        </div>

        <h3 className="font-serif text-2xl text-neutral-900 mb-3">
          Continue Reading
        </h3>

        <p className="text-neutral-600 leading-relaxed mb-8">
          Sign in to read the full article. Creating an account takes just a moment
          and gives you access to in-depth legal analysis and commentary.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 border-2 border-neutral-300 hover:border-[#8B1E1E] px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {signingIn ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-neutral-400">or</span>
            </div>
          </div>

          <Link
            href="/auth/register"
            className="block w-full bg-[#8B1E1E] hover:bg-[#731818] text-white px-6 py-3 text-sm font-medium transition-colors"
          >
            Create an Account
          </Link>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </motion.div>
  );
}