// Testimonials Section React component — used by the page builder renderer

import Image from "next/image";
import { imageUrl } from "@/sanity/lib/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TestimonialsSectionBlock({ data }: { data: any }) {
    const { heading, subheading, testimonials = [] } = data;

    if (!testimonials.length) return null;

    return (
        <section className="py-28 bg-gray-50">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Testimonials</p>
                    {heading && <h2 className="text-4xl font-bold text-gray-900">{heading}</h2>}
                    {subheading && <p className="mt-4 text-lg text-gray-500">{subheading}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {testimonials.map((t: any) => (
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
                                        {t.authorName?.charAt(0)}
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
