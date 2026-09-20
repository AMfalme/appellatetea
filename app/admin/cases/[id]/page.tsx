"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
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
import type { Article, ArticleImage } from "@/lib/types/article";
import { uploadToCloudinary } from "@/lib/services/cloudinary";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { FormActions } from "@/components/ui/FormActions";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";

const CATEGORY_OPTIONS = [
  "Constitutional Law",
  "Supreme Court",
  "Parliament",
  "Policy",
  "African Development",
  "Social Philosophy",
  "Judicial Appointments",
];

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

  const selectImageFile = (file: File) => {
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
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
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50/70 px-8 py-5 text-xs font-semibold text-red-700 shadow-sm"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection
            title="Article Details"
            description="Update the main content and editorial information for this article."
            eyebrow="01"
          >
            <Field label="Title">
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a compelling article title..."
                required
              />
            </Field>

            <Field label="Excerpt" hint="Appears in listings and search results.">
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Write a brief, engaging summary..."
                rows={3}
                required
              />
            </Field>

            <Field label="Body" labelAccessory={<span>{formData.body.length} characters</span>}>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Write your main article content here..."
                rows={14}
                required
                className="font-normal leading-relaxed"
              />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Category">
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Reading Time">
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.readingTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readingTime: parseInt(e.target.value) || 8,
                      })
                    }
                    min={1}
                    className="pr-24"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    minutes
                  </span>
                </div>
              </Field>
            </div>

            <Field label="Author Name">
              <Input
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="Enter author name"
              />
            </Field>
          </FormSection>


          <FormSection
            title="Hero Image"
            description="Review the current image, replace it, or clear a staged upload."
            eyebrow="02"
            accent="sky"
          >
            <Field label="Current Image" accent="sky">
              <div className="rounded-2xl border border-sky-200 bg-sky-50/20 p-4">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-sky-200 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreviewUrl ?? currentImage?.url ?? "/media/justice.png"}
                    alt={formData.heroImageAlt || currentImage?.alt || formData.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="mt-3 text-xs font-medium text-sky-800/70">
                  {imagePreviewUrl
                    ? "New image staged — save to upload it to Cloudinary."
                    : "Currently published image."}
                </p>
              </div>
            </Field>

            <FileDropZone
              id="hero-image-file"
              inputRef={fileInputRef}
              onFileSelect={selectImageFile}
              label={imageFile ? imageFile.name : "Choose a replacement image"}
              hint="Upload high-resolution media. Stored securely in Cloudinary."
              accessory={
                imageFile ? (
                  <Button type="button" variant="secondary" size="sm" onClick={clearNewImage}>
                    Clear selected file
                  </Button>
                ) : null
              }
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Alt Text"
                accent="sky"
                hint="Falls back to the article title when left empty."
              >
                <Input
                  value={formData.heroImageAlt}
                  onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
                  placeholder="Describe image accessibility..."
                  accent="sky"
                />
              </Field>

              <Field label="Caption" accent="sky">
                <Input
                  value={formData.heroImageCaption}
                  onChange={(e) => setFormData({ ...formData, heroImageCaption: e.target.value })}
                  placeholder="Caption shown beneath image"
                  accent="sky"
                />
              </Field>
            </div>
          </FormSection>


          <FormSection
            title="Publishing Settings"
            description="Control publishing status and public visibility across platforms."
            eyebrow="03"
            accent="amber"
          >
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Article["status"] })
                }
                accent="amber"
              >
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
          </FormSection>

          <Toggle
            id="live"
            name="live"
            checked={formData.live}
            onChange={(checked) => setFormData({ ...formData, live: checked })}
            label="Public visibility"
            description="Live (visible to public readers across platforms)."
          />

          <FormActions
            primary={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/cases")}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="primary" isLoading={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            }
          >
            {user?.role === "admin" && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Article
              </Button>
            )}
          </FormActions>
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
          Are you sure you want to delete{" "}
          <strong className="text-neutral-900">{article?.title || "this article"}</strong>? This
          will remove it from the public site and move it to archived status.
        </p>

        {deleteError && (
          <div
            role="alert"
            className="mt-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-xs font-semibold text-red-700"
          >
            {deleteError}
          </div>
        )}

        <FormActions
          className="mt-4"
          primary={
            <Button variant="destructive" size="sm" disabled={deleting} onClick={handleDelete}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          }
        >
          <Button
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
        </FormActions>
      </Modal>
    </div>
  );
}

