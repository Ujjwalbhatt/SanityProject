// app/(site)/page.tsx — SaaS Landing Page
//
// Uses global components (Hero, CTA, Features, Logo Bar) from Site Settings — edit once, use everywhere.
// Testimonials, Pricing, FAQ come from their own document types.

import Link from "next/link";   
import Image from "next/image";
import type { Metadata } from "next"; 
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { draftClient } from "@/sanity/lib/draftClient";
import { siteSettingsQuery, testimonialsQuery, pricingPlansQuery, faqItemsQuery, recentPostsQuery } from "@/sanity/lib/queries";
import { imageUrl } from "@/sanity/lib/image";
import { Testimonial, PricingPlan, FAQItem, Post } from "@/types";
import FAQAccordion from "@/components/ui/FAQAccordion";
import HeroSectionBlock from "@/components/sections/HeroSectionBlock";
import LogoBarBlock from "@/components/sections/LogoBarBlock";
import FeaturesSectionBlock from "@/components/sections/FeaturesSectionBlock";
import CTASectionBlock from "@/components/sections/CTASectionBlock";

export const metadata: Metadata = {
  title: "SaaSify — Build and ship faster",
  description: "The all-in-one platform for modern teams.",
};

// Revalidate every 1 second so new content shows almost instantly
export const revalidate = 1;

// ─── Default global components (shown before Site Settings has content) ───────

const DEFAULT_HERO = {
  tagline: "🎉 Introducing AI-powered insights →",
  headingBefore: "Build and launch your",
  headingHighlight: "SaaS faster skjdhiasudhaiuh",
  subheading: "The all-in-one platform for modern teams. Plan, build, and ship products your customers love — from idea to production in days.",
  primaryCta: { label: "Get started for free", link: "#pricing" },
  secondaryCta: { label: "See how it works", link: "#features" },
  stats: [
    { value: "10k+", label: "teams worldwide" },
    { value: "99.99%", label: "uptime SLA" },
    { value: "4.9/5", label: "customer rating" },
  ],
};

const DEFAULT_LOGO_BAR = {
  label: "Trusted by teams at",
  logos: ["Stripe", "Notion", "Linear", "Vercel", "Figma", "Loom"],
};

const DEFAULT_FEATURES = {
  heading: "Everything you need to ship",
  subheading: "Stop stitching together tools that don't talk to each other. SaaSify has everything built-in.",
  features: [
    { icon: "⚡", title: "Lightning fast", description: "Sub-100ms response times globally. Your users will never wait — we handle all infrastructure optimization." },
    { icon: "💻", title: "Developer first", description: "Clean APIs, excellent docs, and SDKs for every major language. Integrate in hours, not weeks." },
    { icon: "📊", title: "Built-in analytics", description: "Real-time dashboards for user behavior, funnels, retention, and revenue — all in one place." },
    { icon: "🛡️", title: "Enterprise security", description: "SOC 2 Type II certified. End-to-end encryption, SSO, audit logs, and role-based access control." },
    { icon: "🌐", title: "Global CDN", description: "200+ edge locations worldwide. 99.99% uptime SLA backed by a financial guarantee." },
    { icon: "👥", title: "Team collaboration", description: "Comment, review, and ship together. Invite unlimited guests with granular permission controls." },
  ],
};

const DEFAULT_CTA = {
  headingBefore: "Ready to ship",
  headingHighlight: "10× faster?",
  subheading: "Join 10,000+ teams already using SaaSify. Start free — no credit card needed.",
  primaryCta: { label: "Get started for free", link: "#pricing" },
  secondaryCta: { label: "Read the blog", link: "/blog" },
};

// ─── Fallback sample data (shown before Sanity has content) ─────────────────

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { _id: "t1", quote: "SaaSify completely transformed how our team ships. We went from monthly releases to daily deployments within a week.", authorName: "Sarah Chen", authorRole: "CTO", authorCompany: "TechFlow", rating: 5 },
  { _id: "t2", quote: "The analytics alone are worth the subscription. We increased conversion by 40% since switching.", authorName: "Marcus Johnson", authorRole: "Head of Growth", authorCompany: "Growthly", rating: 5 },
  { _id: "t3", quote: "Setup took under 10 minutes. Documentation is outstanding and the support team is incredibly responsive.", authorName: "Emily Rodriguez", authorRole: "Founder", authorCompany: "LaunchPad Studio", rating: 5 },
];

const SAMPLE_PLANS: PricingPlan[] = [
  { _id: "p1", name: "Starter", price: "0", billingPeriod: "per month", description: "Perfect for side projects and small teams.", features: ["Up to 3 projects", "5 team members", "10 GB storage", "Basic analytics", "Community support"], isHighlighted: false, ctaText: "Get started free" },
  { _id: "p2", name: "Pro", price: "29", billingPeriod: "per month", badge: "Most Popular", description: "For growing teams that need more power.", features: ["Unlimited projects", "25 team members", "100 GB storage", "Advanced analytics", "Priority support", "Custom domains", "API access"], isHighlighted: true, ctaText: "Start free trial" },
  { _id: "p3", name: "Enterprise", price: "Custom", billingPeriod: "", description: "For large teams with advanced compliance needs.", features: ["Everything in Pro", "Unlimited members", "Unlimited storage", "Dedicated support", "SSO & SAML", "SLA guarantee", "Custom integrations"], isHighlighted: false, ctaText: "Contact sales" },
];

const SAMPLE_FAQ: FAQItem[] = [
  { _id: "f1", question: "How does the free plan work?", answer: "The free plan gives you full core features with some limits — up to 3 projects and 5 team members. No credit card required." },
  { _id: "f2", question: "Can I upgrade or downgrade at any time?", answer: "Yes. Upgrade anytime and pay the prorated amount. Downgrade and the change takes effect at the end of your billing cycle." },
  { _id: "f3", question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans — processed securely via Stripe." },
  { _id: "f4", question: "Is there a long-term contract?", answer: "No. All plans are month-to-month. Cancel anytime and keep access until the end of your billing period." },
  { _id: "f5", question: "Do you offer a trial period?", answer: "Yes — all paid plans include a 14-day free trial with full feature access. No credit card required." },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const sanityClient = isDraftMode ? draftClient : client;

  let siteSettings: { hero?: typeof DEFAULT_HERO; logoBar?: typeof DEFAULT_LOGO_BAR; features?: typeof DEFAULT_FEATURES; cta?: typeof DEFAULT_CTA } | null = null;
  let testimonials: Testimonial[] = [];
  let plans: PricingPlan[] = [];
  let faqItems: FAQItem[] = [];
  let recentPosts: Post[] = [];

  try {
    [siteSettings, testimonials, plans, faqItems, recentPosts] = await Promise.all([
      sanityClient.fetch(siteSettingsQuery),
      sanityClient.fetch(testimonialsQuery),
      sanityClient.fetch(pricingPlansQuery),
      sanityClient.fetch(faqItemsQuery),
      sanityClient.fetch(recentPostsQuery),
    ]);
  } catch {
    // Sanity not yet configured — fall back to defaults
  }

  if (!testimonials.length) testimonials = SAMPLE_TESTIMONIALS;
  if (!plans.length) plans = SAMPLE_PLANS;
  if (!faqItems.length) faqItems = SAMPLE_FAQ;

  const hero = siteSettings?.hero ?? DEFAULT_HERO;
  const logoBar = siteSettings?.logoBar ?? DEFAULT_LOGO_BAR;
  const features = siteSettings?.features ?? DEFAULT_FEATURES;
  const cta = siteSettings?.cta ?? DEFAULT_CTA;

  return (
    <main>
      <HeroSectionBlock data={hero} />
      <LogoBarBlock data={logoBar} />
      <FeaturesSectionBlock data={features} />
      <TestimonialsSection testimonials={testimonials} />
      <PricingSection plans={plans} />
      <BlogPreview posts={recentPosts} />
      <FAQSection faqItems={faqItems} />
      <CTASectionBlock data={cta} />
    </main>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-28 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-bold text-gray-900">Loved by teams worldwide</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                {t.avatar ? (
                  <Image src={imageUrl(t.avatar).width(40).height(40).url()} alt={t.authorName} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm shrink-0">
                    {t.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.authorName}</p>
                  {(t.authorRole || t.authorCompany) && (
                    <p className="text-xs text-gray-400">
                      {[t.authorRole, t.authorCompany].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function PricingSection({ plans }: { plans: PricingPlan[] }) {
  return (
    <section id="pricing" className="py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-gray-500">No hidden fees. No surprises. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div key={plan._id} className={`rounded-2xl p-8 relative ${plan.isHighlighted ? "bg-violet-600 shadow-xl shadow-violet-200 ring-2 ring-violet-600" : "bg-white border border-gray-200"}`}>
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <h3 className={`font-bold text-lg mb-2 ${plan.isHighlighted ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                {plan.price === "Custom"
                  ? <span className={`text-4xl font-bold ${plan.isHighlighted ? "text-white" : "text-gray-900"}`}>Custom</span>
                  : <>
                      <span className={`text-4xl font-bold ${plan.isHighlighted ? "text-white" : "text-gray-900"}`}>${plan.price}</span>
                      {plan.billingPeriod && <span className={`text-sm ${plan.isHighlighted ? "text-violet-200" : "text-gray-400"}`}>/{plan.billingPeriod}</span>}
                    </>
                }
              </div>
              {plan.description && <p className={`text-sm mb-6 ${plan.isHighlighted ? "text-violet-100" : "text-gray-500"}`}>{plan.description}</p>}
              <Link href={plan.ctaLink ?? "#"} className={`block text-center text-sm font-semibold py-3 px-6 rounded-xl transition-colors mb-8 ${plan.isHighlighted ? "bg-white text-violet-600 hover:bg-violet-50" : "bg-violet-600 text-white hover:bg-violet-500"}`}>
                {plan.ctaText ?? "Get started"}
              </Link>
              {plan.features && (
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <svg className={`w-5 h-5 shrink-0 mt-px ${plan.isHighlighted ? "text-violet-200" : "text-violet-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.isHighlighted ? "text-violet-100" : "text-gray-500"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog preview ────────────────────────────────────────────────────────────

function BlogPreview({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="py-28 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Blog</p>
            <h2 className="text-4xl font-bold text-gray-900">From the blog</h2>
          </div>
          <Link href="/blog" className="text-sm font-medium text-violet-600 hover:text-violet-500 shrink-0">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              {post.mainImage && (
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image src={imageUrl(post.mainImage).width(600).height(340).url()} alt={post.mainImage.alt || post.title} width={600} height={340} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-6">
                {post.publishedAt && <p className="text-xs text-gray-400 mb-2">{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>}
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQSection({ faqItems }: { faqItems: FAQItem[] }) {
  return (
    <section className="py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-gray-900">Frequently asked questions</h2>
          <p className="mt-4 text-lg text-gray-500">Can&apos;t find the answer? <a href="#" className="text-violet-600 hover:underline">Chat with us.</a></p>
        </div>
        <FAQAccordion items={faqItems} />
      </div>
    </section>
  );
}

