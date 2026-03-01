// Pricing Section React component — used by the page builder renderer

import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PricingSectionBlock({ data }: { data: any }) {
    const { heading, subheading, plans = [] } = data;

    if (!plans.length) return null;

    return (
        <section className="py-28 bg-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Pricing</p>
                    {heading && <h2 className="text-4xl font-bold text-gray-900">{heading}</h2>}
                    {subheading && <p className="mt-4 text-lg text-gray-500">{subheading}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {plans.map((plan: any) => (
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
                                    {plan.features.map((feature: string) => (
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
