"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, CalendarDays, User2 } from "lucide-react";
import { motion } from "framer-motion";

const leadStory = {
  category: "Parliament",
  title:
    "Beyond the Bill: How Legislative Drafting Quietly Shapes National Identity",
  excerpt:
    "Every Act of Parliament carries assumptions about power, citizenship and the future of society. Looking beyond political debate reveals how legislative drafting quietly shapes national identity for generations.",
  image: "https://images.unsplash.com/photo-1529107386315-e1a2f48d54f6?w=1600&q=80",
  author: "Editorial Desk",
  date: "5 July 2026",
  readTime: "9 min read",
};

const briefs = [
  {
    number: "01",
    category: "Parliament",
    title:
      "Why Kenya's latest data protection amendments deserve closer scrutiny.",
    read: "6 min read",
  },
  {
    number: "02",
    category: "Policy",
    title:
      "The growing influence of constitutional commissions across East Africa.",
    read: "5 min read",
  },
  {
    number: "03",
    category: "Development",
    title:
      "Infrastructure, law and public trust: an overlooked relationship.",
    read: "7 min read",
  },
  {
    number: "04",
    category: "Society",
    title:
      "How constitutional culture influences democratic resilience.",
    read: "8 min read",
  },
];

const stories = [
  {
    number: "05",
    category: "Opinion",
    title:
      "When justice becomes memory: why societies never forget landmark judgments.",
    excerpt:
      "Historic judicial decisions outlive governments because they reshape public memory as much as constitutional doctrine.",
    read: "8 min read",
    author: "Editorial Desk",
    date: "5 July 2026",
  },
  {
    number: "06",
    category: "Judiciary",
    title:
      "Inside the quiet evolution of judicial appointments across Africa.",
    excerpt:
      "Appointments to the bench increasingly reflect broader constitutional conversations about accountability and institutional legitimacy.",
    read: "10 min read",
    author: "Editorial Desk",
    date: "5 July 2026",
  },
  {
    number: "07",
    category: "Constitution",
    title:
      "Can constitutional interpretation keep pace with emerging technologies?",
    excerpt:
      "Artificial intelligence, digital identity and online governance continue to challenge constitutional interpretation in unexpected ways.",
    read: "11 min read",
    author: "Editorial Desk",
    date: "5 July 2026",
  },
];

export default function EditorialGrid() {
  return (
    <section className=" py-28 border-b border-neutral-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Heading */}

        <div className="flex items-center gap-5 mb-20">

          <div className="flex-1 h-px bg-neutral-300" />

          <span className="uppercase tracking-[0.4em] text-xs font-semibold text-[#8B1E1E]">
            03 • Today's Front Page
          </span>

          <div className="flex-1 h-px bg-neutral-300" />

        </div>

        {/* Newspaper Layout */}

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Lead Story */}

          <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .6 }}
            className="lg:col-span-8"
          >

            <figure>

              <Image
                src={leadStory.image}
                alt={leadStory.title}
                width={1600}
                height={1000}
                className="aspect-[16/9] object-cover w-full"
              />

              <figcaption className="mt-3 text-sm italic text-neutral-500">
                Parliament Buildings • Editorial Archive
              </figcaption>

            </figure>

            <div className="mt-10">

              <p className="uppercase tracking-[0.3em] text-xs font-semibold text-[#8B1E1E]">

                {leadStory.category}

              </p>

              <h2 className="mt-5 font-serif text-5xl md:text-6xl leading-tight text-neutral-900 hover:text-[#8B1E1E] transition-colors">

                <Link href="/articles/parliament-legislative-drafting">

                  {leadStory.title}

                </Link>

              </h2>

              <p className="mt-8 text-lg leading-9 text-neutral-700 max-w-4xl">

                {leadStory.excerpt}

              </p>

              <div className="mt-10 flex flex-wrap gap-8 text-sm text-neutral-500">

                <div className="flex items-center gap-2">

                  <User2 size={15} />

                  {leadStory.author}

                </div>

                <div className="flex items-center gap-2">

                  <CalendarDays size={15} />

                  {leadStory.date}

                </div>

                <div className="flex items-center gap-2">

                  <Clock3 size={15} />

                  {leadStory.readTime}

                </div>

              </div>

              <Link
                href="/articles/parliament-legislative-drafting"
                className="inline-flex items-center gap-3 mt-10 text-[#8B1E1E] font-semibold group"
              >
                Continue Reading

                <ArrowRight className="transition-transform group-hover:translate-x-1" />

              </Link>

            </div>

          </motion.article>

          {/* Today's Briefs */}

          <aside className="lg:col-span-4 lg:border-l lg:border-neutral-300 lg:pl-10">

            <div className="flex items-center justify-between mb-10">

              <h3 className="uppercase tracking-[0.35em] text-xs font-semibold text-[#8B1E1E]">

                Today's Briefs

              </h3>

              <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">

                Updated

              </span>

            </div>

            <div className="space-y-10">

              {briefs.map((brief) => (

                <article
                  key={brief.number}
                  className="border-b border-neutral-200 pb-8"
                >

                  <div className="flex items-start gap-5">

                    <span className="font-serif text-3xl text-neutral-300">

                      {brief.number}

                    </span>

                    <div>

                      <p className="uppercase tracking-[0.25em] text-[11px] font-semibold text-[#8B1E1E]">

                        {brief.category}

                      </p>

                      <h4 className="mt-3 font-serif text-2xl leading-snug text-neutral-900 hover:text-[#8B1E1E] transition-colors">

                        <Link href="#">

                          {brief.title}

                        </Link>

                      </h4>

                      <p className="mt-4 text-sm text-neutral-500">

                        {brief.read}

                      </p>

                    </div>

                  </div>

                </article>

              ))}
            </div>

          </aside>

        </div>

        {/* CONTINUE IN PART 2 */}

                {/* Lower Front Page */}

        <div className="mt-28">

          <div className="flex items-center gap-5 mb-14">

            <div className="flex-1 h-px bg-neutral-300" />

            <span className="uppercase tracking-[0.35em] text-xs font-semibold text-neutral-500">
              Editorial Columns
            </span>

            <div className="flex-1 h-px bg-neutral-300" />

          </div>

          <div className="grid lg:grid-cols-3 gap-12">

            {stories.map((story, index) => (

              <motion.article
                key={story.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: .55,
                  delay: index * .08,
                }}
                className="
                  border-t
                  border-neutral-300
                  pt-8
                  flex
                  flex-col
                "
              >

                {/* Story Number */}

                <div className="flex items-center justify-between mb-5">

                  <span className="font-serif text-4xl text-neutral-300">

                    {story.number}

                  </span>

                  <span className="uppercase tracking-[0.25em] text-[11px] font-semibold text-[#8B1E1E]">

                    {story.category}

                  </span>

                </div>

                {/* Headline */}

                <h3
                  className="
                    font-serif
                    text-3xl
                    leading-tight
                    text-neutral-900
                    hover:text-[#8B1E1E]
                    transition-colors
                  "
                >

                  <Link href="#">

                    {story.title}

                  </Link>

                </h3>

                {/* Excerpt */}

                <p
                  className="
                    mt-6
                    text-neutral-700
                    leading-8
                    flex-grow
                  "
                >

                  {story.excerpt}

                </p>

                {/* Metadata */}

                <div
                  className="
                    mt-10
                    border-t
                    border-neutral-200
                    pt-6
                    space-y-3
                    text-sm
                    text-neutral-500
                  "
                >

                  <div className="flex items-center gap-2">

                    <User2 size={15} />

                    <span>{story.author}</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <CalendarDays size={15} />

                    <span>{story.date}</span>

                  </div>

                  <div className="flex items-center gap-2">

                    <Clock3 size={15} />

                    <span>{story.read}</span>

                  </div>

                </div>

                {/* Read Link */}

                <Link
                  href="#"
                  className="
                    inline-flex
                    items-center
                    gap-3
                    mt-8
                    text-[#8B1E1E]
                    font-semibold
                    group
                  "
                >

                  Read Article

                  <ArrowRight
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />

                </Link>

              </motion.article>

            ))}

          </div>

        </div>

        {/* Editorial Closing */}

        <div
          className="
            mt-28
            border-t
            border-b
            border-neutral-300
            py-12
          "
        >

          <div className="max-w-4xl mx-auto text-center">

            <p
              className="
                uppercase
                tracking-[0.35em]
                text-xs
                text-[#8B1E1E]
                font-semibold
                mb-6
              "
            >
              Continuing Coverage
            </p>

            <h3
              className="
                font-serif
                text-4xl
                md:text-5xl
                leading-tight
                text-neutral-900
              "
            >
              Every judgment tells a legal story.
              <br />
              Every policy reveals a social one.
            </h3>

            <p
              className="
                mt-8
                text-lg
                leading-9
                text-neutral-600
                max-w-3xl
                mx-auto
              "
            >
              Appellate Tea follows the ideas behind the decisions—
              examining how courts, legislatures and institutions
              quietly shape the societies they serve.
            </p>

          </div>

        </div>
              </div>
    </section>
  );
}