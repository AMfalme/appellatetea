"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  deleteArticle,
  getArticleById,
  getArticleBySlug,
  updateArticle,
} from "@/lib/services/articles";
import type { Article } from "@/lib/types/article";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 16+ route params are a Promise and must be resolved with React's `use`.
  // `useParams` is kept as a fallback so the segment is still available even if the
  // server did not pass `params` down to this client component.
  const resolvedParams = use(params);
  const hookParams = useParams<{ id: string }>();
  const rawId = resolvedParams?.id ?? hookParams?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "";
  const router = useRouter();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingArticle, setLoadingArticle] = useState(Boolean(id));
  const [articleMissing, setArticleMissing] = useState(!id);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'Constitutional Law',
    authorName: 'Editorial Desk',
    readingTime: 8,
    status: 'draft' as Article['status'],
    live: true,
  });

  const loadArticle = useCallback(async (articleId: string) => {
    setLoadingArticle(true);
    setArticleMissing(false);
    setError(null);

    try {
      // The route segment is normally the Firestore document id, but older links may
      // still use the article slug, so fall back to a slug lookup before giving up.
      let data = await getArticleById(articleId);
      if (!data) {
        data = await getArticleBySlug(articleId);
      }

      if (!data) {
        setArticleMissing(true);
        return;
      }

      setArticle(data);
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        body: data.body || data.content || '',
        category: data.category || 'Constitutional Law',
        authorName: data.authorName || 'Editorial Desk',
        readingTime: data.readingTime || 8,
        status: data.status,
        live: data.live ?? true,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to load article");
    } finally {
      setLoadingArticle(false);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role !== "admin" && user.role !== "editor") {
      router.replace("/");
      return;
    }

    if (!id) {
      // Nothing to load; the render already reflects the missing-article state.
      return;
    }

    // Data fetching pattern used across the app (see app/dashboard/page.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadArticle(id);
  }, [loading, user, router, id, loadArticle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const articleData: Partial<Article> = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        published: formData.status === 'published',
        // Keep the original publication date when the article stays published.
        publishedAt: formData.status === 'published'
          ? article?.publishedAt || new Date().toISOString()
          : undefined,
      };

      await updateArticle(id, articleData);
      router.push("/admin/cases");
    } catch (err: any) {
      setError(err.message || "Failed to update article");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteArticle(id);
      setShowDeleteModal(false);
      router.push("/admin/cases");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete article");
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8 text-sm text-neutral-600">Loading…</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return null;
  }

  if (loadingArticle) {
    return <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8 text-sm text-neutral-600">Loading article…</div>;
  }

  if (articleMissing || !article) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">Content Management</p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-900">Article not found</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {error ?? 'This article may have been removed or the link is out of date.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {error && id && (
              <Button variant="primary" onClick={() => void loadArticle(id)}>
                Try again
              </Button>
            )}
            <Link href="/admin/cases">
              <Button variant="outline">Back to articles</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">Content Management</p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-900">Edit Article</h1>
          <p className="mt-2 text-sm text-neutral-600">Update article content and settings.</p>
        </div>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary"
                  rows={3}
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Body</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Article content"
                  rows={12}
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded border border-neutral-300 bg-white px-3 py-2"
                  >
                    <option>Constitutional Law</option>
                    <option>Supreme Court</option>
                    <option>Parliament</option>
                    <option>Policy</option>
                    <option>African Development</option>
                    <option>Social Philosophy</option>
                    <option>Judicial Appointments</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">Reading Time (min)</label>
                  <Input
                    type="number"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 8 })}
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Author Name</label>
                <Input
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Article['status'] })}
                  className="w-full rounded border border-neutral-300 bg-white px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="live"
                  checked={formData.live}
                  onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <label htmlFor="live" className="text-sm text-neutral-700">
                  Live (visible to public)
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/cases")}>
                Cancel
              </Button>
            </div>
            {user?.role === 'admin' && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
        </form>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!deleting) setShowDeleteModal(false);
        }}
        title="Delete article?"
      >
        <p className="text-sm text-neutral-600">
          Are you sure you want to delete{' '}
          <strong className="text-neutral-900">{article?.title || 'this article'}</strong>?
          This will remove it from the public site and move it to archived status.
        </p>
        {deleteError && (
          <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {deleteError}
          </div>
        )}
        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={deleting}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
