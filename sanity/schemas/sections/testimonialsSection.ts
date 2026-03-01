// Testimonials Section schema
// Pulls from existing testimonial documents — marketer just sets the heading

import { defineType, defineField } from "sanity";

export const testimonialsSectionSchema = defineType({
    name: "testimonialsSection",
    title: "Testimonials Section",
    type: "object",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            initialValue: "Loved by teams worldwide",
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "string",
        }),
    ],
    preview: {
        select: { title: "heading" },
        prepare({ title }) {
            return { title: `💬 Testimonials: ${title || "Untitled"}` };
        },
    },
});
