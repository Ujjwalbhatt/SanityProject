// app/api/draft-mode/enable/route.ts
//
// Enables Next.js Draft Mode when the marketer opens the Presentation tool.
// Uses next-sanity's defineEnableDraftMode which handles token validation
// and secure redirect — per official Sanity App Router visual editing guide.

import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

export const { GET } = defineEnableDraftMode({
    client: client.withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
    }),
});
