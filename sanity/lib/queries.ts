import { groq } from "next-sanity";

// ─── Site Settings (Global Components) ───────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    hero { tagline, headingBefore, headingHighlight, subheading, primaryCta, secondaryCta, stats },
    logoBar { label, logos },
    features { heading, subheading, features },
    cta { headingBefore, headingHighlight, subheading, primaryCta, secondaryCta }
  }
`;

// ─── Blog Posts ────────────────────────────────────────────────────────────

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "author": author->{ name, image }
  }
`;

export const recentPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [0...3] {
    _id, title, slug, publishedAt, excerpt, mainImage,
    "author": author->{ name, image }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, excerpt, mainImage, body,
    "author": author->{ name, image, bio }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// ─── Testimonials ──────────────────────────────────────────────────────────

export const testimonialsQuery = groq`
  *[_type == "testimonial"] {
    _id, quote, authorName, authorRole, authorCompany, avatar, rating
  }
`;

// ─── Pricing Plans ─────────────────────────────────────────────────────────

export const pricingPlansQuery = groq`
  *[_type == "pricingPlan"] | order(order asc) {
    _id, name, price, billingPeriod, badge, description,
    features, isHighlighted, ctaText, ctaLink
  }
`;

// ─── FAQ Items ─────────────────────────────────────────────────────────────

export const faqItemsQuery = groq`
  *[_type == "faqItem"] | order(order asc) {
    _id, question, answer
  }
`;
