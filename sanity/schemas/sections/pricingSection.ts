// Pricing Section schema
// Pulls from existing pricingPlan documents — marketer just sets the heading

import { defineType, defineField } from "sanity";

export const pricingSectionSchema = defineType({
    name: "pricingSection",
    title: "Pricing Section",
    type: "object",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            initialValue: "Simple, transparent pricing",
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "string",
            initialValue: "No hidden fees. No surprises. Cancel anytime.",
        }),
    ],
    preview: {
        select: { title: "heading" },
        prepare({ title }) {
            return { title: `💰 Pricing: ${title || "Untitled"}` };
        },
    },
});
