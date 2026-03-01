// components/sections/SectionRenderer.tsx
//
// This is the heart of the page builder — it maps each Sanity section _type
// to its corresponding React component. When a marketer adds a section in Studio,
// this component knows which React component to render for it.

import HeroSectionBlock from "./HeroSectionBlock";
import FeaturesSectionBlock from "./FeaturesSectionBlock";
import TestimonialsSectionBlock from "./TestimonialsSectionBlock";
import PricingSectionBlock from "./PricingSectionBlock";
import FAQSectionBlock from "./FAQSectionBlock";
import CTASectionBlock from "./CTASectionBlock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SectionRenderer({ sections }: { sections: any[] }) {
    if (!sections?.length) return null;

    return (
        <>
            {sections.map((section) => {
                const key = section._key || section._type;
                switch (section._type) {
                    case "heroSection":
                        return <HeroSectionBlock key={key} data={section} />;
                    case "featuresSection":
                        return <FeaturesSectionBlock key={key} data={section} />;
                    case "testimonialsSection":
                        return <TestimonialsSectionBlock key={key} data={section} />;
                    case "pricingSection":
                        return <PricingSectionBlock key={key} data={section} />;
                    case "faqSection":
                        return <FAQSectionBlock key={key} data={section} />;
                    case "ctaSection":
                        return <CTASectionBlock key={key} data={section} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
