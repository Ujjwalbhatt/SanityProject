// GROQ query to fetch a full page document with all its sections
// Used by the /pages/[slug] route to render the page builder output

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    seoTitle,
    seoDescription,
    "slug": slug.current,
    sections[] {
      _type,
      _key,

      // Hero Section fields
      tagline,
      heading,
      headingHighlight,
      subheading,
      primaryCta,
      secondaryCta,
      "stats": stats[] { value, label },

      // Features Section fields
      "features": features[] {
        icon,
        title,
        description,
      },

      // Testimonials Section — fetches live testimonial docs
      ...,
      _type == "testimonialsSection" => {
        "testimonials": *[_type == "testimonial"] | order(_createdAt asc) {
          _id, quote, authorName, authorRole, authorCompany, rating, avatar
        }
      },

      // Pricing Section — fetches live pricing plan docs
      _type == "pricingSection" => {
        "plans": *[_type == "pricingPlan"] | order(order asc) {
          _id, name, price, billingPeriod, description, features, isHighlighted, badge, ctaText, ctaLink
        }
      },

      // FAQ Section — fetches live FAQ item docs
      _type == "faqSection" => {
        "faqItems": *[_type == "faqItem"] | order(order asc) {
          _id, question, answer
        }
      },
    }
  }
`;

// Query to get all page slugs (for static generation)
export const allPageSlugsQuery = `
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`;
