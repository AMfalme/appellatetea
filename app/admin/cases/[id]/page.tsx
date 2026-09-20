"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  deleteArticle,
  getArticleById,
  getArticleBySlug,
  updateArticle,
} from "@/lib/services/articles";
import type { Article, ArticleImage } from "@/lib/types/article";
import { uploadToCloudinary } from "@/lib/services/cloudinary";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'Constitutional Law',
    authorName: 'Editorial Desk',
    readingTime: 8,
    status: 'draft' as Article['status'],
    live: true,
    heroImageAlt: '',
    heroImageCaption: '',
  });
  const currentImage = article?.heroImage ?? article?.coverImage;

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

      const image = data.heroImage ?? data.coverImage;

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
        heroImageAlt: image?.alt ?? '',
        heroImageCaption: image?.caption ?? '',
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearNewImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { heroImageAlt, heroImageCaption, ...articleFields } = formData;
      const alt = heroImageAlt.trim() || currentImage?.alt || formData.title;
      const caption = heroImageCaption.trim();

      let heroImage: ArticleImage | undefined;

      // Upload a replacement image to Cloudinary when a new file was selected.
      if (imageFile) {
        try {
          const uploaded = await uploadToCloudinary(imageFile, 'articles');
          heroImage = {
            publicId: uploaded.public_id,
            url: uploaded.secure_url,
            alt,
            // Written even when blank so clearing the caption removes it from the article.
            caption,
          };
        } catch (uploadErr) {
          setError(
            `Image upload failed: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`
          );
          setSaving(false);
          return;
        }
      } else if (currentImage) {
        // No new file selected: keep the existing upload but persist alt/caption edits.
        heroImage = {
          publicId: currentImage.publicId,
          url: currentImage.url,
          alt,
          caption,
        };
      }

      const articleData: Partial<Article> = {
        ...articleFields,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        published: formData.status === 'published',
        // Keep the original publication date when the article stays published.
        publishedAt: formData.status === 'published'
          ? article?.publishedAt || new Date().toISOString()
          : undefined,
        heroImage,
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

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto font-sans antialiased">
  {/* Article Details */}
  <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
    <div className="border-b border-slate-200/80 bg-slate-100/70 px-8 py-5">
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        Article Details
      </h2>
      <p className="mt-0.5 text-xs font-medium text-slate-500">
        Update content, categorization, and metadata for this article.
      </p>
    </div>

    <div className="space-y-6 p-8">
      {/* Title */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
          Title
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter article title"
          required
          className="h-11 rounded-xl border-slate-200/90 bg-slate-50/60 px-4 text-sm font-semibold text-slate-900 shadow-2xs transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal focus:border-indigo-500 focus:bg-white focus:text-indigo-950 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* Excerpt */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Brief summary"
          rows={3}
          required
          className="w-full resize-y rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-3 text-sm font-normal text-slate-800 shadow-2xs outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* Body */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
          Body
        </label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Article content"
          rows={12}
          required
          className="w-full resize-y rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-800 shadow-2xs outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* Category / Reading Time */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="group">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
            Category
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full appearance-none rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-2xs outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option>Constitutional Law</option>
              <option>Supreme Court</option>
              <option>Parliament</option>
              <option>Policy</option>
              <option>African Development</option>
              <option>Social Philosophy</option>
              <option>Judicial Appointments</option>
            </select>
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
            Reading Time (min)
          </label>
          <Input
            type="number"
            value={formData.readingTime}
            onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 8 })}
            min={1}
            className="h-10 rounded-xl border-slate-200/90 bg-slate-50/60 px-4 text-sm font-semibold text-slate-900 shadow-2xs transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:text-indigo-950 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* Author Name */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
          Author Name
        </label>
        <Input
          value={formData.authorName}
          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
          placeholder="Enter author name"
          className="h-11 rounded-xl border-slate-200/90 bg-slate-50/60 px-4 text-sm font-medium text-slate-800 shadow-2xs transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>
    </div>
  </section>

  {/* Hero Image */}
  <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-sky-50/30 via-white to-slate-50/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
    <div className="border-b border-slate-200/80 bg-sky-50/60 px-8 py-5">
      <h2 className="text-base font-bold tracking-tight text-sky-950">
        Hero Image
      </h2>
      <p className="mt-0.5 text-xs font-medium text-sky-800/70">
        Upload a new file to replace the current image, or edit the alt text and caption below.
      </p>
    </div>

    <div className="space-y-6 p-8">
      {/* Image Preview / Frame */}
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/20 p-2 shadow-2xs">
        {imagePreviewUrl || currentImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreviewUrl || currentImage?.url}
            alt={formData.heroImageAlt || article.title}
            className="h-48 w-full rounded-xl border border-slate-200/80 bg-white object-cover shadow-2xs"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/30 text-xs font-medium text-sky-700/70">
            No image uploaded yet
          </div>
        )}
      </div>

      {/* File Input */}
      <div className="group">
        <label
          htmlFor="hero-image-file"
          className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-sky-800 transition-colors group-focus-within:text-sky-950"
        >
          {currentImage ? 'Replace Image' : 'Image File'}
        </label>
        
        <div className="relative rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/20 p-5 text-center transition-all duration-200 hover:border-sky-400 hover:bg-sky-50/40">
          <input
            id="hero-image-file"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-xs font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-900 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white file:shadow-xs hover:file:bg-sky-800 file:transition-colors cursor-pointer"
          />

          {imageFile && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-sky-200 bg-white px-3.5 py-2 shadow-2xs">
              <span className="truncate text-xs font-medium text-slate-700">
                Selected: <strong className="text-slate-900">{imageFile.name}</strong>
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={clearNewImage} className="h-7 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                <X className="mr-1 h-3 w-3" /> Clear
              </Button>
            </div>
          )}

          <p className="mt-2 text-xs font-normal text-slate-500">
            A new upload replaces the existing image (stored securely in Cloudinary).
          </p>
        </div>
      </div>

      {/* Image Metadata */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="group">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-sky-800 transition-colors group-focus-within:text-sky-950">
            Alt Text
          </label>
          <Input
            value={formData.heroImageAlt}
            onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
            placeholder="Describe the image for screen readers"
            className="h-11 rounded-xl border-slate-200/90 bg-sky-50/10 px-4 text-sm font-medium text-slate-800 shadow-2xs transition-all duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-sky-500/10"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Falls back to the existing alt text, then the article title.
          </p>
        </div>

        <div className="group">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-sky-800 transition-colors group-focus-within:text-sky-950">
            Caption
          </label>
          <Input
            value={formData.heroImageCaption}
            onChange={(e) => setFormData({ ...formData, heroImageCaption: e.target.value })}
            placeholder="Shown beneath the image"
            className="h-11 rounded-xl border-slate-200/90 bg-sky-50/10 px-4 text-sm font-medium text-slate-800 shadow-2xs transition-all duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-sky-500/10"
          />
        </div>
      </div>
    </div>
  </section>

  {/* Status & Visibility Section */}
  <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-amber-50/30 via-white to-slate-50/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
    <div className="border-b border-slate-200/80 bg-amber-50/60 px-8 py-5">
      <h2 className="text-base font-bold tracking-tight text-amber-950">
        Publishing Settings
      </h2>
      <p className="mt-0.5 text-xs font-medium text-amber-800/70">
        Control publishing status and public visibility across platforms.
      </p>
    </div>

    <div className="space-y-6 p-8">
      {/* Status */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-amber-800 transition-colors group-focus-within:text-amber-950">
          Status
        </label>
        <div className="relative">
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Article['status'] })}
            className="w-full appearance-none rounded-xl border border-slate-200/90 bg-amber-50/20 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-2xs outline-none transition-all duration-200 focus:border-amber-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-amber-500/10"
          >
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Public Visibility Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/30 p-5 shadow-2xs">
        <div>
          <p className="text-sm font-bold text-emerald-950">
            Public visibility
          </p>
          <p className="mt-0.5 text-xs font-medium text-emerald-800/70">
            Live (visible to public)
          </p>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            id="live"
            checked={formData.live}
            onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 ease-out peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  </section>

  {/* Form Actions */}
  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
    <div className="flex items-center gap-3">
      <Button 
        type="submit" 
        variant="primary" 
        disabled={saving}
        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>

      <Button 
        type="button" 
        variant="outline" 
        onClick={() => router.push("/admin/cases")}
        className="rounded-xl border-slate-200 px-5 py-2.5 text-xs font-bold tracking-wide text-slate-700 hover:bg-slate-100 transition-all duration-200"
      >
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
        className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-xs hover:bg-rose-700 transition-all duration-200"
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete Article
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
