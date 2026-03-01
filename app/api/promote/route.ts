// app/api/promote/route.ts
//
// This API route copies a document from the STAGING dataset → PRODUCTION dataset.
// It is called by the custom "Promote to Production" button in Sanity Studio.

import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const API_TOKEN = process.env.SANITY_API_TOKEN!;
const STAGING_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "staging";
const PROD_DATASET = process.env.SANITY_PRODUCTION_DATASET || "production";
const API_VERSION = "2024-01-01";

export async function POST(req: NextRequest) {
    try {
        const { documentId } = await req.json();

        if (!documentId) {
            return NextResponse.json({ error: "documentId is required" }, { status: 400 });
        }

        // Step 1: Fetch the published document from staging
        const stagingUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${STAGING_DATASET}?query=*[_id=="${documentId}"][0]`;

        const stagingRes = await fetch(stagingUrl, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        if (!stagingRes.ok) {
            throw new Error(`Failed to fetch from staging: ${stagingRes.statusText}`);
        }

        const { result: doc } = await stagingRes.json();

        if (!doc) {
            return NextResponse.json(
                { error: `Document "${documentId}" not found in staging. Make sure it's published first.` },
                { status: 404 }
            );
        }

        // Step 2: Write the document to production using Sanity's Mutations API
        const prodUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${PROD_DATASET}`;

        const prodRes = await fetch(prodUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify({
                mutations: [
                    {
                        // createOrReplace upserts — creates if new, replaces if already exists
                        createOrReplace: {
                            ...doc,
                            _id: documentId, // keep the same ID in production
                        },
                    },
                ],
            }),
        });

        if (!prodRes.ok) {
            const errText = await prodRes.text();
            throw new Error(`Failed to write to production: ${errText}`);
        }

        const result = await prodRes.json();

        return NextResponse.json({
            success: true,
            message: `Document "${documentId}" promoted to production successfully!`,
            result,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[Promote API Error]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
