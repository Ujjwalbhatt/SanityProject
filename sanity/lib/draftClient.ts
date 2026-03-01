// sanity/lib/draftClient.ts
// Client for reading draft documents during Presentation tool preview.
// Requires SANITY_API_READ_TOKEN — without it drafts silently return null.

import { createClient } from "next-sanity";

if (!process.env.SANITY_API_READ_TOKEN) {
    console.warn("[draftClient] SANITY_API_READ_TOKEN is not set — draft fetches will return null");
}

export const draftClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "staging",
    apiVersion: "2024-01-01",
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: "drafts",   // previewDrafts was renamed to drafts
    // stega: encodes invisible edit-source metadata so clickable overlays work
    stega: {
        enabled: true,
        studioUrl: "/studio",
    },
});
