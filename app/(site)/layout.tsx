// app/(site)/layout.tsx
// Wraps all site pages (home, blog, /pages/*) with Navbar and Footer.
// The Studio at /studio is OUTSIDE this route group — it won't get VisualEditing.
//
// Per Sanity docs: for embedded studios, VisualEditing must only be in
// the content layout, never in a parent layout of the studio route.

import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();

  return (
    <>
      <Navbar />
      <div>{children}</div>
      <Footer />

      {/* Visual Editing — only active during Presentation tool preview */}
      {isEnabled && (
        <>
          <VisualEditing />
          {/* Draft mode exit banner */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-violet-700 text-white text-sm px-5 py-2.5 rounded-full shadow-xl">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span><strong>Draft Preview</strong> — changes appear without publishing</span>
            <a
              href={`/api/draft-mode/disable`}
              className="ml-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-medium transition-colors"
            >
              Exit
            </a>
          </div>
        </>
      )}
    </>
  );
}
