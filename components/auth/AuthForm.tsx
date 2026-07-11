"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { getUserProfile, upsertUserProfile } from "@/lib/services/users";
import { useNotification } from "@/components/providers/NotificationProvider";

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
    <div className="mx-auto max-w-md rounded border border-neutral-200 bg-white p-8 shadow-sm">
      <h1 className="font-serif text-3xl text-neutral-900">{mode === "login" ? "Log in" : "Create account"}</h1>
      <p className="mt-3 text-sm text-neutral-600">Access the editorial workspace and manage stories.</p>
      {error ? <p className="mt-4 text-sm text-[#8B1E1E]">{error}</p> : null}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "register" ? (
          <div>
            <label className="mb-2 block text-sm text-neutral-700">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-neutral-300 px-3 py-2" required />
          </div>
        ) : null}
        <div>
          <label className="mb-2 block text-sm text-neutral-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-neutral-300 px-3 py-2" required />
        </div>
        <div>
          <label className="mb-2 block text-sm text-neutral-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-neutral-300 px-3 py-2" required />
        </div>
        <button type="submit" className="w-full bg-[#8B1E1E] px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white">
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Register"}
        </button>
      </form>
      <div className="mt-6">
        <button onClick={handleGoogle} className="w-full border border-neutral-300 px-4 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-800">
          {loading ? "Please wait..." : "Continue with Google"}
        </button>
      </div>
      <p className="mt-6 text-sm text-neutral-600">
        {mode === "login" ? (
          <>Need an account? <Link href="/auth/register" className="text-[#8B1E1E]">Register</Link></>
        ) : (
          <>Already have an account? <Link href="/auth/login" className="text-[#8B1E1E]">Log in</Link></>
        )}
      </p>
    </div>
  );
}
