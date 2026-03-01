// Site Settings — global components edited in one place, used across the site
// Like Webflow's global/symbol components: Hero, CTA, Features, Logo Bar

import { defineType, defineField } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Global Components",
  type: "document",
  __experimental_omnisearch_visibility: false,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "logoBar", title: "Logo Bar" },
    { name: "features", title: "Features" },
    { name: "cta", title: "CTA" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "heroSection",
      description: "Global hero — used on home page and can be referenced elsewhere",
      group: "hero",
      initialValue: {
        tagline: "🎉 Introducing AI-powered insights →",
        headingBefore: "Build and launch your",
        headingHighlight: "SaaS faster",
        subheading: "The all-in-one platform for modern teams. Plan, build, and ship products your customers love.",
        primaryCta: { label: "Get started for free", link: "#pricing" },
        secondaryCta: { label: "See how it works", link: "#features" },
        stats: [
          { value: "10k+", label: "teams worldwide" },
          { value: "99.99%", label: "uptime SLA" },
          { value: "4.9/5", label: "customer rating" },
        ],
      },
    }),
    defineField({
      name: "logoBar",
      title: "Logo Bar",
      type: "logoBar",
      description: "Trusted by / company logos — appears below hero",
      group: "logoBar",
    }),
    defineField({
      name: "features",
      title: "Features Section",
      type: "featuresSection",
      description: "Feature cards grid — editable globally",
      group: "features",
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "ctaSection",
      description: "Call-to-action banner — used at bottom of home and other pages",
      group: "cta",
      initialValue: {
        headingBefore: "Ready to ship",
        headingHighlight: "10× faster?",
        subheading: "Join 10,000+ teams already using SaaSify. Start free — no credit card needed.",
        primaryCta: { label: "Get started for free", link: "#pricing" },
        secondaryCta: { label: "Read the blog", link: "/blog" },
      },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Global Components", subtitle: "Hero, CTA, Features, Logo Bar — edit once, use everywhere" }),
  },
});
