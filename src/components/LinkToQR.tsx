import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Copy, CheckCircle2 } from 'lucide-react';
import type { UrlResult } from '../lib/validation';
import { copyText } from '../lib/download';

interface Props {
  value: string;
  onChange: (v: string) => void;
  result: UrlResult;
  tooLong: boolean;
}

export default function LinkToQR({ value, onChange, result, tooLong }: Props) {
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (result.status !== 'valid') return;
    try {
      await copyText(result.url);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 2500);
  };

  const invalid = result.status === 'invalid';
  return (
    <div>
      <label htmlFor="link-input" className="field-label">Website link</label>
      <input
        id="link-input"
        type="text"
        inputMode="url"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`field ${invalid ? '!border-red-400 focus:!ring-red-200' : ''}`}
        placeholder="example.com or https://example.com/page"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby="link-feedback"
      />
      <div id="link-feedback" aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm">
        {result.status === 'empty' && <p className="text-ink-muted">Paste or type a link. We add https:// if you leave it out.</p>}
        {result.status === 'invalid' && (
          <p className="flex items-start gap-1.5 text-red-600"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{result.error}</p>
        )}
        {result.status === 'valid' && !tooLong && (
          <p className="flex items-start gap-1.5 text-emerald-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span className="break-all">Valid link: {result.url}</span>
          </p>
        )}
        {result.status === 'valid' && tooLong && (
          <p className="flex items-start gap-1.5 text-red-600"><AlertTriangle size={16} className="mt-0.5 shrink-0" />This link is too long to fit in a QR code at the current error-correction level.</p>
        )}
        {result.status === 'valid' && result.isHttp && (
          <p className="mt-1 flex items-start gap-1.5 text-amber-700"><AlertTriangle size={16} className="mt-0.5 shrink-0" />This link uses http://, which isn't encrypted. Use https:// if the site supports it.</p>
        )}
      </div>

      <button type="button" className="btn-secondary mt-4" onClick={copy} disabled={result.status !== 'valid'}>
        {copied === 'ok' ? <Check size={16} /> : <Copy size={16} />}
        {copied === 'ok' ? 'Link copied' : copied === 'fail' ? 'Copy failed' : 'Copy link'}
      </button>
    </div>
  );
}
