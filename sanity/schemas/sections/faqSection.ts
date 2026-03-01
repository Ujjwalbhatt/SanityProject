// FAQ Section schema
// Pulls from existing faqItem documents — marketer just sets the heading

import { defineType, defineField } from "sanity";

export const faqSectionSchema = defineType({
    name: "faqSection",
    title: "FAQ Section",
    type: "object",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            initialValue: "Frequently asked questions",
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "string",
            initialValue: "Can't find the answer? Chat with us.",
        }),
    ],
    preview: {
        select: { title: "heading" },
        prepare({ title }) {
            return { title: `❓ FAQ: ${title || "Untitled"}` };
        },
    },
});
