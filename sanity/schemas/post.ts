// Blog Post schema — this defines what fields a blog post has
// Every field here becomes an input in the Sanity Studio editor

import { defineField, defineType } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      // Slug = the URL-friendly version e.g. "my-first-post"
      // In Webflow you'd set this in the CMS item settings
      type: "slug",
      options: {
        source: "title",        // auto-generate from title
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      // "reference" = a link to another document (like a CMS reference in Webflow)
      type: "reference",
      to: [{ type: "author" }], // can only reference author documents
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        // You can add extra fields inside an image (like alt text)
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",         // date + time picker in the Studio
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",             // short summary shown in blog listing
    }),

    defineField({
      name: "body",
      title: "Body",
      // "array" of "block" = Sanity's rich text (called Portable Text)
      // This replaces Webflow's Rich Text field
      // It's not stored as HTML — it's stored as structured data (JSON)
      // and you render it however you want using @portabletext/react
      type: "array",
      of: [
        {
          type: "block",        // standard text: paragraphs, headings, bold, italic, etc.
        },
        {
          type: "image",        // allows inline images inside the body
          options: { hotspot: true },
        },
      ],
    }),
  ],

  // Preview = what you see in the list view in Sanity Studio
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author ? `by ${author}` : "No author",
      };
    },
  },
});
