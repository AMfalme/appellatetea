"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Newspaper,
  Scale,
} from "lucide-react";

const sections = [
  "Supreme Court",
  "Parliament",
  "Policy",
  "African Development",
  "Social Philosophy",
  "Judicial Appointments",
];

export default function FooterCTA() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">

      {/* Editorial Closing */}

      <div className="border-b border-neutral-800">

        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24 text-center">

          <p className="uppercase tracking-[0.4em] text-xs text-[#d24a43] mb-8">

            08 • The Final Word

          </p>

          <h2 className="font-serif text-5xl md:text-6xl text-white leading-tight">

            Good legal writing
            <br />
            should illuminate,
            <br />
            not intimidate.

          </h2>

          <p className="mt-10 text-neutral-400 leading-9 max-w-3xl mx-auto">

            Appellate Tea exists to make constitutional thought,
            public policy and judicial reasoning understandable
            without sacrificing intellectual depth.

          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

        <div className="grid lg:grid-cols-4 gap-16">

          {/* Publication */}

          <div>

            <div className="flex items-center gap-3 mb-6">

              <Scale className="text-[#d24a43]" />

              <span className="uppercase tracking-[0.35em] text-xs">

                Appellate Tea

              </span>

            </div>

            <h3 className="font-serif text-4xl text-white">

              Law.
              <br />
              Policy.
              <br />
              Society.

            </h3>

            <p className="mt-8 leading-8 text-neutral-400">

              A digital publication examining
              constitutional law, governance,
              African development and the ideas
              shaping public institutions.

            </p>

          </div>

          {/* Publication */}

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-[#d24a43] mb-8">

              Publication

            </p>

            <div className="space-y-4">

              {sections.map((section) => (

                <Link
                  key={section}
                  href="#"
                  className="
                    flex
                    items-center
                    justify-between
                    group
                    border-b
                    border-neutral-800
                    pb-3
                    hover:text-white
                    transition-colors
                  "
                >

                  {section}

                  <ArrowUpRight
                    size={16}
                    className="
                      opacity-0
                      group-hover:opacity-100
                    "
                  />

                </Link>

              ))}

            </div>

          </div>

          {/* Reader Services */}

          <div>

            <p className="uppercase tracking-[0.35em] text-xs text-[#d24a43] mb-8">

              Reader Services

            </p>

            <div className="space-y-5">

              <Link href="#">
                About
              </Link>

              <Link href="#">
                Editorial Policy
              </Link>

              <Link href="#">
                Submit a Topic
              </Link>

              <Link href="#">
                Contact
              </Link>

              <Link href="#">
                Privacy Policy
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <div className="flex items-center gap-3 mb-8">

              <Newspaper className="text-[#d24a43]" />

              <span className="uppercase tracking-[0.35em] text-xs">

                Editorial Desk

              </span>

            </div>

            <a
              href="mailto:reader@appellatetea.com"
              className="flex items-center gap-3 hover:text-white"
            >

              <Mail size={17} />

              reader@appellatetea.com

            </a>

            <a
              href="mailto:appellatetea@gmail.com"
              className="flex items-center gap-3 mt-5 hover:text-white"
            >

              <Mail size={17} />

              appellatetea@gmail.com

            </a>

            <p className="mt-10 leading-8 text-neutral-500">

              Independent digital publication.
              Published from Africa for readers
              interested in constitutional law,
              governance and public policy.

            </p>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-neutral-800 mt-20 pt-8 flex flex-col lg:flex-row justify-between gap-5 text-sm text-neutral-500">

          <span>

            © {new Date().getFullYear()} Appellate Tea.
            All Rights Reserved.

          </span>

          <span>

            Digital Publication • Est. 2026 • Schema.org/DigitalPublication

          </span>

        </div>

      </div>

    </footer>
  );
}