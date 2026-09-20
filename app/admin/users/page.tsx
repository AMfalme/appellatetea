"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { listUsers, updateUserRole } from "@/lib/services/users";
import { countFeedback } from "@/lib/services/feedback";
import type { UserProfile, UserRole } from "@/lib/types/user";
import { StatCard } from "@/components/admin/StatCard";
import { Select } from "@/components/ui/Select";
import { ShieldCheck, PenLine, Eye, MessageSquare } from "lucide-react";

const roles: UserRole[] = ["admin", "editor", "viewer"];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedbackTotal, setFeedbackTotal] = useState(0);

  const loadMembers = async () => {
    try {
      const result = await listUsers();
      setMembers(result.sort((a, b) => a.displayName.localeCompare(b.displayName)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load members");
    }
  };

  const canManage = useMemo(() => user?.role === "admin", [user]);

  const loadFeedbackCount = async () => {
    try {
      const total = await countFeedback();
      setFeedbackTotal(total);
    } catch (err) {
      // Feedback count is secondary on this page; surface quietly.
      console.error("Failed to load feedback count:", err);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update role");
    } finally {
      setBusyId(null);
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
      void loadMembers();
      void loadFeedbackCount();
    }
  }, [loading, user, router]);

  const countByRole = (role: UserRole) =>
    members.filter((member) => member.role === role).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-8 text-sm text-neutral-600 sm:px-6 lg:px-10">
        Loading workspace…
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }
return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B1E1E]">
              Team & Access
            </p>
            <h1 className="mt-2 font-serif text-4xl text-neutral-900">
              Members & Roles
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Manage the people behind Appellate Tea and the level of access each
              member has.
            </p>
          </div>
        </header>

        {/* Role summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Administrators"
            value={countByRole("admin")}
            icon={ShieldCheck}
            hint="Full system access"
            accent="red"
          />
          <StatCard
            label="Editors"
            value={countByRole("editor")}
            icon={PenLine}
            hint="Write & publish content"
            accent="blue"
          />
          <StatCard
            label="Viewers"
            value={countByRole("viewer")}
            icon={Eye}
            hint="Read-only access"
            accent="neutral"
          />
          <StatCard
            label="Feedback Received"
            value={feedbackTotal}
            icon={MessageSquare}
            hint="Messages from readers"
            href="/admin/feedback"
            accent="amber"
          />
        </div>

        {/* Messages */}
        {message ? (
          <p className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#8B1E1E]">
            {error}
          </p>
        ) : null}

        {/* Members list */}
        <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="font-serif text-xl text-neutral-900">
              All Members
              <span className="ml-2 font-serif text-sm text-neutral-400">
                {members.length} total
              </span>
            </h2>
          </div>

          {members.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-500">
              No members found.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {members.map((member) => {
                const isCurrentUser = member.id === user.id;
                return (
                  <li
                    key={member.id}
                    className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-600">
                        {initials(member.displayName || member.email)}
                      </div>
                      <div>
                        <p className="flex items-center gap-2 font-medium text-neutral-900">
                          {member.displayName || "Member"}
                          {isCurrentUser ? (
                            <span className="text-xs text-neutral-400">(you)</span>
                          ) : null}
                        </p>
                        <p className="text-sm text-neutral-600">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {member.lastLoginAt ? (
                        <span className="hidden text-xs text-neutral-400 sm:block">
                          Last seen{" "}
                          {new Date(member.lastLoginAt).toLocaleDateString("en", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      ) : null}
                      <Select
                        value={member.role}
                        onChange={(event) =>
                          handleRoleChange(member, event.target.value as UserRole)
                        }
                        disabled={busyId === member.id}
                        accent="indigo"
                        aria-label={`Role for ${member.displayName || member.email}`}
                        className="h-10 w-auto min-w-[9rem] text-xs"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}