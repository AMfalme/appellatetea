import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { Header } from "@/components/layout/Header";
import FooterCTA from "@/components/home/FooterCTA";
import { PublicOnly } from "@/components/layout/PublicOnly";

import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Appellate Tea - Legal Publication Platform",
  description: "A production-ready legal publication platform for accessing case law and legal opinions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <PublicOnly>
                <Header />
              </PublicOnly>
              <main className="flex-1">{children}</main>
              <PublicOnly>
                <FooterCTA  />
              </PublicOnly>
            </NotificationProvider>
          </AuthProvider>
          <Analytics/>
        </QueryProvider>
      </body>
    </html>
  );
}
