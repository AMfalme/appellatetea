import {
  EditorialNavbar,
  Hero,
  FeaturedStory,
  EditorialGrid,
  EditorsPick,
  Categories,
  QuoteSection,
  Newsletter,
  FooterCTA,
} from "@/components/home";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf8f3] text-neutral-900">

      <EditorialNavbar />

      <Hero />

      <FeaturedStory />

      <EditorialGrid />

      <EditorsPick />

      <Categories />

      <QuoteSection />

      <Newsletter />

      <FooterCTA />

    </main>
  );
}