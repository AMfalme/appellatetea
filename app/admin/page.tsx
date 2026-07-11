"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/firebase/auth";
import { listUsers, updateUserRole } from "@/lib/services/users";
import { getAdminPlaceholderNotifications } from "@/lib/services/newspaper";
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
      void loadNotifications();
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

  const [sectionNotifications, setSectionNotifications] = useState<Array<{
    section: string;
    label: string;
    message: string;
  }>>([]);

  const loadNotifications = async () => {
    try {
      const notifications = await getAdminPlaceholderNotifications();
      setSectionNotifications(notifications.map(n => ({
        section: n.section,
        label: n.label,
        message: n.message,
      })));
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

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

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-neutral-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded border border-red-200 bg-red-50 p-8 shadow-sm">
            <h1 className="font-serif text-2xl text-neutral-900">Access Denied</h1>
            <p className="mt-3 text-sm text-neutral-600">
              You need admin privileges to access this page.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Your current role: {user.role}
            </p>
          </div>
        </div>
      </div>
    );
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
            <div className="rounded border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-yellow-900">⚠️ Placeholder Alerts</h2>
              <p className="mt-2 text-sm text-yellow-700">Sections that need content assigned.</p>
              {sectionNotifications.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {sectionNotifications.map((notification) => (
                    <div key={notification.section} className="rounded border border-yellow-300 bg-white p-3">
                      <p className="font-medium text-yellow-900">{notification.label}</p>
                      <p className="mt-1 text-xs text-yellow-700">{notification.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-yellow-600">All sections have content assigned. Great job!</p>
              )}
              <div className="mt-4">
                <Link href="/admin/newspaper" className="text-sm text-[#8B1E1E] underline underline-offset-4">
                  Manage newspaper layout →
                </Link>
              </div>
            </div>
            <div className="rounded border border-neutral-200 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-neutral-900">Quick actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/admin/newspaper">
                  <Button variant="outline" className="w-full">Manage Newspaper Layout</Button>
                </Link>
                <Link href="/admin/cases/new">
                  <Button variant="outline" className="w-full">Create article</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}