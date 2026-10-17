import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ImageIcon, Link2, Type } from 'lucide-react';
import ImageToQR from './ImageToQR';
import LinkToQR from './LinkToQR';
import TextToQR from './TextToQR';
import CustomizationPanel from './CustomizationPanel';
import QRPreview from './QRPreview';
import DownloadControls from './DownloadControls';
import { DEFAULT_STYLE, EMPTY_IMAGE, type ImageState, type Mode, type QRStyle } from '../lib/types';
import { CAPACITY_BYTES, effectiveEcLevel } from '../lib/qr';
import { contrastRatio } from '../lib/contrast';
import { utf8Bytes, validateImageFile, validateUrl } from '../lib/validation';
import { uploadImage, useImageHosting } from '../lib/upload';

const TABS: { id: Mode; label: string; icon: typeof Link2 }[] = [
  { id: 'image', label: 'Image to QR', icon: ImageIcon },
  { id: 'link', label: 'Link to QR', icon: Link2 },
  { id: 'text', label: 'Text to QR', icon: Type },
];

export default function QRGenerator() {
  const [mode, setMode] = useState<Mode>('link');
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<ImageState>(EMPTY_IMAGE);
  const [style, setStyle] = useState<QRStyle>(DEFAULT_STYLE);
  const [renderError, setRenderError] = useState<string | null>(null);
  const hosting = useImageHosting();
  const tabRefs = useRef<Record<Mode, HTMLButtonElement | null>>({ image: null, link: null, text: null });

  // Guards against an upload finishing after the image was replaced or removed.
  const uploadToken = useRef(0);
  const previewRef = useRef<string | null>(null);
  previewRef.current = image.previewUrl;
  useEffect(() => () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); }, []);

  const capacity = CAPACITY_BYTES[effectiveEcLevel(style)];
  const linkResult = useMemo(() => validateUrl(link), [link]);
  const linkTooLong = linkResult.status === 'valid' && utf8Bytes(linkResult.url) > capacity;
  const textBytes = useMemo(() => utf8Bytes(text), [text]);

  const contrast = contrastRatio(style.fg, style.bg);
  const styleIssue = contrast < 2 ? 'Contrast is too low to make a reliable code. Adjust the colors.' : null;

  const rawData = useMemo<string | null>(() => {
    if (mode === 'link') return linkResult.status === 'valid' && !linkTooLong ? linkResult.url : null;
    if (mode === 'text') return text.trim() && textBytes <= capacity ? text : null;
    return image.hostedUrl;
  }, [mode, linkResult, linkTooLong, text, textBytes, capacity, image.hostedUrl]);

  const data = styleIssue ? null : rawData;
  const issue = styleIssue ?? renderError;

  const patchStyle = useCallback((patch: Partial<QRStyle>) => setStyle((s) => ({ ...s, ...patch })), []);

  const selectImage = (file: File) => {
    const max = hosting.state === 'available' ? hosting.maxBytes : 4 * 1024 * 1024;
    const error = validateImageFile(file, max);
    uploadToken.current++;
    if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
    if (error) {
      setImage({ ...EMPTY_IMAGE, error });
      return;
    }
    setImage({ ...EMPTY_IMAGE, file, previewUrl: URL.createObjectURL(file) });
  };

  const removeImage = () => {
    uploadToken.current++;
    if (image.previewUrl) URL.revokeObjectURL(image.previewUrl);
    setImage(EMPTY_IMAGE);
  };

  const upload = async () => {
    if (!image.file) return;
    const token = ++uploadToken.current;
    setImage((i) => ({ ...i, uploading: true, error: null }));
    try {
      const url = await uploadImage(image.file);
      if (token !== uploadToken.current) return;
      setImage((i) => ({ ...i, uploading: false, hostedUrl: url }));
    } catch (err) {
      if (token !== uploadToken.current) return;
      setImage((i) => ({ ...i, uploading: false, error: err instanceof Error ? err.message : 'Upload failed.' }));
    }
  };

  const onTabKey = (e: KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = TABS.length - 1;
    else return;
    e.preventDefault();
    setMode(TABS[next].id);
    tabRefs.current[TABS[next].id]?.focus();
  };

  return (
    <section id="generator" aria-labelledby="generator-title" className="scroll-mt-16 bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 id="generator-title" className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Create your QR code</h2>
        <p className="mt-3 max-w-xl text-ink-soft">Choose what the code should open, customize it, then download.</p>

        <div role="tablist" aria-label="QR code type" className="mt-8 grid grid-cols-3 gap-1 rounded-2xl border border-line bg-white p-1 sm:inline-grid">
          {TABS.map((t, i) => {
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => { tabRefs.current[t.id] = el; }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active}
                aria-controls={`panel-${t.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setMode(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold transition-colors sm:px-5 ${active ? 'bg-nova-600 text-white' : 'text-ink-soft hover:bg-surface hover:text-ink'}`}
              >
                <t.icon size={16} className="hidden sm:block" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div
              role="tabpanel"
              id={`panel-${mode}`}
              aria-labelledby={`tab-${mode}`}
              className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6"
            >
              {mode === 'link' && <LinkToQR value={link} onChange={setLink} result={linkResult} tooLong={linkTooLong} />}
              {mode === 'text' && <TextToQR value={text} onChange={setText} bytes={textBytes} capacity={capacity} />}
              {mode === 'image' && (
                <ImageToQR image={image} hosting={hosting} onSelect={selectImage} onRemove={removeImage} onUpload={upload} />
              )}
            </div>
            <CustomizationPanel style={style} onChange={patchStyle} onReset={() => setStyle(DEFAULT_STYLE)} />
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
            <h3 className="mb-4 text-lg font-semibold text-ink">Preview</h3>
            <QRPreview mode={mode} data={data} style={style} issue={issue} onError={setRenderError} />
            <DownloadControls mode={mode} data={data} style={style} disabled={!!issue} />
          </div>
        </div>
      </div>
    </section>
  );
}
