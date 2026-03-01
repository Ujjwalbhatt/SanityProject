// app/layout.tsx — ROOT LAYOUT
//
// This is the only layout that renders <html> and <body>.
// It must be minimal — it wraps EVERY route including /studio.
//
// The nav/footer/max-width constraints live in app/(site)/layout.tsx
// which only applies to blog/home pages.
//
// The Studio at /studio inherits this root layout only,
// giving it a clean full-screen canvas.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "My Sanity Blog",
    // %s = page title → "Post Title | My Sanity Blog"
    template: "%s | My Sanity Blog",
  },
  description: "A blog built with Next.js and Sanity CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* No nav/footer/max-width here — those live in (site)/layout.tsx */}
      <body className="bg-white text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
