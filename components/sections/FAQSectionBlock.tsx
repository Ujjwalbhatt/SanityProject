// FAQ Section React component — used by the page builder renderer
"use client";

import FAQAccordion from "@/components/ui/FAQAccordion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FAQSectionBlock({ data }: { data: any }) {
    const { heading, subheading, faqItems = [] } = data;

    if (!faqItems.length) return null;

    return (
        <section className="py-28 bg-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">FAQ</p>
                    {heading && <h2 className="text-4xl font-bold text-gray-900">{heading}</h2>}
                    {subheading && <p className="mt-4 text-lg text-gray-500">{subheading}</p>}
                </div>
                <FAQAccordion items={faqItems} />
            </div>
        </section>
    );
}
