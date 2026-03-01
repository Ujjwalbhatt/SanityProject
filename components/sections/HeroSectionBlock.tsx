// Hero Section React component — used by the page builder renderer

import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSectionBlock({ data }: { data: any }) {
    const { tagline, headingBefore, heading, headingHighlight, subheading, primaryCta, secondaryCta, stats } = data;

    // Use separate fields for visual editing — no string split (preserves stega overlays)
    const before = headingBefore ?? heading?.split(headingHighlight || "")[0] ?? "";
    const highlight = headingHighlight ?? "";

    return (
        <section className="relative overflow-hidden bg-white pt-20 pb-28">
            <div className="pointer-events-none absolute inset-x-0 -top-40 overflow-hidden blur-3xl" aria-hidden>
                <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-violet-200 to-indigo-200 opacity-25" />
            </div>

            <div className="mx-auto max-w-4xl px-6 text-center">
                {tagline && (
                    <div className="mb-8 flex justify-center" data-sanity-edit-target>
                        <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-inset ring-violet-100">
                            {tagline}
                        </span>
                    </div>
                )}

                <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05]" data-sanity-edit-target>
                    {before}
                    {highlight && (
                        <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                            {highlight}
                        </span>
                    )}
                </h1>

                {subheading && (
                    <p className="mt-6 text-xl leading-8 text-gray-500 max-w-2xl mx-auto" data-sanity-edit-target>{subheading}</p>
                )}

                {(primaryCta?.label || secondaryCta?.label) && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {primaryCta?.label && (
                            <Link href={primaryCta.link || "#"} className="w-full sm:w-auto bg-violet-600 text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-500 transition-colors shadow-sm">
                                {primaryCta.label}
                            </Link>
                        )}
                        {secondaryCta?.label && (
                            <Link href={secondaryCta.link || "#"} className="w-full sm:w-auto text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
                                {secondaryCta.label} <span aria-hidden>→</span>
                            </Link>
                        )}
                    </div>
                )}

                {stats?.length > 0 && (
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
                        {stats.map((s: { value: string; label: string }) => (
                            <div key={s.value} className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                                <span>{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden blur-3xl" aria-hidden>
                <div className="relative left-1/2 aspect-[1155/678] w-[72rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-100 to-violet-100 opacity-20" />
            </div>
        </section>
    );
}
