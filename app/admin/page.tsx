"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/firebase/auth";
import { listUsers, updateUserRole } from "@/lib/services/users";
import type { UserProfile, UserRole } from "@/lib/types/user";
import { Button } from "@/components/ui/Button";

const roles: UserRole[] = ["admin", "editor", "viewer"];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
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
      void loadMembers();
    }
  }, [loading, user, router]);

  const loadMembers = async () => {
    try {
      const result = await listUsers();
      setMembers(result.sort((a, b) => a.displayName.localeCompare(b.displayName)));
    } catch (err: any) {
      setError(err.message || "Unable to load members");
    }
  };

  const canManage = useMemo(() => user?.role === "admin", [user]);

  const handleRoleChange = async (member: UserProfile, role: UserRole) => {
    if (!canManage) return;
    setBusyId(member.id);
    setError(null);
    setMessage(null);

    try {
      await updateUserRole(member.id, role);
      setMembers((current) =>
        current.map((item) => (item.id === member.id ? { ...item, role } : item))
      );
      setMessage(`${member.displayName || member.email} is now ${role}.`);
    } catch (err: any) {
      setError(err.message || "Unable to update role");
    } finally {
      setBusyId(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">Loading workspace…</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded border border-neutral-200 bg-white p-8 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">Editorial admin</p>
            <h1 className="mt-2 font-serif text-3xl text-neutral-900">Admin workspace</h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-600">
              Manage access, review contributors, and keep the publication flow moving.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-neutral-700 underline underline-offset-4">
              View site
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-neutral-900">Contributor access</h2>
                <p className="mt-2 text-sm text-neutral-600">Assign roles from admin to editor or viewer.</p>
              </div>
            </div>
            {message ? <p className="mt-4 text-sm text-[#8B1E1E]">{message}</p> : null}
            {error ? <p className="mt-4 text-sm text-[#8B1E1E]">{error}</p> : null}
            <div className="mt-6 space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col gap-3 rounded border border-neutral-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{member.displayName || member.email}</p>
                    <p className="text-sm text-neutral-600">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(event) => handleRoleChange(member, event.target.value as UserRole)}
                      className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
                      disabled={busyId === member.id}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">{busyId === member.id ? "Saving…" : "Role"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-neutral-900">Publishing queue</h2>
              <p className="mt-2 text-sm text-neutral-600">Article submissions and editorial approvals will appear here.</p>
              <div className="mt-6 rounded border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
                No drafts are pending review yet.
              </div>
            </div>
            <div className="rounded border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-neutral-900">Quick actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Button variant="outline">Create article</Button>
                <Button variant="outline">Review submissions</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
