const STEPS = [
  { title: 'Choose your content type', text: 'Pick Image, Link or Text depending on what the code should open or show.' },
  { title: 'Enter content and customize', text: 'Add your content, then tune colors, style, margin and an optional logo. The preview updates as you go.' },
  { title: 'Download and share', text: 'Export a PNG, SVG or print-ready PNG, then test-scan it before you publish or print.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-16 border-y border-line bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 id="how-title" className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">How it works</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nova-600 text-sm font-bold text-white" aria-hidden>{i + 1}</span>
              <div>
                <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
