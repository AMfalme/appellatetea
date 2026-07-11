"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { getPublishedArticles, getDraftArticles } from "@/lib/services/articles";
import type { Article } from "@/lib/types/article";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AdminCasesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'draft'>('all');
  const [loadingArticles, setLoadingArticles] = useState(true);

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
      loadArticles();
    }
  }, [loading, user, router, filter]);

  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      let fetched: Article[] = [];
      
      if (filter === 'published') {
        fetched = await getPublishedArticles(50);
      } else if (filter === 'draft' || filter === 'pending') {
        const drafts = await getDraftArticles(50);
        fetched = filter === 'pending' 
          ? drafts.filter(a => a.status === 'pending_review')
          : drafts.filter(a => a.status === 'draft');
      } else {
        const [published, drafts] = await Promise.all([
          getPublishedArticles(50),
          getDraftArticles(50),
        ]);
        fetched = [...published, ...drafts];
      }
      
      setArticles(fetched.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ));
    } catch (err: any) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 px-6 py-24 text-sm text-neutral-600">Loading…</div>;
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#8B1E1E]">Content Management</p>
            <h1 className="mt-2 font-serif text-3xl text-neutral-900">Articles</h1>
            <p className="mt-2 text-sm text-neutral-600">Create, edit, and manage all articles.</p>
          </div>
          <Link href="/admin/cases/new">
            <Button variant="primary">Create New Article</Button>
          </Link>
        </div>

        <div className="mt-8 flex gap-2 border-b border-neutral-200">
          {(['all', 'published', 'pending', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm capitalize ${
                filter === status
                  ? 'border-b-2 border-[#8B1E1E] text-[#8B1E1E]'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {status === 'pending' ? 'Pending Review' : status}
            </button>
          ))}
        </div>

        {loadingArticles ? (
          <div className="mt-8 text-sm text-neutral-600">Loading articles…</div>
        ) : (
          <div className="mt-8 grid gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl text-neutral-900">{article.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(article.status)}`}>
                        {article.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{article.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                      <span className="uppercase tracking-wider">{article.category}</span>
                      <span>{article.readingTime} min read</span>
                      <span>{new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 md:w-48">
                    <Link href={`/admin/cases/${article.id}`}>
                      <Button variant="outline" className="w-full">Edit</Button>
                    </Link>
                    {article.status === 'pending_review' && user?.role === 'admin' && (
                      <Button 
                        variant="primary" 
                        className="w-full"
                        onClick={async () => {
                          // TODO: Implement publish action
                          alert('Publish functionality coming soon');
                        }}
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {articles.length === 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-neutral-600">No articles found.</p>
                <Link href="/admin/cases/new" className="mt-4 inline-block">
                  <Button variant="primary">Create your first article</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
