// app/api/promote/route.ts
//
// Copies a document from STAGING → PRODUCTION, including image assets.
// Sanity stores image FILES separately from documents — we must download from
// staging CDN and re-upload to production. Copying the asset document alone
// would leave the file missing (404).

import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const API_TOKEN = process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN;
const STAGING_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "staging";
const PROD_DATASET = process.env.SANITY_PRODUCTION_DATASET || "production";
const API_VERSION = "2024-01-01";
const ASSETS_API = "2024-06-24";

function queryUrl(dataset: string, documentId: string): string {
  const query = `*[_id == $id][0]`;
  const params = `$id=${encodeURIComponent(JSON.stringify(documentId))}`;
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}&${params}`;
}

function mutateUrl(dataset: string): string {
  return `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`;
}

function assetsUploadUrl(dataset: string): string {
  return `https://${PROJECT_ID}.api.sanity.io/v${ASSETS_API}/assets/images/${dataset}`;
}

/** Collect all _ref IDs from an object */
function collectRefs(obj: unknown, refs: Set<string>): void {
  if (obj == null || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectRefs(item, refs));
    return;
  }
  const rec = obj as Record<string, unknown>;
  if (typeof rec._ref === "string") refs.add(rec._ref);
  Object.values(rec).forEach((v) => collectRefs(v, refs));
}

/** Replace _ref values in an object using the mapping */
function replaceRefs(obj: unknown, mapping: Map<string, string>): unknown {
  if (obj == null) return obj;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => replaceRefs(item, mapping));
  const rec = obj as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rec)) {
    if (k === "_ref" && typeof v === "string" && mapping.has(v)) {
      result[k] = mapping.get(v)!;
    } else {
      result[k] = replaceRefs(v, mapping);
    }
  }
  return result;
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

async function uploadImageToProduction(
  imageBuffer: ArrayBuffer,
  mimeType: string,
  filename: string,
): Promise<string> {
  const url = `${assetsUploadUrl(PROD_DATASET)}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mimeType,
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: imageBuffer,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upload image to production: ${err}`);
  }
  const { document } = await res.json();
  return document._id;
}

/** For image assets: download from staging, upload to production, return new _id */
async function migrateImageAsset(
  oldId: string,
  refMapping: Map<string, string>,
): Promise<string> {
  if (refMapping.has(oldId)) return refMapping.get(oldId)!;

  const assetDoc = await fetchDoc(STAGING_DATASET, oldId);
  if (!assetDoc || assetDoc._type !== "sanity.imageAsset") {
    return oldId; // Not an image asset, will copy doc as-is
  }

  const url = assetDoc.url as string;
  if (!url) {
    console.warn(`[promote] Asset ${oldId} has no url, skipping`);
    return oldId;
  }

  const imageRes = await fetch(url);
  if (!imageRes.ok) {
    throw new Error(`Failed to fetch image from staging: ${imageRes.statusText}`);
  }

  const buffer = await imageRes.arrayBuffer();
  const mimeType = (assetDoc.mimeType as string) || imageRes.headers.get("content-type") || "image/jpeg";
  const ext = (assetDoc.extension as string) || mimeType.split("/")[1] || "jpg";
  const filename = (assetDoc.originalFilename as string) || `image.${ext}`;

  const newId = await uploadImageToProduction(buffer, mimeType, filename);
  refMapping.set(oldId, newId);
  return newId;
}

async function writeDoc(
  dataset: string,
  doc: Record<string, unknown>,
  refMapping: Map<string, string>,
): Promise<void> {
  const transformed = replaceRefs(doc, refMapping) as Record<string, unknown>;
  const id = transformed._id as string;
  const url = mutateUrl(dataset);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: { ...transformed, _id: id } }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to write "${id}" to production: ${errText}`);
  }
}

/** Recursively migrate a document and its refs to production */
async function ensureInProduction(
  id: string,
  copied: Set<string>,
  refMapping: Map<string, string>,
): Promise<void> {
  if (copied.has(id)) return;

  // Image assets: download + upload (don't copy the doc — upload creates it)
  if (id.startsWith("image-")) {
    await migrateImageAsset(id, refMapping);
    copied.add(id);
    return;
  }

  // File assets: similar handling if needed (simplified — skip for now)
  if (id.startsWith("file-")) {
    copied.add(id);
    return;
  }

  const doc = await fetchDoc(STAGING_DATASET, id);
  if (!doc) return;

  const refs = new Set<string>();
  collectRefs(doc, refs);

  // Migrate dependencies first (including image assets)
  for (const refId of refs) {
    if (refId !== id) await ensureInProduction(refId, copied, refMapping);
  }

  await writeDoc(PROD_DATASET, doc, refMapping);
  copied.add(id);
}

export async function POST(req: NextRequest) {
  try {
    if (!API_TOKEN) {
      return NextResponse.json(
        { error: "Missing SANITY_API_TOKEN or SANITY_API_READ_TOKEN — add in Vercel env vars" },
        { status: 500 }
      );
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    const id = String(documentId).startsWith("drafts.")
      ? String(documentId).slice(7)
      : String(documentId);

    const doc = await fetchDoc(STAGING_DATASET, id);
    if (!doc) {
      return NextResponse.json(
        { error: `Document "${id}" not found in staging. Publish it first.` },
        { status: 404 }
      );
    }

    const copied = new Set<string>();
    const refMapping = new Map<string, string>();

    const refs = new Set<string>();
    collectRefs(doc, refs);
    for (const refId of refs) {
      await ensureInProduction(refId, copied, refMapping);
    }
    await ensureInProduction(id, copied, refMapping);

    return NextResponse.json({
      success: true,
      message: `Document "${id}" promoted to production${refMapping.size ? ` (${refMapping.size} image(s) migrated)` : ""}!`,
      result: { documentsPromoted: copied.size, imagesMigrated: refMapping.size },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Promote API Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
