// CTA (Call to Action) Section schema
// Dark banner at the bottom of a page with a headline and buttons

import { defineType, defineField } from "sanity";

export const ctaSectionSchema = defineType({
    name: "ctaSection",
    title: "CTA Section",
    type: "object",
    fields: [
        defineField({
            name: "headingBefore",
            title: "Heading (before highlight)",
            type: "string",
            description: "e.g. 'Ready to ship' — separately editable in visual editing",
            initialValue: "Ready to ship",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "headingHighlight",
            title: "Heading (highlighted part)",
            type: "string",
            description: "e.g. '10× faster?' — shown in gradient, separately editable",
            initialValue: "10× faster?",
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "string",
        }),
        defineField({
            name: "primaryCta",
            title: "Primary Button",
            type: "object",
            fields: [
                { name: "label", type: "string", title: "Label" },
                { name: "link", type: "string", title: "Link" },
            ],
        }),
        defineField({
            name: "secondaryCta",
            title: "Secondary Button",
            type: "object",
            fields: [
                { name: "label", type: "string", title: "Label" },
                { name: "link", type: "string", title: "Link" },
            ],
        }),
    ],
    preview: {
        select: { before: "headingBefore", highlight: "headingHighlight" },
        prepare({ before, highlight }) {
            return { title: `🚀 CTA: ${(before || "") + (highlight ? ` ${highlight}` : "")}`.trim() || "Untitled" };
        },
    },
});
