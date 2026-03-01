// Logo Bar React component — "Trusted by" section

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LogoBarBlock({ data }: { data: any }) {
  const { label = "Trusted by teams at", logos = [] } = data ?? {};

  if (!logos?.length) return null;

  return (
    <section className="border-y border-gray-100 bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
          {label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {logos.map((name: string) => (
            <span
              key={name}
              className="text-gray-300 font-extrabold text-xl tracking-tight select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
