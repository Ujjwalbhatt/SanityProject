// SCHEMA = the shape/definition of a content type in Sanity
// Think of this like defining a CMS collection in Webflow, but in code.

import { defineField, defineType } from "sanity";

export const authorSchema = defineType({
  // Internal name used in code and queries
  name: "author",

  // What editors see in the Sanity Studio
  title: "Author",

  // "document" means it's a top-level content item (like a CMS item in Webflow)
  type: "document",

  // Fields = the columns/properties of this content type
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",           // plain text
      validation: (Rule) => Rule.required(),  // make it required
    }),

    defineField({
      name: "slug",
      title: "Slug",
      // "slug" type auto-generates a URL-friendly version of another field
      type: "slug",
      options: {
        source: "name",         // auto-generate from the name field
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",            // Sanity's built-in image type (handles uploads)
      options: {
        hotspot: true,          // allows editors to pick a focal point for cropping
      },
    }),

    defineField({
      name: "bio",
      title: "Bio",
      type: "text",             // multi-line plain text (vs "string" = single line)
    }),
  ],
});
