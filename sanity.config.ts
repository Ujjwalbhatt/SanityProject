// sanity.config.ts — configures the Sanity Studio

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { schemaTypes } from "./sanity/schemas";
import { PromoteToProductionAction } from "./sanity/actions/promoteAction";

export default defineConfig({
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Global Components")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings"))
              .icon(() => "🔧"),
            S.divider(),
            S.listItem()
              .title("Home Page")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("Blog")
              .child(S.document().schemaType("blogPage").documentId("blogPage")),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !["homePage", "blogPage", "siteSettings", "logoBar"].includes(item.getId() ?? "")
            ),
          ]),
    }),

    // Presentation Tool — live preview split-screen inside Studio
    presentationTool({
      resolve: {
        // Main documents: which document to show when navigating to a route
        mainDocuments: defineDocuments([
          { route: "/", filter: `_id == "siteSettings"` },
          { route: "/blog", filter: `_id == "blogPage"` },
          { route: "/pages/:slug", filter: `_type == "page" && slug.current == $slug` },
          { route: "/blog/:slug", filter: `_type == "post" && slug.current == $slug` },
        ]),
        locations: {
          homePage: {
            select: {},
            resolve: () => ({
              locations: [{ title: "Home", href: "/" }],
            }),
          },
          blogPage: {
            select: {},
            resolve: () => ({
              locations: [{ title: "Blog", href: "/blog" }],
            }),
          },
          siteSettings: {
            select: {},
            resolve: () => ({
              locations: [{ title: "Home", href: "/" }],
            }),
          },
          // page builder documents → /pages/[slug]
          page: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc: { title?: string; slug?: string } | null) =>
              doc?.slug
                ? {
                  locations: [
                    { title: doc.title ?? "Untitled", href: `/pages/${doc.slug}` },
                  ],
                }
                : null,
          },
          // blog post documents → /blog/[slug] and blog index
          post: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc: { title?: string; slug?: string } | null) =>
              doc?.slug
                ? {
                  locations: [
                    { title: doc.title ?? "Post", href: `/blog/${doc.slug}` },
                    { title: "Blog", href: "/blog" },
                  ],
                }
                : null,
          },
        },
      },
      previewUrl: {
        origin:
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: (prev: any[]) => [...prev, PromoteToProductionAction],
  },
});
