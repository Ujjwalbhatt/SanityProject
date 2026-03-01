// Blog page singleton — enables Presentation tool to navigate to /blog
// The actual content is the list of posts.

import { defineType, defineField } from "sanity";

export const blogPageSchema = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Blog page shows all posts. Use the Presentation tool to preview.",
      readOnly: true,
      initialValue: "Create and edit blog posts in the Posts section.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Blog", subtitle: "/blog" }),
  },
});
