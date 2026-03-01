// Features Section React component — used by the page builder renderer

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FeaturesSectionBlock({ data }: { data: any }) {
    const { heading, subheading, features } = data;

    return (
        <section id="features" className="py-28 bg-white">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Features</p>
                    {heading && <h2 className="text-4xl font-bold text-gray-900">{heading}</h2>}
                    {subheading && <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{subheading}</p>}
                </div>

                {features?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f: { icon?: string; title: string; description?: string }) => (
                            <div key={f.title} className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-violet-100 transition-all">
                                {f.icon && (
                                    <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center mb-5 text-2xl group-hover:bg-violet-100 transition-colors">
                                        {f.icon}
                                    </div>
                                )}
                                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                                {f.description && <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
