// sanity/lib/client.ts
// The Sanity client — how your Next.js app fetches data from Sanity.

import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "staging",
  apiVersion: "2024-01-01",
  useCdn: true,

  // stega: encodes invisible edit-source metadata into string values
  // during draft mode, enabling the clickable overlays in Presentation tool
  stega: {
    studioUrl: "/studio", // embedded studio path
  },
});
