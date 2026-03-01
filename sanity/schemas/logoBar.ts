// Logo Bar schema — "Trusted by" section with company logos/names
// Used globally on home page and can be reused

import { defineType, defineField } from "sanity";

export const logoBarSchema = defineType({
  name: "logoBar",
  title: "Logo Bar",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "e.g. 'Trusted by teams at'",
      initialValue: "Trusted by teams at",
    }),
    defineField({
      name: "logos",
      title: "Company Names / Logos",
      type: "array",
      of: [{ type: "string" }],
      description: "Company names shown in the logo bar (e.g. Stripe, Notion, Vercel)",
      initialValue: ["Stripe", "Notion", "Linear", "Vercel", "Figma", "Loom"],
    }),
  ],
  preview: {
    select: { label: "label" },
    prepare({ label }) {
      return { title: "Logo Bar", subtitle: label || "Trusted by..." };
    },
  },
});
