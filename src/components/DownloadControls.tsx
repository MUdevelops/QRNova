import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Copy, Download, Loader2 } from 'lucide-react';
import type { ExportFormat, Mode, QRStyle } from '../lib/types';
import { renderBlob } from '../lib/qr';
import { canCopyImage, copyImage, saveBlob } from '../lib/download';

const FORMATS: { id: ExportFormat; label: string; sub: string }[] = [
  { id: 'png', label: 'PNG', sub: '1024 px' },
  { id: 'svg', label: 'SVG', sub: 'Vector' },
  { id: 'print', label: 'Print PNG', sub: '3000 px' },
];
const SLUG: Record<Mode, string> = { link: 'website', text: 'text', image: 'image' };

interface Props {
  mode: Mode;
  data: string | null;
  style: QRStyle;
  disabled: boolean;
}

export default function DownloadControls({ mode, data, style, disabled }: Props) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [busy, setBusy] = useState<'download' | 'copy' | null>(null);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (kind: 'ok' | 'error', text: string) => {
    setStatus({ kind, text });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(null), 4000);
  };

  const filename = `qrnova-${SLUG[mode]}${format === 'print' ? '-print' : ''}.${format === 'svg' ? 'svg' : 'png'}`;
  const off = disabled || !data;

  const download = async () => {
    if (!data) return;
    setBusy('download');
    try {
      saveBlob(await renderBlob(data, style, format), filename);
      flash('ok', `Downloaded ${filename}`);
    } catch (err) {
      console.error(err);
      flash('error', 'The download failed. Try again, or pick another format.');
    } finally {
      setBusy(null);
    }
  };

  const copy = async () => {
    if (!data) return;
    setBusy('copy');
    try {
      await copyImage(renderBlob(data, style, 'png'));
      flash('ok', 'QR image copied to your clipboard');
    } catch (err) {
      console.error(err);
      flash('error', 'Your browser blocked copying. Download the PNG instead.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-6">
      <div role="radiogroup" aria-label="Download format" className="grid grid-cols-3 gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={format === f.id}
            onClick={() => setFormat(f.id)}
            className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${format === f.id ? 'border-nova-500 bg-nova-50 text-nova-700' : 'border-line text-ink-soft hover:border-nova-200'}`}
          >
            {f.label}
            <span className="text-[11px] font-normal text-ink-muted">{f.sub}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn-primary flex-1" onClick={download} disabled={off || busy !== null}>
          {busy === 'download' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Download {FORMATS.find((f) => f.id === format)?.label}
        </button>
        {canCopyImage() && (
          <button type="button" className="btn-secondary" onClick={copy} disabled={off || busy !== null}>
            {busy === 'copy' ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}
            Copy image
          </button>
        )}
      </div>

      <div aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm">
        {status?.kind === 'ok' && <p className="flex items-center gap-1.5 text-emerald-700"><Check size={16} />{status.text}</p>}
        {status?.kind === 'error' && <p className="flex items-center gap-1.5 text-red-600"><AlertTriangle size={16} />{status.text}</p>}
      </div>
      <p className="text-xs leading-relaxed text-ink-muted">
        Files are rendered from the same settings as the preview. Always test-scan before printing in volume; scanning can vary by device and print quality.
      </p>
    </div>
  );
}
