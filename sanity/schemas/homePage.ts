// Home page singleton — enables Presentation tool to navigate to /
// The actual home content comes from testimonials, pricing, FAQ, etc.

import { defineType, defineField } from "sanity";

export const homePageSchema = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Home page content comes from testimonials, pricing, FAQ, and blog posts. Use the Presentation tool to preview.",
      readOnly: true,
      initialValue: "Edit testimonials, pricing, and FAQ in their respective sections.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page", subtitle: "/" }),
  },
});
