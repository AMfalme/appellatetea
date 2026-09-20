"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { getUserProfile, upsertUserProfile } from "@/lib/services/users";
import { useNotification } from "@/components/providers/NotificationProvider";
import { Input } from "@/components/ui/Input";
import { ACTION_ROW } from "@/components/ui/formTokens";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user;
      if (mode === "register") {
        user = await signUp(email, password, name);
        
        // Check if profile exists to preserve role
        const existingProfile = await getUserProfile(user.uid);
        
        if (existingProfile) {
          // Update with new info but preserve existing role
          await upsertUserProfile({
            ...existingProfile,
            email: user.email || email,
            displayName: user.displayName || name,
            updatedAt: new Date(),
          });
        } else {
          // Create new profile with default viewer role
          await upsertUserProfile({
            id: user.uid,
            email: user.email || email,
            displayName: user.displayName || name,
            role: "viewer",
            isEmailVerified: user.emailVerified,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any);
        }
      } else {
        user = await signIn(email, password);
      }

      const profile = await getUserProfile(user.uid);
      const targetRoute = profile?.role === "admin" ? "/admin" : "/dashboard";
      showNotification(
        mode === "register"
          ? "Account created successfully. Welcome to Appellate Tea."
          : "Signed in successfully. Redirecting to your workspace.",
        "success"
      );
      router.push(targetRoute);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      showNotification(err.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      
      // Check if profile exists to preserve role
      const existingProfile = await getUserProfile(user.uid);
      
      if (existingProfile) {
        // Update lastLoginAt but preserve existing role
        await upsertUserProfile({
          ...existingProfile,
          lastLoginAt: new Date(),
        });
      } else {
        // Create new profile with default viewer role
        await upsertUserProfile({
          id: user.uid,
          email: user.email || "",
          displayName: user.displayName || "Google User",
          role: "viewer",
          isEmailVerified: user.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
        } as any);
      }
      
      const profile = await getUserProfile(user.uid);
      const targetRoute = profile?.role === "admin" ? "/admin" : "/dashboard";
      showNotification("Signed in with Google. Redirecting to your workspace.", "success");
      router.push(targetRoute);
    } catch (err: any) {
      setError(err.message || "Google login failed");
      showNotification(err.message || "Google login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 shadow-sm">
      {/* Header block */}
      <div className="border-b border-slate-200/80 bg-slate-50/60 px-8 py-5">
        <h1 className="text-base font-bold text-slate-900">
          {mode === "login" ? "Log in" : "Create account"}
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Access the editorial workspace and manage stories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-8 py-6">
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-xs font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}

        {mode === "register" ? (
          <Input
            id="full-name"
            label="Full name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            accent="indigo"
            required
          />
        ) : null}

        <Input
          id="email"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          accent="indigo"
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          name="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          accent="indigo"
          required
        />

        {/* Action toolbar */}
        <div className={ACTION_ROW}>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-6 py-2.5 text-xs font-bold tracking-wide text-slate-700 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <GoogleMark />
            Continue with Google
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#8B1E1E] px-6 py-2.5 text-xs font-bold tracking-wide text-white transition-all duration-200 hover:bg-[#731818] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8B1E1E]/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
          </button>
        </div>

        <p className="text-center text-xs font-medium text-slate-500">
          {mode === "login" ? (
            <>
              Need an account?{" "}
              <Link href="/auth/register" className="font-bold text-[#8B1E1E] hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-[#8B1E1E] hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

/** Inline Google mark so the secondary action needs no extra dependency. */
function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 01-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.11A12 12 0 0012 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 010-4.56V6.61H1.28a12 12 0 000 10.78l4.01-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 001.28 6.61l4.01 3.11C6.23 6.87 8.88 4.75 12 4.75z"
      />
    </svg>
  );
}
