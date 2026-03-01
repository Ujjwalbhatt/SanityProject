// app/(site)/pages/[slug]/page.tsx
// Dynamic page renderer — reads a Sanity page document and renders
// whatever sections the marketer assembled in Studio.
//
// In draft mode (Presentation tool): fetches unpublished drafts with stega
// encoding so changes appear instantly and overlays work.

import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { draftClient } from "@/sanity/lib/draftClient";
import { pageBySlugQuery, allPageSlugsQuery } from "@/sanity/lib/pageQuery";
import SectionRenderer from "@/components/sections/SectionRenderer";


export async function generateStaticParams() {
    try {
        const pages = await client.fetch(allPageSlugsQuery);
        return pages.map((p: { slug: string }) => ({ slug: p.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await client.fetch(pageBySlugQuery, { slug });
    if (!page) return {};
    return {
        title: page.seoTitle || page.title,
        description: page.seoDescription,
    };
}

export default async function DynamicPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { isEnabled: isDraftMode } = await draftMode();

    let page = null;
    try {
        // Draft mode: use draftClient which has the API token + perspective:previewDrafts
        // The draftClient already has stega config — no need to pass it as a fetch option
        const sanityClient = isDraftMode ? draftClient : client;
        page = await sanityClient.fetch(pageBySlugQuery, { slug });
    } catch (err) {
        // Log so we can see what's going wrong in dev
        console.error("[pages/[slug]] Sanity fetch error:", err);
    }

    if (!page) {
        // In draft mode: while Sanity is saving a drag operation, the query
        // can momentarily return null. Show a loading state instead of 404
        // so the preview iframe stays on this URL and recovers automatically.
        if (isDraftMode) {
            return (
                <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
                    <div className="h-8 w-8 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                    <p className="text-sm">Saving changes…</p>
                </main>
            );
        }
        notFound();
    }

    return (
        <main>
            <SectionRenderer sections={page.sections} />
        </main>
    );
}
