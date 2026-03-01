// app/api/promote/route.ts
//
// This API route copies a document from the STAGING dataset → PRODUCTION dataset.
// It also copies all referenced documents (images, authors, etc.) so promotion works
// for posts with main images, author avatars, inline images, etc.

import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
// Use SANITY_API_TOKEN (read+write) or fall back to SANITY_API_READ_TOKEN
const API_TOKEN = process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN;
const STAGING_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "staging";
const PROD_DATASET = process.env.SANITY_PRODUCTION_DATASET || "production";
const API_VERSION = "2024-01-01";

function queryUrl(dataset: string, documentId: string): string {
  // Use parameterized query to safely pass document ID (handles special chars)
  const query = `*[_id == $id][0]`;
  const params = `$id=${encodeURIComponent(JSON.stringify(documentId))}`;
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}&${params}`;
}

function mutateUrl(dataset: string): string {
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`;
}

/** Recursively collect all _ref document IDs from an object */
function collectRefs(obj: unknown, refs: Set<string>): void {
  if (obj == null) return;
  if (typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    obj.forEach((item) => collectRefs(item, refs));
    return;
  }

  const rec = obj as Record<string, unknown>;
  if (typeof rec._ref === "string") {
    refs.add(rec._ref);
  }
  Object.values(rec).forEach((v) => collectRefs(v, refs));
}

async function fetchDoc(dataset: string, id: string): Promise<Record<string, unknown> | null> {
  const url = queryUrl(dataset, id);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) return null;
  const { result } = await res.json();
  return result;
}

async function writeDoc(dataset: string, doc: Record<string, unknown>): Promise<void> {
  const id = doc._id as string;
  const url = mutateUrl(dataset);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: { ...doc, _id: id } }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to write "${id}" to ${dataset}: ${errText}`);
  }
}

/** Recursively ensure a document and all its references exist in production */
async function ensureInProduction(
  id: string,
  copied: Set<string>,
): Promise<void> {
  if (copied.has(id)) return;

  const doc = await fetchDoc(STAGING_DATASET, id);
  if (!doc) {
    // Ref might point to something that doesn't exist — skip
    return;
  }

  const refs = new Set<string>();
  collectRefs(doc, refs);

  // Copy dependencies first
  for (const refId of refs) {
    if (refId !== id) {
      await ensureInProduction(refId, copied);
    }
  }

  await writeDoc(PROD_DATASET, doc);
  copied.add(id);
}

export async function POST(req: NextRequest) {
  try {
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: "Missing SANITY_API_TOKEN or SANITY_API_READ_TOKEN — add one in Vercel env vars" },
        { status: 500 }
      );
    }

    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    // Normalize ID — Sanity can pass "drafts.xxx" or "xxx", we need the published id
    const id = String(documentId).startsWith("drafts.")
      ? String(documentId).slice(7)
      : String(documentId);

    const doc = await fetchDoc(STAGING_DATASET, id);
    if (!doc) {
      return NextResponse.json(
        { error: `Document "${id}" not found in staging. Make sure it's published first.` },
        { status: 404 }
      );
    }

    const copied = new Set<string>();

    // Copy all referenced documents (images, authors, etc.) to production first
    const refs = new Set<string>();
    collectRefs(doc, refs);
    for (const refId of refs) {
      await ensureInProduction(refId, copied);
    }

    // Copy the main document
    await ensureInProduction(id, copied);

    return NextResponse.json({
      success: true,
      message: `Document "${id}" and ${copied.size} referenced document(s) promoted to production!`,
      result: { documentsPromoted: copied.size },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Promote API Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
