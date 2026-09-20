import { FrontPage, HomeMasthead, NewsGrid } from "@/components/home";

/**
 * Landing page composition.
 *
 * Deliberately flat: the publication chrome (sticky header, footer) comes from
 * `app/layout.tsx`, so the landing page only adds a compact edition strip, the
 * masthead split carrying the lead story, and the filterable front-page grid.
 * Editorial statements, the pull-quote and the newsletter all live inside those
 * bands instead of stacking as full-width sections, which keeps the page tight
 * and the hierarchy obvious.
 */
export default function HomePage() {
  return (
    <div className="bg-[#faf8f3] text-neutral-900">
      <HomeMasthead />
      <FrontPage />
      <NewsGrid />
    </div>
  );
}
