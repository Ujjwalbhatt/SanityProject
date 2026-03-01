// Hero Section schema — the top banner of a page
// Marketer can set the headline, subheading, CTA buttons, and stats

import { defineType, defineField } from "sanity";

export const heroSectionSchema = defineType({
    name: "heroSection",
    title: "Hero Section",
    type: "object",
    fields: [
        defineField({
            name: "tagline",
            title: "Tagline (small badge text)",
            type: "string",
            description: 'e.g. "🎉 Introducing AI-powered insights"',
        }),
        defineField({
            name: "headingBefore",
            title: "Heading (before highlight)",
            type: "string",
            description: "e.g. 'Build and launch your' — each part is separately editable in visual editing",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "headingHighlight",
            title: "Heading (highlighted part)",
            type: "string",
            description: "e.g. 'SaaS faster' — shown in gradient color, separately editable",
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "text",
            rows: 2,
        }),
        defineField({
            name: "primaryCta",
            title: "Primary Button",
            type: "object",
            fields: [
                { name: "label", type: "string", title: "Label" },
                { name: "link", type: "string", title: "Link (e.g. #pricing or /contact)" },
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
        defineField({
            name: "stats",
            title: "Stats (e.g. 10k+ teams)",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "value", type: "string", title: "Value (e.g. 10k+)" },
                        { name: "label", type: "string", title: "Label (e.g. teams worldwide)" },
                    ],
                    preview: {
                        select: { title: "value", subtitle: "label" },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: { before: "headingBefore", highlight: "headingHighlight", subtitle: "subheading" },
        prepare({ before, highlight, subtitle }) {
            return { title: `🦸 Hero: ${before || ""}${highlight ? ` ${highlight}` : ""}`.trim() || "Untitled", subtitle };
        },
    },
});
