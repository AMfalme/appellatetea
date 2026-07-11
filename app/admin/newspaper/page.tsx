"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getPublishedArticles } from "@/lib/services/articles";
import type { Article } from "@/lib/types/article";
import type { NewspaperSection, NewspaperSectionConfig } from "@/lib/types/newspaper";
import { SECTION_LABELS, SECTION_DESCRIPTIONS } from "@/lib/types/newspaper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

const PLACEHOLDER_TITLES: Record<NewspaperSection, string> = {
  lead: 'No Lead Story Assigned',
  featured: 'No Featured Story Selected',
  frontpage: 'Front Page Coming Soon',
  editorial_column: 'Editorial Column Under Preparation',
  editors_desk: "Editor's Desk Notes Pending",
};

const PLACEHOLDER_EXCERPTS: Record<NewspaperSection, string> = {
  lead: 'The editorial team is working on the lead story. Check back soon for breaking news and in-depth analysis.',
  featured: 'A featured story will be selected by the editorial team. Stay tuned for exclusive content.',
  frontpage: 'Today\'s front page is being prepared with the most important stories and updates.',
  editorial_column: 'The editorial board is crafting its perspective on current affairs. Coming soon.',
  editors_desk: "Updates from the editor's desk will be posted here regularly.",
};

export default function NewspaperAdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [sections, setSections] = useState<NewspaperSectionConfig[]>([]);
  const [placeholders, setPlaceholders] = useState<Set<NewspaperSection>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<NewspaperSection | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
      return;
    }

    if (!loading && user && user.role !== "admin" && user.role !== "editor") {
      router.replace("/");
      return;
    }

    if (!loading && (user?.role === "admin" || user?.role === "editor")) {
      void loadData();
    }
  }, [loading, user, router]);

  const loadData = async () => {
    try {
      const publishedArticles = await getPublishedArticles(20);
      setArticles(publishedArticles);

      // Load sections from localStorage (or Firestore in production)
      const stored = localStorage.getItem('newspaper-sections');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSections(parsed.sections || []);
        setPlaceholders(new Set(parsed.placeholders || []));
      } else {
        // Initialize with default sections
        const defaultSections: NewspaperSectionConfig[] = [
          { id: '1', section: 'lead', isPlaceholder: true, order: 1, updatedAt: new Date() },
          { id: '2', section: 'featured', isPlaceholder: true, order: 2, updatedAt: new Date() },
          { id: '3', section: 'frontpage', isPlaceholder: true, order: 3, updatedAt: new Date() },
          { id: '4', section: 'editorial_column', isPlaceholder: true, order: 4, updatedAt: new Date() },
          { id: '5', section: 'editors_desk', isPlaceholder: true, order: 5, updatedAt: new Date() },
        ];
        setSections(defaultSections);
        setPlaceholders(new Set(['lead', 'featured', 'frontpage', 'editorial_column', 'editors_desk']));
      }
    } catch (err: any) {
      setError(err.message || "Unable to load data");
    }
  };

  const handleAssignArticle = (section: NewspaperSection) => {
    setSelectedSection(section);
    const existing = sections.find(s => s.section === section);
    setSelectedArticleId(existing?.articleId || '');
    setIsModalOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!selectedSection || !selectedArticleId) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const article = articles.find(a => a.id === selectedArticleId);
      if (!article) throw new Error('Article not found');

      const updatedSections = sections.map(s => 
        s.section === selectedSection 
          ? {
              ...s,
              articleId: article.id,
              articleSlug: article.slug,
              title: article.title,
              excerpt: article.excerpt,
              isPlaceholder: false,
              updatedAt: new Date(),
            }
          : s
      );

      const newPlaceholders = new Set(placeholders);
      newPlaceholders.delete(selectedSection);
      setPlaceholders(newPlaceholders);
      setSections(updatedSections);

      // Save to localStorage (replace with Firestore in production)
      localStorage.setItem('newspaper-sections', JSON.stringify({
        sections: updatedSections,
        placeholders: Array.from(newPlaceholders),
      }));

      setMessage(`${SECTION_LABELS[selectedSection]} assigned successfully`);
      setIsModalOpen(false);
      setSelectedSection(null);
      setSelectedArticleId('');
    } catch (err: any) {
      setError(err.message || "Unable to save assignment");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAssignment = (section: NewspaperSection) => {
    const updatedSections = sections.map(s =>
      s.section === section
        ? {
            ...s,
            articleId: undefined,
            articleSlug: undefined,
            title: undefined,
            excerpt: undefined,
            isPlaceholder: true,
            updatedAt: new Date(),
          }
        : s
    );

    const newPlaceholders = new Set(placeholders);
    newPlaceholders.add(section);
    setPlaceholders(newPlaceholders);
    setSections(updatedSections);

    localStorage.setItem('newspaper-sections', JSON.stringify({
      sections: updatedSections,
      placeholders: Array.from(newPlaceholders),
    }));

    setMessage(`${SECTION_LABELS[section]} removed`);
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">Loading workspace…</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded border border-neutral-200 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">Editorial Management</p>
            <h1 className="mt-2 font-serif text-3xl text-neutral-900">Newspaper Layout</h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-600">
              Assign articles to newspaper sections. Placeholder stories will be shown when articles are not assigned.
            </p>
          </div>

          {placeholders.size > 0 && (
            <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ {placeholders.size} section{placeholders.size > 1 ? 's' : ''} using placeholder content
              </p>
              <p className="mt-1 text-xs text-yellow-700">
                Assign articles to replace placeholders and provide a complete reading experience.
              </p>
            </div>
          )}

          {message ? <p className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded">{message}</p> : null}
          {error ? <p className="mt-4 text-sm text-[#8B1E1E] bg-red-50 p-3 rounded">{error}</p> : null}
        </div>

        <div className="grid gap-6">
          {sections.sort((a, b) => a.order - b.order).map((section) => (
            <Card key={section.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl text-neutral-900">{SECTION_LABELS[section.section]}</h3>
                    {section.isPlaceholder && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                        Placeholder
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">{SECTION_DESCRIPTIONS[section.section]}</p>

                  {!section.isPlaceholder && section.title ? (
                    <div className="mt-4 rounded border border-neutral-200 bg-neutral-50 p-4">
                      <p className="font-medium text-neutral-900">{section.title}</p>
                      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{section.excerpt}</p>
                      {section.articleSlug && (
                        <p className="mt-2 text-xs text-neutral-500">Slug: {section.articleSlug}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 rounded border border-dashed border-neutral-300 bg-neutral-50 p-4">
                      <p className="text-sm font-medium text-neutral-700">{PLACEHOLDER_TITLES[section.section]}</p>
                      <p className="mt-1 text-xs text-neutral-500">{PLACEHOLDER_EXCERPTS[section.section]}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:w-48">
                  {section.isPlaceholder ? (
                    <Button
                      variant="primary"
                      onClick={() => handleAssignArticle(section.section)}
                      className="w-full"
                    >
                      Assign Article
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleAssignArticle(section.section)}
                        className="w-full"
                      >
                        Change Article
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveAssignment(section.section)}
                        className="w-full text-red-700 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="font-serif text-xl text-neutral-900">Published Articles</h3>
          <p className="mt-2 text-sm text-neutral-600">Select from available published articles to assign to sections.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded border border-neutral-200 bg-white p-4 hover:border-[#8B1E1E] transition-colors"
              >
                <p className="font-medium text-neutral-900 line-clamp-2">{article.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{article.category}</p>
                <p className="mt-2 text-xs text-neutral-600 line-clamp-2">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSection(null);
          setSelectedArticleId('');
        }}
        title={`Assign Article to ${selectedSection ? SECTION_LABELS[selectedSection] : ''}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedSection(null);
                setSelectedArticleId('');
                router.push('/admin/cases/new');
              }}
              className="flex-1"
            >
              Create New Article
            </Button>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <p className="text-sm font-medium text-neutral-700 mb-2">Or select existing article:</p>
            <div className="max-h-96 overflow-y-auto">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticleId(article.id)}
                  className={`cursor-pointer rounded border p-4 mb-2 transition-colors ${
                    selectedArticleId === article.id
                      ? 'border-[#8B1E1E] bg-red-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <p className="font-medium text-neutral-900">{article.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">{article.category} • {article.readingTime} min read</p>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedSection(null);
                setSelectedArticleId('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveAssignment}
              disabled={!selectedArticleId || saving}
            >
              {saving ? 'Saving...' : 'Assign Article'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}