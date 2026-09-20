"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { createArticle, getArticlesBySection } from "@/lib/services/articles";
import type { Article, ArticleImage } from "@/lib/types/article";
import { uploadToCloudinary } from "@/lib/services/cloudinary";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { FormActions } from "@/components/ui/FormActions";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
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

export default function CreateArticlePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    category: 'Constitutional Law',
    authorName: 'Editorial Desk',
    readingTime: 8,
    status: 'draft' as Article['status'],
    live: true,
    newspaperSection: '',
    heroImageAlt: '',
    heroImageCaption: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sectionConflict, setSectionConflict] = useState<Article | null>(null);
  const [checkingSection, setCheckingSection] = useState(false);

  /**
   * Object URLs are created once per selected file and revoked on change, so
   * the preview never leaks and no state is set inside the effect.
   */
  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }

    if (!loading && user && user.role !== "admin" && user.role !== "editor") {
      router.replace("/");
    }
  }, [loading, user, router]);

  const handleSectionChange = async (section: string) => {
    setFormData({ ...formData, newspaperSection: section });

    if (section) {
      setCheckingSection(true);
      setSectionConflict(null);
      try {
        const existing = await getArticlesBySection(section);
        if (existing.length > 0) {
          setSectionConflict(existing[0]);
        }
      } catch (err) {
        console.error('Failed to check section:', err);
      } finally {
        setCheckingSection(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { heroImageAlt, heroImageCaption, ...articleFields } = formData;
      let heroImage: ArticleImage | undefined;

      // Upload image to Cloudinary if selected
      if (imageFile) {
        try {
          const uploaded = await uploadToCloudinary(imageFile, 'articles');
          const caption = heroImageCaption.trim();
          heroImage = {
            publicId: uploaded.public_id,
            url: uploaded.secure_url,
            alt: heroImageAlt.trim() || formData.title,
            ...(caption ? { caption } : {}),
          };
        } catch (uploadErr) {
          setError(
            `Image upload failed: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`
          );
          setSaving(false);
          return;
        }
      }

      const articleData: Partial<Article> = {
        ...articleFields,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        published: formData.status === 'published',
        featured: false,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        heroImage,
      };

      const articleId = await createArticle(articleData);
      router.push(`/admin/cases/${articleId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create article");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8 text-sm text-neutral-600">Loading…</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">Content Management</p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-900">Create New Article</h1>
          <p className="mt-2 text-sm text-neutral-600">Write and publish a new article.</p>
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
            description="Add the main content and publishing information for this article."
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

            <Field
              label="Body"
              labelAccessory={<span>{formData.body.length} characters</span>}
            >
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
            title="Publishing"
            description="Control the article's status and newspaper placement."
            eyebrow="02"
            accent="amber"
          >
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Article["status"],
                  })
                }
                accent="amber"
              >
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
              </Select>
            </Field>

            <Field label="Newspaper Section" accent="amber">
              <Select
                value={formData.newspaperSection}
                onChange={(e) => void handleSectionChange(e.target.value)}
                accent="amber"
              >
                <option value="">None</option>
                <option value="lead">01 • The Lead</option>
                <option value="featured">02 • Featured Story</option>
                <option value="frontpage">03 • Today&apos;s Front Page</option>
                <option value="editorial_column">04 • Editorial Column</option>
                <option value="editors_desk">05 • Editor&apos;s Desk</option>
              </Select>
            </Field>

            {checkingSection && (
              <p className="flex items-center gap-2 text-xs font-medium text-amber-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                Checking section availability...
              </p>
            )}

            {sectionConflict && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-amber-700">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-950">
                      Section Already Taken
                    </p>
                    <p className="mt-1 text-xs font-medium text-amber-900">
                      &ldquo;<span className="font-bold text-amber-950">{sectionConflict.title}</span>&rdquo;
                      is currently assigned to this section.
                    </p>
                    <p className="mt-1 text-[11px] text-amber-800">
                      Assigning this article will replace the existing one.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </FormSection>

          <FormSection
            title="Hero Image"
            description="Upload and configure the main image for this article."
            eyebrow="03"
            accent="sky"
          >
            <Field label="Image File" accent="sky">
              <FileDropZone
                id="hero-image-file"
                onFileSelect={setImageFile}
                label={imageFile ? imageFile.name : "Choose an image to upload"}
                hint="Upload high-resolution media. Stored securely in Cloudinary."
                preview={
                  previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Selected hero preview"
                      className="mx-auto h-40 w-full max-w-sm rounded-xl border border-sky-200 object-cover"
                    />
                  ) : null
                }
              />
            </Field>

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

          <Toggle
            id="live"
            name="live"
            checked={formData.live}
            onChange={(checked) => setFormData({ ...formData, live: checked })}
            label="Public visibility"
            description="Make this article visible to public readers across platforms."
          />

          <FormActions
            primary={
              <Button type="submit" variant="primary" isLoading={saving}>
                {saving ? "Creating..." : "Create Article"}
              </Button>
            }
          >
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </FormActions>


        </form>

      </div>
    </div>
  );
}
