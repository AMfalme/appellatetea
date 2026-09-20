"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { createArticle, updateArticle, getArticlesBySection } from "@/lib/services/articles";
import type { Article, ArticleImage } from "@/lib/types/article";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadToCloudinary } from "@/lib/services/cloudinary";

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
    heroImageUrl: '',
    heroImagePublicId: '',
    heroImageAlt: '',
    heroImageCaption: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }

    if (!loading && user && user.role !== "admin" && user.role !== "editor") {
      router.replace("/");
    }
  }, [loading, user, router]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sectionConflict, setSectionConflict] = useState<Article | null>(null);
  const [checkingSection, setCheckingSection] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

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
        } catch (uploadErr: any) {
          setError(`Image upload failed: ${uploadErr.message}`);
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
    } catch (err: any) {
      setError(err.message || "Failed to create article");
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
        Add the main content and publishing information for this article.
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
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Enter a compelling article title..."
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
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          placeholder="Write a brief, engaging summary..."
          rows={3}
          required
          className="w-full resize-y rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-3 text-sm font-normal text-slate-800 shadow-2xs outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* Body */}
      <div className="group">
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
            Body
          </label>
          <span className="text-[11px] font-medium text-slate-400">
            Article content
          </span>
        </div>

        <textarea
          value={formData.body}
          onChange={(e) =>
            setFormData({ ...formData, body: e.target.value })
          }
          placeholder="Write your main article content here..."
          rows={14}
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
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
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
            Reading Time
          </label>
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
              className="h-10 rounded-xl border-slate-200/90 bg-slate-50/60 pl-4 pr-20 text-sm font-semibold text-slate-900 shadow-2xs transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:text-indigo-950 focus:ring-4 focus:ring-indigo-500/10"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              minutes
            </span>
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors group-focus-within:text-indigo-900">
          Author Name
        </label>
        <Input
          value={formData.authorName}
          onChange={(e) =>
            setFormData({ ...formData, authorName: e.target.value })
          }
          placeholder="Enter author name"
          className="h-11 rounded-xl border-slate-200/90 bg-slate-50/60 px-4 text-sm font-medium text-slate-800 shadow-2xs transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>
    </div>
  </section>

  {/* Publishing */}
  <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-amber-50/30 via-white to-slate-50/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
    <div className="border-b border-slate-200/80 bg-amber-50/60 px-8 py-5">
      <h2 className="text-base font-bold tracking-tight text-amber-950">
        Publishing
      </h2>
      <p className="mt-0.5 text-xs font-medium text-amber-800/70">
        Control the article's status and newspaper placement.
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
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Article["status"],
              })
            }
            className="w-full appearance-none rounded-xl border border-slate-200/90 bg-amber-50/20 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-2xs outline-none transition-all duration-200 focus:border-amber-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-amber-500/10"
          >
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="published">Published</option>
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Newspaper Section */}
      <div className="group">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-amber-800 transition-colors group-focus-within:text-amber-950">
          Newspaper Section
        </label>

        <div className="relative">
          <select
            value={formData.newspaperSection}
            onChange={(e) => void handleSectionChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200/90 bg-amber-50/20 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-2xs outline-none transition-all duration-200 focus:border-amber-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-amber-500/10"
          >
            <option value="">None</option>
            <option value="lead">01 • The Lead</option>
            <option value="featured">02 • Featured Story</option>
            <option value="frontpage">03 • Today's Front Page</option>
            <option value="editorial_column">04 • Editorial Column</option>
            <option value="editors_desk">05 • Editor's Desk</option>
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {checkingSection && (
          <p className="mt-2.5 flex items-center gap-2 text-xs font-medium text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Checking section availability...
          </p>
        )}

        {sectionConflict && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-200/80 p-1 text-amber-800">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Section Already Taken
                </p>
                <p className="mt-1 text-xs font-medium text-amber-900">
                  "<span className="font-bold text-amber-950">{sectionConflict.title}</span>" is currently assigned to this section.
                </p>
                <p className="mt-1 text-[11px] text-amber-800">
                  Assigning this article will replace the existing one.
                </p>
              </div>
            </div>
          </div>
        )}
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
        Upload and configure the main image for this article.
      </p>
    </div>

    <div className="space-y-6 p-8">
      {/* Image Upload */}
      <div className="group">
        <label
          htmlFor="hero-image-file"
          className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-sky-800 transition-colors group-focus-within:text-sky-950"
        >
          Image File
        </label>

        <div className="relative rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/20 p-6 text-center transition-all duration-200 hover:border-sky-400 hover:bg-sky-50/40">
          <input
            id="hero-image-file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-xs font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-900 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white file:shadow-xs hover:file:bg-sky-800 file:transition-colors cursor-pointer"
          />

          <p className="mt-3 text-xs font-normal text-slate-500">
            Upload high-resolution media. Stored securely in Cloudinary.
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
            onChange={(e) =>
              setFormData({
                ...formData,
                heroImageAlt: e.target.value,
              })
            }
            placeholder="Describe image accessibility..."
            className="h-11 rounded-xl border-slate-200/90 bg-sky-50/10 px-4 text-sm font-medium text-slate-800 shadow-2xs transition-all duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-sky-500/10"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Falls back to the article title when left empty.
          </p>
        </div>

        <div className="group">
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-sky-800 transition-colors group-focus-within:text-sky-950">
            Caption
          </label>

          <Input
            value={formData.heroImageCaption}
            onChange={(e) =>
              setFormData({
                ...formData,
                heroImageCaption: e.target.value,
              })
            }
            placeholder="Caption shown beneath image"
            className="h-11 rounded-xl border-slate-200/90 bg-sky-50/10 px-4 text-sm font-medium text-slate-800 shadow-2xs transition-all duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:text-slate-950 focus:ring-4 focus:ring-sky-500/10"
          />
        </div>
      </div>
    </div>
  </section>

  {/* Visibility */}
  <div className="flex items-center justify-between rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/30 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-300">
    <div>
      <p className="text-sm font-bold text-emerald-950">
        Public visibility
      </p>
      <p className="mt-0.5 text-xs font-medium text-emerald-800/70">
        Make this article visible to public readers across platforms.
      </p>
    </div>

    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        id="live"
        checked={formData.live}
        onChange={(e) =>
          setFormData({ ...formData, live: e.target.checked })
        }
        className="peer sr-only"
      />

      <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 ease-out peer-checked:after:translate-x-full" />
    </label>
  </div>

  {/* Actions */}
  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80">
    <Button
      type="button"
      variant="outline"
      onClick={() => router.back()}
      className="rounded-xl px-5 py-2.5 text-xs font-bold tracking-wide border-slate-200 text-slate-700 hover:bg-slate-100 transition-all duration-200"
    >
      Cancel
    </Button>

    <Button 
      type="submit" 
      variant="primary" 
      disabled={saving}
      className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50"
    >
      {saving ? "Creating..." : "Create Article"}
    </Button>
  </div>
</form>
      </div>
    </div>
  );
}