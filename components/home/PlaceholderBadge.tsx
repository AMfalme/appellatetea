"use client";

import { useAuth } from "@/components/providers/AuthProvider";

export function PlaceholderBadge() {
  const { user } = useAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 border border-yellow-300">
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
      Placeholder
    </span>
  );
}