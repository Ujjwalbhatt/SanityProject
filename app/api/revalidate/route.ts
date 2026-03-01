// app/api/revalidate/route.ts
//
// Sanity webhook → instant cache invalidation when you publish.
// Add a webhook in sanity.io/manage pointing to: https://YOUR_SITE_URL/api/revalidate

import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string; slug?: string };

// Document types that affect the home page
const HOME_PAGE_TYPES = ["siteSettings", "homePage", "testimonial", "pricingPlan", "faqItem"];

// Document types that affect the blog
const BLOG_TYPES = ["post", "blogPage", "author"];

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      console.warn("[revalidate] SANITY_REVALIDATE_SECRET not set — webhook will reject");
      return NextResponse.json(
        { error: "Missing SANITY_REVALIDATE_SECRET" },
        { status: 500 }
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ error: "Missing _type in body" }, { status: 400 });
    }

    const paths: string[] = [];

    if (HOME_PAGE_TYPES.includes(body._type)) {
      paths.push("/");
    }

    if (BLOG_TYPES.includes(body._type)) {
      paths.push("/blog");
      if (body._type === "post" && body.slug) {
        paths.push(`/blog/${body.slug}`);
      }
    }

    // Revalidate all affected paths
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 }
    );
  }
}
