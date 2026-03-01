// sanity/lib/client.ts
// The Sanity client — how your Next.js app fetches data from Sanity.

import { createClient } from "next-sanity";

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "staging";
// Bypass CDN on staging so published changes appear instantly in the visual editor.
// Production keeps CDN for faster loads for end users.
const useCdn = dataset === "production";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset,
  apiVersion: "2024-01-01",
  useCdn,

  // stega: encodes invisible edit-source metadata into string values
  // during draft mode, enabling the clickable overlays in Presentation tool
  stega: {
    studioUrl: "/studio", // embedded studio path
  },
});
