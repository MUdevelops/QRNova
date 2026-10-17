import { AlertTriangle, Info } from 'lucide-react';
import { DENSE_BYTES } from '../lib/qr';

interface Props {
  value: string;
  onChange: (v: string) => void;
  bytes: number;
  capacity: number;
}

export default function TextToQR({ value, onChange, bytes, capacity }: Props) {
  const over = bytes > capacity;
  const dense = !over && bytes > DENSE_BYTES;
  return (
    <div>
      <label htmlFor="text-input" className="field-label">Text</label>
      <textarea
        id="text-input"
        rows={6}
        maxLength={5000}
        className={`field resize-y ${over ? '!border-red-400 focus:!ring-red-200' : ''}`}
        placeholder={'Any text: a message, Wi-Fi note, contact details…\nLine breaks are kept.'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={over}
        aria-describedby="text-feedback"
      />
      <div id="text-feedback" aria-live="polite" className="mt-2 text-sm">
        <p className={`tabular-nums ${over ? 'font-medium text-red-600' : 'text-ink-muted'}`}>
          {value.length} characters · {bytes} / {capacity} bytes
        </p>
        {over && (
          <p className="mt-1 flex items-start gap-1.5 text-red-600"><AlertTriangle size={16} className="mt-0.5 shrink-0" />Too much text for a QR code. Shorten it or lower the error-correction level.</p>
        )}
        {dense && (
          <p className="mt-1 flex items-start gap-1.5 text-amber-700"><AlertTriangle size={16} className="mt-0.5 shrink-0" />Long text makes a dense code that is harder to scan. Shorter is more reliable.</p>
        )}
        {!value && (
          <p className="mt-1 flex items-start gap-1.5 text-ink-muted"><Info size={16} className="mt-0.5 shrink-0" />The code contains exactly what you type, with nothing added.</p>
        )}
      </div>
    </div>
  );
}
