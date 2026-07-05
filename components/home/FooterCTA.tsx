"use client";

import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";

const links = [
  "Supreme Court",
  "Parliament",
  "Policy",
  "African Development",
  "Social Philosophy",
  "About",
];

export default function FooterCTA() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">

        <div className="grid lg:grid-cols-3 gap-16">

          {/* Publication */}

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-[#d24a43] mb-5">
              Digital Publication
            </p>

            <h2 className="font-serif text-5xl text-white">
              Appellate Tea
            </h2>

            <p className="mt-8 leading-8 text-neutral-400">
              A legal and policy publication exploring Supreme Court
              decisions, legislative developments, African development,
              and social philosophy through thoughtful storytelling.
            </p>

          </div>

          {/* Sections */}

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-[#d24a43] mb-6">
              Sections
            </p>

            <div className="space-y-4">

              {links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="flex items-center justify-between border-b border-neutral-800 pb-3 hover:text-white transition-colors group"
                >
                  <span>{link}</span>

                  <ArrowUpRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                </Link>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-[#d24a43] mb-6">
              Contact
            </p>

            <a
              href="mailto:reader@appellatetea.com"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Mail size={18} />

              reader@appellatetea.com

            </a>

            <a
              href="mailto:appellatetea@gmail.com"
              className="flex items-center gap-3 mt-4 hover:text-white transition-colors"
            >
              <Mail size={18} />

              appellatetea@gmail.com

            </a>

            <p className="mt-10 text-neutral-500 leading-8">
              Published from Africa for readers around the world,
              making law, governance and public policy more
              accessible through thoughtful editorial analysis.
            </p>

          </div>

        </div>

        <div className="border-t border-neutral-800 mt-20 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-neutral-500">

          <span>
            © {new Date().getFullYear()} Appellate Tea.
          </span>

          <span>
            Law • Policy • Society
          </span>

        </div>

      </div>

    </footer>
  );
}