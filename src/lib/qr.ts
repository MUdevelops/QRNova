import QRCodeStyling from 'qr-code-styling';
import type { EcLevel, ExportFormat, ModuleStyle, QRStyle } from './types';

type QROptions = NonNullable<ConstructorParameters<typeof QRCodeStyling>[0]>;

const SHAPES: Record<
  ModuleStyle,
  { dots: 'square' | 'rounded' | 'dots'; corner: 'square' | 'extra-rounded' | 'dot'; cornerDot: 'square' | 'dot' }
> = {
  square: { dots: 'square', corner: 'square', cornerDot: 'square' },
  rounded: { dots: 'rounded', corner: 'extra-rounded', cornerDot: 'dot' },
  dots: { dots: 'dots', corner: 'dot', cornerDot: 'dot' },
};

/** Max payload in bytes (byte mode, version 40) per error-correction level. */
export const CAPACITY_BYTES: Record<EcLevel, number> = { L: 2953, M: 2331, Q: 1663, H: 1273 };

/** Above this many bytes, codes get dense and harder to scan on phones. */
export const DENSE_BYTES = 500;

/** A center logo covers modules, so we always use the highest error correction. */
export const effectiveEcLevel = (style: QRStyle): EcLevel => (style.logo ? 'H' : style.ecLevel);

export const PREVIEW_SIZE = 600;
export const EXPORT_SIZES: Record<ExportFormat, number> = { png: 1024, svg: 1024, print: 3000 };

export function buildOptions(data: string, style: QRStyle, size: number, type: 'canvas' | 'svg'): QROptions {
  const shape = SHAPES[style.moduleStyle];
  return {
    width: size,
    height: size,
    type,
    data,
    margin: Math.round((size * style.margin) / 100),
    qrOptions: { errorCorrectionLevel: effectiveEcLevel(style) },
    dotsOptions: { type: shape.dots, color: style.fg },
    cornersSquareOptions: { type: shape.corner, color: style.fg },
    cornersDotOptions: { type: shape.cornerDot, color: style.fg },
    backgroundOptions: { color: style.bg },
    image: style.logo ?? undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.26,
      margin: Math.round(size * 0.012),
      crossOrigin: 'anonymous',
    },
  };
}

/** Renders the real QR code to a file Blob using the same options as the preview. */
export async function renderBlob(data: string, style: QRStyle, format: ExportFormat): Promise<Blob> {
  const isSvg = format === 'svg';
  const qr = new QRCodeStyling(buildOptions(data, style, EXPORT_SIZES[format], isSvg ? 'svg' : 'canvas'));
  const raw = await qr.getRawData(isSvg ? 'svg' : 'png');
  if (!raw) throw new Error('The QR code could not be rendered.');
  return raw as Blob;
}
