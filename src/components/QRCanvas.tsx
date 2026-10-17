import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { buildOptions, PREVIEW_SIZE } from '../lib/qr';
import type { QRStyle } from '../lib/types';

interface Props {
  data: string | null;
  style: QRStyle;
  className?: string;
  label?: string;
  onError?: (message: string | null) => void;
}

/** Draws a real QR code for `data`. A fresh instance is created on every change so no stale state survives. */
export default function QRCanvas({ data, style, className = '', label = 'QR code preview', onError }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.replaceChildren();
    setFailed(false);
    onError?.(null);
    if (!data) return;
    try {
      const qr = new QRCodeStyling(buildOptions(data, style, PREVIEW_SIZE, 'canvas'));
      qr.append(el);
    } catch (err) {
      console.error(err);
      setFailed(true);
      onError?.('This content could not be turned into a QR code. Try shortening it.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, style]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={failed ? 'QR code could not be generated' : label}
      className={`[&>canvas]:block [&>canvas]:h-auto [&>canvas]:w-full ${className}`}
    />
  );
}
