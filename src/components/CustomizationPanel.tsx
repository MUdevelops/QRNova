import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ImagePlus, RotateCcw, X } from 'lucide-react';
import type { EcLevel, ModuleStyle, QRStyle } from '../lib/types';
import { contrastRatio, isHex, luminance } from '../lib/contrast';
import { validateLogoFile } from '../lib/validation';

const PALETTES: { name: string; fg: string; bg: string }[] = [
  { name: 'Midnight', fg: '#0B1030', bg: '#FFFFFF' },
  { name: 'Nova', fg: '#4B2FCC', bg: '#FFFFFF' },
  { name: 'Ocean', fg: '#0C4A6E', bg: '#F0F9FF' },
  { name: 'Forest', fg: '#14532D', bg: '#F0FDF4' },
  { name: 'Ember', fg: '#9A3412', bg: '#FFF7ED' },
  { name: 'Graphite', fg: '#111827', bg: '#F3F4F6' },
];

const MODULES: { id: ModuleStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'dots', label: 'Dots' },
];

const EC: { id: EcLevel; label: string }[] = [
  { id: 'L', label: 'Low (7%)' },
  { id: 'M', label: 'Medium (15%)' },
  { id: 'Q', label: 'Quartile (25%)' },
  { id: 'H', label: 'High (30%)' },
];

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div>
      <label htmlFor={`${id}-hex`} className="field-label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={value.length === 4 ? `#${value.slice(1).split('').map((c) => c + c).join('')}` : value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-line bg-white p-1"
        />
        <input
          id={`${id}-hex`}
          className="field font-mono uppercase"
          value={draft}
          maxLength={7}
          spellCheck={false}
          onChange={(e) => {
            const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
            setDraft(v);
            if (isHex(v)) onChange(v.toUpperCase());
          }}
          onBlur={() => setDraft(value)}
          aria-invalid={!isHex(draft)}
        />
      </div>
    </div>
  );
}

interface Props {
  style: QRStyle;
  onChange: (patch: Partial<QRStyle>) => void;
  onReset: () => void;
}

export default function CustomizationPanel({ style, onChange, onReset }: Props) {
  const logoInput = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const ratio = contrastRatio(style.fg, style.bg);
  const inverted = luminance(style.fg) > luminance(style.bg);

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    const err = validateLogoFile(file);
    if (err) return setLogoError(err);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoError(null);
      onChange({ logo: String(reader.result) });
    };
    reader.onerror = () => setLogoError('The logo could not be read. Try another file.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">Customize</h3>
        <button type="button" className="btn-ghost" onClick={onReset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <fieldset className="mt-5">
        <legend className="field-label">Color palettes</legend>
        <div className="flex flex-wrap gap-2">
          {PALETTES.map((p) => {
            const active = p.fg === style.fg.toUpperCase() && p.bg === style.bg.toUpperCase();
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ fg: p.fg, bg: p.bg })}
                className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors ${active ? 'border-nova-500 bg-nova-50 text-nova-700' : 'border-line text-ink-soft hover:border-nova-200'}`}
              >
                <span className="h-5 w-5 rounded-full border border-black/10" style={{ background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)` }} aria-hidden />
                {p.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <ColorField id="fg" label="Foreground color" value={style.fg} onChange={(fg) => onChange({ fg })} />
        <ColorField id="bg" label="Background color" value={style.bg} onChange={(bg) => onChange({ bg })} />
      </div>

      <div className="mt-3 text-sm" aria-live="polite">
        {ratio < 2 ? (
          <p className="flex items-start gap-1.5 text-red-600"><AlertTriangle size={16} className="mt-0.5 shrink-0" />Contrast is too low ({ratio.toFixed(1)}:1). Downloads are paused until you pick a darker foreground or lighter background.</p>
        ) : ratio < 4.5 ? (
          <p className="flex items-start gap-1.5 text-amber-700"><AlertTriangle size={16} className="mt-0.5 shrink-0" />Contrast is {ratio.toFixed(1)}:1. Some cameras may struggle. Aim for 4.5:1 or more.</p>
        ) : (
          <p className="flex items-start gap-1.5 text-emerald-700"><CheckCircle2 size={16} className="mt-0.5 shrink-0" />Contrast {ratio.toFixed(1)}:1. Good for scanning.</p>
        )}
        {inverted && ratio >= 2 && (
          <p className="mt-1 flex items-start gap-1.5 text-amber-700"><AlertTriangle size={16} className="mt-0.5 shrink-0" />Light-on-dark codes aren't read by some scanner apps. Dark on light is safest.</p>
        )}
      </div>

      <fieldset className="mt-5">
        <legend className="field-label">Module style</legend>
        <div role="radiogroup" aria-label="Module style" className="grid grid-cols-3 gap-2">
          {MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={style.moduleStyle === m.id}
              onClick={() => onChange({ moduleStyle: m.id })}
              className={`min-h-[44px] rounded-xl border text-sm font-medium transition-colors ${style.moduleStyle === m.id ? 'border-nova-500 bg-nova-50 text-nova-700' : 'border-line text-ink-soft hover:border-nova-200'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="margin" className="field-label">Margin: {style.margin}%</label>
          <input
            id="margin"
            type="range"
            min={0}
            max={20}
            step={1}
            value={style.margin}
            onChange={(e) => onChange({ margin: Number(e.target.value) })}
            className="h-11 w-full accent-nova-600"
          />
          {style.margin < 5 && <p className="hint !text-amber-700">A small margin can stop some scanners. Keep at least 5%.</p>}
        </div>
        <div>
          <label htmlFor="ec" className="field-label">Error correction</label>
          <select
            id="ec"
            className="field"
            value={style.logo ? 'H' : style.ecLevel}
            disabled={!!style.logo}
            onChange={(e) => onChange({ ecLevel: e.target.value as EcLevel })}
          >
            {EC.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
          </select>
          <p className="hint">{style.logo ? 'Locked to High while a logo is used.' : 'Higher survives more damage but fits less data.'}</p>
        </div>
      </div>

      <div className="mt-5">
        <span className="field-label">Center logo (optional)</span>
        <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-label="Upload center logo"
          onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ''; }} />
        {style.logo ? (
          <div className="flex items-center gap-3 rounded-xl border border-line p-2.5">
            <img src={style.logo} alt="Your center logo" className="h-11 w-11 rounded-lg border border-line object-contain" />
            <span className="flex-1 text-sm text-ink-soft">Logo added</span>
            <button type="button" className="btn-ghost" onClick={() => { onChange({ logo: null }); setLogoError(null); }}>
              <X size={16} /> Remove
            </button>
          </div>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => logoInput.current?.click()}>
            <ImagePlus size={16} /> Add logo
          </button>
        )}
        {logoError && <p className="mt-2 flex items-start gap-1.5 text-sm text-red-600" role="alert"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{logoError}</p>}
        {style.logo && (
          <p className="mt-2 flex items-start gap-1.5 text-sm text-amber-700"><AlertTriangle size={16} className="mt-0.5 shrink-0" />A logo hides part of the code. Error correction is set to High. Scan a test copy on a few phones before printing.</p>
        )}
        <p className="hint">The logo stays in your browser and is never uploaded.</p>
      </div>
    </div>
  );
}
