import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Is QRNova free?', a: 'Yes. Creating and downloading QR codes costs nothing, and there are no watermarks.' },
  { q: 'Can I generate QR codes without signing up?', a: 'Yes. There are no accounts. Open the page, create your code, and download it.' },
  { q: 'Can I customize QR colors?', a: 'Yes. Choose a palette or set exact foreground and background colors, pick square, rounded or dot modules, change the margin and error correction, and add a center logo. QRNova warns you when contrast is too low to scan reliably, but no customized code is guaranteed to scan on every device, so test it first.' },
  { q: 'Can I download QR codes as PNG or SVG?', a: 'Yes. You can download a 1024 px PNG, a scalable SVG, or a 3000 px PNG for print.' },
  { q: 'Can I convert an image into a QR code?', a: 'Yes, with a small catch. A QR code can only hold a short piece of data, not a whole picture. So QRNova uploads your image to its hosting and puts the image\'s public link in the code. Scanning it opens the image. This needs image hosting to be enabled on the site you are using.' },
  { q: 'Do generated QR codes expire?', a: 'No. Codes made from links or text are static, so they keep working as long as the destination does. Image codes depend on the hosted image staying online. If it is removed, the code will stop opening it.' },
  { q: 'Is my data stored?', a: 'Links and text are turned into QR codes in your browser and are not sent to a server. Your center logo also stays in your browser. Only images you choose to turn into a code are uploaded and stored, and anyone with the link can view them. Like any website, the hosting provider may keep standard technical logs.' },
  { q: 'Are these QR codes dynamic or static?', a: 'Static. The destination is written directly into the code, so it cannot be edited after you print it, and QRNova does not track scans.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 id="faq-title" className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Frequently asked questions</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink hover:text-nova-700"
                  >
                    {f.q}
                    <ChevronDown size={20} className={`shrink-0 text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} hidden={!isOpen}>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
