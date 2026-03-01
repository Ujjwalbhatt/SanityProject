import { defineField, defineType } from "sanity";

export const pricingPlanSchema = defineType({
  name: "pricingPlan",
  title: "Pricing Plan",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Plan Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (e.g. 0, 29, Custom)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingPeriod",
      title: "Billing Period",
      type: "string",
      initialValue: "per month",
    }),
    defineField({
      name: "badge",
      title: "Badge Label (e.g. Most Popular)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
    }),
    defineField({
      name: "features",
      title: "Feature List",
      // Array of simple strings — each one is a bullet point
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isHighlighted",
      title: "Highlight this plan?",
      type: "boolean",
      description: "Shown with the accent color — use for your recommended plan",
      initialValue: false,
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      initialValue: "Get started",
    }),
    defineField({
      name: "ctaLink",
      title: "Button Link",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "price" },
    prepare({ title, subtitle }) {
      return { title, subtitle: `$${subtitle}` };
    },
  },
});
