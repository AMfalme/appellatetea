import { formatDate } from "@/lib/utils/format";
import type { Article } from "@/lib/types/article";

/**
 * Shared editorial content for the landing page.
 *
 * Every card on the front page renders an `EditorialStory`, whether it comes
 * from Firestore (published articles) or from the curated archive below.
 * One shape means the category ribbon filters live and archive content through
 * exactly the same code path.
 */
export interface EditorialStory {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  href: string;
  author: string;
  date: string;
  readingTime: number;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
}

/** Canonical ribbon order — mirrors the publication's subject areas. */
export const CATEGORY_RIBBON = [
  "All",
  "Constitutional Law",
  "Supreme Court",
  "Parliament",
  "Policy",
  "African Development",
  "Social Philosophy",
  "Judicial Appointments",
] as const;

/** Fixed slot counts keep the grid height stable while filtering. */
export const SUB_GRID_SLOTS = 4;
export const TOP_READS_COUNT = 5;

export const EDITORIAL_STATEMENT = {
  headline: "Law is more than precedent.",
  standfirst: "It is the story of society in motion.",
};

export const PULL_QUOTE = {
  quote: "Law deserves explanation, not simplification.",
  attribution: "— Editorial Board",
};

export const EDITORS_DESK_FALLBACK: EditorialStory = {
  id: "editors-desk",
  title: "Every judgment deserves more than a summary.",
  excerpt:
    "Courts resolve disputes, but they also reveal the values, tensions and aspirations of society. This desk follows the ideas behind the decisions.",
  category: "Editor's Desk",
  tags: ["Editorial"],
  href: "#front-page",
  author: "Editorial Board",
  date: "",
  readingTime: 4,
};

/**
 * Curated archive stories: they fill the grid before the first live articles
 * are published and keep every ribbon category populated, so filtering never
 * collapses the page into an empty column.
 */
export const CURATED_STORIES: EditorialStory[] = [
  {
    id: "archive-parliament-drafting",
    title: "Beyond the Bill: How Legislative Drafting Quietly Shapes National Identity",
    excerpt:
      "Every Act of Parliament carries assumptions about power, citizenship and the future of society. Looking past political debate reveals how drafting shapes identity for generations.",
    category: "Parliament",
    tags: ["Parliament", "Legislative Drafting", "Governance"],
    href: "/articles/parliament-legislative-drafting",
    author: "Editorial Desk",
    date: "5 July 2026",
    readingTime: 9,
    image: "/media/parliament.jpg",
    imageAlt: "Parliament buildings",
    imageCaption: "Parliament Buildings • Editorial Archive",
  },
  {
    id: "archive-data-protection",
    title: "Why Kenya's data protection amendments deserve closer scrutiny",
    excerpt:
      "The amendments read as technical housekeeping, yet they quietly redraw the boundary between state access and personal privacy.",
    category: "Parliament",
    tags: ["Parliament", "Data Protection", "Privacy"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "28 June 2026",
    readingTime: 6,
  },
  {
    id: "archive-constitutional-commissions",
    title: "The growing influence of constitutional commissions across East Africa",
    excerpt:
      "Independent commissions were designed to be referees. Increasingly they are also agenda-setters for institutional reform.",
    category: "Policy",
    tags: ["Policy", "Governance", "East Africa"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "24 June 2026",
    readingTime: 5,
  },
  {
    id: "archive-infrastructure-trust",
    title: "Infrastructure, law and public trust: an overlooked relationship",
    excerpt:
      "Procurement rules, concession agreements and dispute resolution decide whether a road, bridge or grid is ever finished.",
    category: "African Development",
    tags: ["African Development", "Infrastructure", "Public Trust"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "20 June 2026",
    readingTime: 7,
  },
  {
    id: "archive-constitutional-culture",
    title: "How constitutional culture influences democratic resilience",
    excerpt:
      "Text alone cannot defend a constitution. Habits of restraint, deference and accountability do the heavier work.",
    category: "Constitutional Law",
    tags: ["Constitutional Law", "Democracy", "Society"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "16 June 2026",
    readingTime: 8,
  },
  {
    id: "archive-supreme-court-administrative-justice",
    title: "How a quiet Supreme Court decision could redefine administrative justice across Africa",
    excerpt:
      "Behind seemingly technical constitutional language lies a judgment capable of reshaping accountability and institutional independence for decades.",
    category: "Constitutional Law",
    tags: ["Supreme Court", "Constitutional Law", "Administrative Justice"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "12 June 2026",
    readingTime: 14,
    image: "/media/justice.png",
    imageAlt: "Scales of justice in a courtroom",
    imageCaption: "Court of Appeal • Editorial Archive",
  },
  {
    id: "archive-supreme-court-memory",
    title: "When justice becomes memory: why societies never forget landmark judgments",
    excerpt:
      "Historic decisions outlive governments because they reshape public memory as much as constitutional doctrine.",
    category: "Supreme Court",
    tags: ["Supreme Court", "Judgments", "Public Memory"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "8 June 2026",
    readingTime: 8,
    image: "/media/Supreme.jpg",
    imageAlt: "Supreme Court building",
    imageCaption: "Supreme Court Building • Editorial Archive",
  },
  {
    id: "archive-appointments-bench",
    title: "Preparing for the Bench: what every judicial candidate should understand beyond the law",
    excerpt:
      "Competence in doctrine is the entry ticket. Judgment, temperament and institutional literacy decide the career.",
    category: "Judicial Appointments",
    tags: ["Judicial Appointments", "Judiciary", "Professional Standards"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "2 June 2026",
    readingTime: 12,
  },
  {
    id: "archive-appointments-evolution",
    title: "Inside the quiet evolution of judicial appointments across Africa",
    excerpt:
      "Appointments increasingly reflect broader constitutional conversations about accountability and institutional legitimacy.",
    category: "Judicial Appointments",
    tags: ["Judicial Appointments", "Judiciary", "Reform"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "29 May 2026",
    readingTime: 10,
  },
  {
    id: "archive-society-change",
    title: "Can law change society, or does society change the law first?",
    excerpt:
      "Reform is rarely a single moment. It is a long argument between courts, legislatures and the public they answer to.",
    category: "Social Philosophy",
    tags: ["Social Philosophy", "Society", "Reform"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "25 May 2026",
    readingTime: 11,
  },
  {
    id: "archive-institutions-leaders",
    title: "Why strong institutions matter more than strong leaders",
    excerpt:
      "Leadership is temporary. The rules, conventions and courts that survive it decide how a state behaves in a crisis.",
    category: "African Development",
    tags: ["African Development", "Institutions", "Leadership"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "21 May 2026",
    readingTime: 9,
  },
  {
    id: "archive-technology-interpretation",
    title: "Can constitutional interpretation keep pace with emerging technologies?",
    excerpt:
      "Artificial intelligence, digital identity and online governance continue to test the reach of settled constitutional text.",
    category: "Constitutional Law",
    tags: ["Constitutional Law", "Technology", "Interpretation"],
    href: "#front-page",
    author: "Editorial Desk",
    date: "17 May 2026",
    readingTime: 11,
  },
];

/** Map a Firestore article onto the shared story shape. */
export function storyFromArticle(article: Article): EditorialStory {
  const image = article.heroImage ?? article.coverImage;

  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || "",
    category: article.category || "Editorial",
    tags: [article.category, ...(article.tags ?? [])].filter(
      (tag): tag is string => Boolean(tag)
    ),
    href: `/articles/${article.slug}`,
    author: article.authorName || "Editorial Desk",
    date: article.publishedAt ? formatDate(article.publishedAt) : "",
    readingTime: article.readingTime || 8,
    image: image?.url,
    imageAlt: image?.alt || article.title,
    imageCaption: image?.caption,
  };
}

/** Live published articles first, curated archive filling the remaining slots. */
export function buildStoryPool(articles: Article[]): EditorialStory[] {
  const live = articles.map(storyFromArticle);
  const seen = new Set(live.map((story) => story.title.trim().toLowerCase()));

  return [
    ...live,
    ...CURATED_STORIES.filter((story) => !seen.has(story.title.trim().toLowerCase())),
  ];
}

/** Case-insensitive match on category or tags; "All" always matches. */
export function matchesCategory(story: EditorialStory, category: string): boolean {
  if (category === "All") return true;

  const target = category.toLowerCase();

  return (
    story.category.toLowerCase() === target ||
    story.tags.some((tag) => tag.toLowerCase() === target)
  );
}

/** Hosts allowed by `images.remotePatterns` in next.config.ts. */
const ALLOWED_IMAGE_HOSTS = ["res.cloudinary.com", "images.unsplash.com"];

/**
 * Only return sources that `next/image` is configured to serve: local assets and
 * whitelisted remote hosts. An unexpected host throws at render time, so it is
 * treated as "no image" and the caller falls back to a local asset.
 */
export function safeImageSrc(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);

    if (url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(url.hostname)) {
      return src;
    }
  } catch {
    // Not a valid absolute URL — ignore it.
  }

  return undefined;
}
