// app/studio/[[...tool]]/page.tsx
//
// ⚠️ STAGING ONLY — Studio is intentionally blocked on production.
// Marketers must always use the staging URL to edit content.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  const router = useRouter();
  const isProduction = process.env.NEXT_PUBLIC_SANITY_DATASET === "production";

  useEffect(() => {
    if (isProduction) router.replace("/");
  }, [isProduction, router]);

  if (isProduction) return null;

  return <NextStudio config={config} />;
}
