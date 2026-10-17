export type Mode = 'image' | 'link' | 'text';
export type ModuleStyle = 'square' | 'rounded' | 'dots';
export type EcLevel = 'L' | 'M' | 'Q' | 'H';
export type ExportFormat = 'png' | 'svg' | 'print';

export interface QRStyle {
  fg: string;
  bg: string;
  moduleStyle: ModuleStyle;
  /** Quiet zone around the code, as a percentage of the image width. */
  margin: number;
  ecLevel: EcLevel;
  /** Center logo as a data URL, or null. */
  logo: string | null;
}

export const DEFAULT_STYLE: QRStyle = {
  fg: '#0B1030',
  bg: '#FFFFFF',
  moduleStyle: 'square',
  margin: 10,
  ecLevel: 'M',
  logo: null,
};

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  hostedUrl: string | null;
  uploading: boolean;
  error: string | null;
}

export const EMPTY_IMAGE: ImageState = {
  file: null,
  previewUrl: null,
  hostedUrl: null,
  uploading: false,
  error: null,
};
