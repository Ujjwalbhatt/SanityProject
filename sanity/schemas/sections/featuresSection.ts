// Features Section schema — a grid of feature cards
// Marketer can set the heading and each feature card's title + description

import { defineType, defineField } from "sanity";

export const featuresSectionSchema = defineType({
    name: "featuresSection",
    title: "Features Section",
    type: "object",
    fields: [
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
            initialValue: "Everything you need to ship",
        }),
        defineField({
            name: "subheading",
            title: "Subheading",
            type: "text",
            rows: 2,
        }),
        defineField({
            name: "features",
            title: "Feature Cards",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "icon",
                            title: "Icon",
                            type: "string",
                            description: "Emoji icon (e.g. ⚡, 🔒, 📊, 🌐)",
                        },
                        {
                            name: "title",
                            title: "Title",
                            type: "string",
                        },
                        {
                            name: "description",
                            title: "Description",
                            type: "text",
                            rows: 2,
                        },
                    ],
                    preview: {
                        select: { title: "title", subtitle: "description", icon: "icon" },
                        prepare({ title, subtitle, icon }) {
                            return { title: `${icon || "✦"} ${title}`, subtitle };
                        },
                    },
                },
            ],
        }),
    ],
    preview: {
        select: { title: "heading" },
        prepare({ title }) {
            return { title: `✦ Features: ${title || "Untitled"}` };
        },
    },
});
