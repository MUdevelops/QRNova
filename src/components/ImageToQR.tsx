import { useRef, useState, type DragEvent } from 'react';
import { AlertTriangle, Check, CheckCircle2, Copy, Loader2, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import type { ImageState } from '../lib/types';
import type { Hosting } from '../lib/upload';
import { formatBytes } from '../lib/validation';
import { copyText } from '../lib/download';

interface Props {
  image: ImageState;
  hosting: Hosting;
  onSelect: (file: File) => void;
  onRemove: () => void;
  onUpload: () => void;
}

export default function ImageToQR({ image, hosting, onSelect, onRemove, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  if (hosting.state === 'checking') {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-ink-muted" role="status">
        <Loader2 size={16} className="animate-spin" /> Checking image hosting…
      </p>
    );
  }

  if (hosting.state === 'unavailable') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
        <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> Image to QR isn't available here</p>
        <p className="mt-2">{hosting.reason}</p>
        <p className="mt-2">
          A QR code can't hold a whole image, so QRNova uploads the image to hosting and encodes its public link. Without hosting, nothing is uploaded and no QR code is made. Link and text codes work fully without it.
        </p>
      </div>
    );
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  const copyHosted = async () => {
    if (!image.hostedUrl) return;
    try {
      await copyText(image.hostedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <span className="field-label">Image</span>
      <input
        ref={inputRef}
        id="image-input"
        type="file"
        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = '';
        }}
      />

      {!image.file ? (
        <label
          htmlFor="image-input"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors focus-within:ring-2 focus-within:ring-nova-500/30 ${dragging ? 'border-nova-500 bg-nova-50' : 'border-line hover:border-nova-200 hover:bg-nova-50/50'}`}
        >
          <UploadCloud className="text-nova-600" size={28} />
          <span className="mt-3 text-sm font-semibold text-ink">Choose an image or drop it here</span>
          <span className="mt-1 text-xs text-ink-muted">PNG, JPG or JPEG · up to {formatBytes(hosting.maxBytes)}</span>
        </label>
      ) : (
        <div className="rounded-xl border border-line p-3">
          <div className="flex items-center justify-center rounded-lg bg-surface p-2">
            {image.previewUrl && <img src={image.previewUrl} alt="Selected image preview" className="max-h-52 w-auto max-w-full rounded object-contain" />}
          </div>
          <p className="mt-3 truncate text-sm font-medium text-ink" title={image.file.name}>{image.file.name}</p>
          <p className="text-xs text-ink-muted">{formatBytes(image.file.size)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary !min-h-[40px]" onClick={() => inputRef.current?.click()} disabled={image.uploading}>
              <RefreshCw size={16} /> Replace
            </button>
            <button type="button" className="btn-secondary !min-h-[40px]" onClick={onRemove} disabled={image.uploading}>
              <Trash2 size={16} /> Remove
            </button>
          </div>
        </div>
      )}

      <div aria-live="polite" className="mt-3 text-sm">
        {image.error && <p className="flex items-start gap-1.5 text-red-600"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{image.error}</p>}
        {image.hostedUrl && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
            <p className="flex items-center gap-1.5 font-medium"><CheckCircle2 size={16} /> Uploaded. Your QR code is ready.</p>
            <p className="mt-1 break-all text-xs">{image.hostedUrl}</p>
            <button type="button" className="btn-ghost mt-1 !min-h-[36px] !px-2 text-emerald-900" onClick={copyHosted}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy image link'}
            </button>
          </div>
        )}
      </div>

      {image.file && !image.hostedUrl && (
        <button type="button" className="btn-primary mt-4 w-full sm:w-auto" onClick={onUpload} disabled={image.uploading}>
          {image.uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : <><UploadCloud size={16} /> Upload and create QR code</>}
        </button>
      )}

      <p className="hint mt-4 leading-relaxed">
        Creating the code uploads your image to this site's hosting. Anyone who has the QR code or its link can view the image, so don't upload anything private. The image stays online until the site owner removes it, and the QR code only works while it does.
      </p>
    </div>
  );
}
