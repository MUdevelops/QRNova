import { useState } from 'react';
import QRCanvas from './QRCanvas';
import { DEFAULT_STYLE } from '../lib/types';
import { CAPACITY_BYTES } from '../lib/qr';
import { utf8Bytes } from '../lib/validation';

const DEMO_STYLE = { ...DEFAULT_STYLE, fg: '#4B2FCC', moduleStyle: 'rounded' as const };

export default function Hero() {
  const [demo, setDemo] = useState('Hello from QRNova');
  const tooLong = utf8Bytes(demo) > CAPACITY_BYTES.M;
  const data = demo.trim() && !tooLong ? demo : null;

  return (
    <section id="home" className="border-b border-line bg-gradient-to-b from-nova-50/60 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div>
          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
            Every Idea Deserves a QR Code.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Turn images, links, and text into custom QR codes in seconds. Free to use, simple to customize, and easy to download.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#generator" className="btn-primary">Create Your QR Code</a>
            <a href="#features" className="btn-secondary">Explore Features</a>
          </div>
          <p className="mt-6 text-sm text-ink-muted">Free. No account. Text and link codes are created in your browser.</p>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-3xl border border-line bg-white p-5 shadow-pop">
          <div className="rounded-2xl border border-line bg-white p-3">
            <QRCanvas data={data} style={DEMO_STYLE} label="Live demo QR code" className="mx-auto max-w-[260px]" />
            {!data && <p className="py-20 text-center text-sm text-ink-muted">Type something below to see it appear.</p>}
          </div>
          <label htmlFor="hero-demo" className="field-label mt-4">Try it: type anything</label>
          <input
            id="hero-demo"
            className="field"
            value={demo}
            maxLength={200}
            onChange={(e) => setDemo(e.target.value)}
            autoComplete="off"
          />
          <p className="hint">Scan it with your phone camera.</p>
        </div>
      </div>
    </section>
  );
}
