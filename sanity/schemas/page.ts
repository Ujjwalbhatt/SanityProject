// Page schema — the page builder document type
//
// Marketers create "pages" in Studio by stacking sections together.
// Each section type corresponds to a React component in the frontend.
// Sanity automatically adds drag-and-drop handles to reorder sections.

import { defineType, defineField } from "sanity";

export const pageSchema = defineType({
    name: "page",
    title: "Pages",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Page Title",
            type: "string",
            description: "For internal reference only (e.g. 'Summer Campaign Landing Page')",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "URL Slug",
            type: "slug",
            description: "The URL path for this page (e.g. 'summer-campaign' → /pages/summer-campaign)",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "seoTitle",
            title: "SEO Title",
            type: "string",
            description: "Browser tab title. Defaults to Page Title if left blank.",
        }),
        defineField({
            name: "seoDescription",
            title: "SEO Description",
            type: "text",
            rows: 2,
            description: "Meta description shown in Google search results.",
        }),
        defineField({
            name: "sections",
            title: "Page Sections",
            description: "Drag to reorder. Click + to add a new section.",
            type: "array",
            of: [
                { type: "heroSection" },
                { type: "featuresSection" },
                { type: "testimonialsSection" },
                { type: "pricingSection" },
                { type: "faqSection" },
                { type: "ctaSection" },
            ],
        }),
    ],
    preview: {
        select: { title: "title", slug: "slug.current" },
        prepare({ title, slug }) {
            return {
                title,
                subtitle: slug ? `/pages/${slug}` : "No slug set",
            };
        },
    },
});
