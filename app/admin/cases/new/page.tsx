"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { createArticle, updateArticle, getArticlesBySection } from "@/lib/services/articles";
import type { Article } from "@/lib/types/article";
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
      let heroImage = undefined;
      
      // Upload image to Cloudinary if selected
      if (imageFile) {
        try {
          const uploaded = await uploadToCloudinary(imageFile, 'articles');
          heroImage = {
            publicId: uploaded.public_id,
            url: uploaded.secure_url,
            alt: formData.title,
          };
        } catch (uploadErr: any) {
          setError(`Image upload failed: ${uploadErr.message}`);
          setSaving(false);
          return;
        }
      }

      const articleData: Partial<Article> = {
        ...formData,
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
    return <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">Loading…</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
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
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Newspaper Section</label>
                <select
                  value={formData.newspaperSection}
                  onChange={(e) => void handleSectionChange(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white px-3 py-2"
                >
                  <option value="">None</option>
                  <option value="lead">01 • The Lead</option>
                  <option value="featured">02 • Featured Story</option>
                  <option value="frontpage">03 • Today's Front Page</option>
                  <option value="editorial_column">04 • Editorial Column</option>
                  <option value="editors_desk">05 • Editor's Desk</option>
                </select>
                {checkingSection && <p className="mt-1 text-xs text-neutral-500">Checking section...</p>}
                {sectionConflict && (
                  <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 p-3">
                    <p className="text-sm font-medium text-yellow-800">Section Already Taken</p>
                    <p className="mt-1 text-xs text-yellow-700">
                      "{sectionConflict.title}" is currently assigned to this section.
                    </p>
                    <p className="mt-1 text-xs text-yellow-600">
                      Assigning this article will replace the existing one.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Hero Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                />
                <p className="mt-1 text-xs text-neutral-500">Upload an image for this article (will be stored in Cloudinary)</p>
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

          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Article'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}