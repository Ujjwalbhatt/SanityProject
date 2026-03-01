// sanity/actions/promoteAction.tsx
//
// This adds a "🚀 Promote to Production" button to every document in Sanity Studio.
// When clicked, it calls our /api/promote endpoint which copies the document
// from the staging dataset to the production dataset.
//
// Think of it like Webflow's "Publish to Production" button — same idea!

import { useState } from "react";
import { DocumentActionProps } from "sanity";

export function PromoteToProductionAction(props: DocumentActionProps) {
    const { id, published } = props;
    const [isPromoting, setIsPromoting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Only show this button if the document is already published to staging
    if (!published) {
        return null;
    }

    const handlePromote = async () => {
        setIsPromoting(true);
        try {
            const res = await fetch("/api/promote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentId: id }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(`❌ Promote failed: ${data.error}`);
            } else {
                alert(`✅ Successfully promoted to Production!`);
            }
        } catch (err) {
            alert(`❌ Network error: ${err}`);
        } finally {
            setIsPromoting(false);
            setDialogOpen(false);
        }
    };

    return {
        // Button label shown in Studio
        label: isPromoting ? "Promoting…" : "🚀 Promote to Production",

        // Tooltip on hover
        title: "Copy this published document from Staging → Production",

        // Disabled while promoting or if no published version exists
        disabled: isPromoting,

        // Show a confirmation dialog before promoting
        dialog: dialogOpen
            ? {
                type: "confirm" as const,
                tone: "critical" as const,
                message:
                    "This will copy the published version of this document to PRODUCTION. Are you sure?",
                onConfirm: handlePromote,
                onCancel: () => setDialogOpen(false),
            }
            : undefined,

        // Open the confirm dialog on click
        onHandle: () => setDialogOpen(true),

        // Style it differently so it stands out from the regular Publish button
        tone: "positive" as const,
    };
}
