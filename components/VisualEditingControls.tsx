// components/VisualEditingControls.tsx
//
// Renders a draft mode indicator banner at the top of the page during live preview.
// Shows the marketer they are in preview mode and lets them exit.

"use client";

import { useEffect, useState } from "react";

export default function VisualEditingControls() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between bg-violet-600 px-4 py-2 text-sm text-white shadow-lg">
            <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <strong>Live Preview</strong> — changes appear instantly, even before publishing
            </span>
            <a
                href={`/api/draft-mode/disable?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="rounded-lg bg-white/20 px-3 py-1 font-medium hover:bg-white/30 transition-colors"
            >
                Exit Preview
            </a>
        </div>
    );
}
