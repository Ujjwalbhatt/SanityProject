// CTA Section React component — used by the page builder renderer

import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CTASectionBlock({ data }: { data: any }) {
    const { headingBefore, heading, headingHighlight, subheading, primaryCta, secondaryCta } = data;

    // Use separate fields for visual editing — no string split (preserves stega overlays)
    const before = headingBefore ?? heading?.split(headingHighlight || "")[0] ?? "";
    const highlight = headingHighlight ?? "";

    return (
        <section className="py-28 bg-gray-950">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    {before}
                    {highlight && (
                        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            {highlight}
                        </span>
                    )}
                </h2>
                {subheading && <p className="text-lg text-gray-400 mb-10">{subheading}</p>}
                {(primaryCta?.label || secondaryCta?.label) && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {primaryCta?.label && (
                            <Link href={primaryCta.link || "#"} className="w-full sm:w-auto bg-violet-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-500 transition-colors">
                                {primaryCta.label}
                            </Link>
                        )}
                        {secondaryCta?.label && (
                            <Link href={secondaryCta.link || "#"} className="w-full sm:w-auto border border-gray-700 text-gray-300 font-semibold px-8 py-3.5 rounded-xl hover:border-gray-500 hover:text-white transition-colors">
                                {secondaryCta.label}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
