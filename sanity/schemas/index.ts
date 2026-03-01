// This file collects all schemas and exports them as an array.
// Sanity uses this array to know which content types exist.
// Every new schema you create must be added here.

import { authorSchema } from "./author";
import { postSchema } from "./post";
import { testimonialSchema } from "./testimonial";
import { pricingPlanSchema } from "./pricingPlan";
import { faqItemSchema } from "./faqItem";
import { homePageSchema } from "./homePage";
import { blogPageSchema } from "./blogPage";
import { siteSettingsSchema } from "./siteSettings";
import { logoBarSchema } from "./logoBar";

// Page builder schemas
import { pageSchema } from "./page";
import { heroSectionSchema } from "./sections/heroSection";
import { featuresSectionSchema } from "./sections/featuresSection";
import { testimonialsSectionSchema } from "./sections/testimonialsSection";
import { pricingSectionSchema } from "./sections/pricingSection";
import { faqSectionSchema } from "./sections/faqSection";
import { ctaSectionSchema } from "./sections/ctaSection";

export const schemaTypes = [
  // Content types
  postSchema,
  authorSchema,
  homePageSchema,
  blogPageSchema,
  siteSettingsSchema,
  logoBarSchema,
  testimonialSchema,
  pricingPlanSchema,
  faqItemSchema,

  // Page builder
  pageSchema,
  heroSectionSchema,
  featuresSectionSchema,
  testimonialsSectionSchema,
  pricingSectionSchema,
  faqSectionSchema,
  ctaSectionSchema,
];
