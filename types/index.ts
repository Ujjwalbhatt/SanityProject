// ─── Sanity base types ─────────────────────────────────────────────────────

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
  alt?: string;
};

export type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

// ─── Content types ─────────────────────────────────────────────────────────

export type Author = {
  name: string;
  image?: SanityImage;
  bio?: string;
};

export type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImage;
  author?: Author;
  body?: PortableTextBlock[];
};

export type Testimonial = {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  avatar?: SanityImage;
  rating?: number;
};

export type PricingPlan = {
  _id: string;
  name: string;
  price: string;
  billingPeriod?: string;
  badge?: string;
  description?: string;
  features?: string[];
  isHighlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
};

export type FAQItem = {
  _id: string;
  question: string;
  answer: string;
};
