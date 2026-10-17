import { Download, MonitorSmartphone, Palette, QrCode, ShieldCheck, UserX } from 'lucide-react';

const ITEMS = [
  { icon: QrCode, title: 'Three ways to create', text: 'Turn an image, a website link, or plain text into a QR code from one workspace.' },
  { icon: Palette, title: 'Colors and styles', text: 'Pick colors or a palette, switch between square, rounded and dot modules, adjust margin and error correction, and add a center logo.' },
  { icon: Download, title: 'High-resolution downloads', text: 'Export PNG, SVG, or a 3000 px PNG for print. Copy the image straight to your clipboard in browsers that allow it.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Link and text codes are generated entirely in your browser. Only images are uploaded, and only when you ask for an image code.' },
  { icon: UserX, title: 'No account needed', text: 'Open the page and start. There is no sign-up, no paywall and no watermark.' },
  { icon: MonitorSmartphone, title: 'Works on every screen', text: 'The layout adapts from phones to desktops, with touch-friendly controls and keyboard support.' },
];

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-16 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2 id="features-title" className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">Everything you need, nothing you don't</h2>
        <dl className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((f) => (
            <div key={f.title} className="border-t border-line pt-5">
              <dt className="flex items-center gap-3 text-base font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-nova-50 text-nova-600"><f.icon size={18} /></span>
                {f.title}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-soft">{f.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
