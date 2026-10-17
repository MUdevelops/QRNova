export type UrlResult =
  | { status: 'empty' }
  | { status: 'invalid'; error: string }
  | { status: 'valid'; url: string; isHttp: boolean };

const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const DOMAIN = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9-]{2,}$/i;

export function validateUrl(raw: string): UrlResult {
  const v = raw.trim();
  if (!v) return { status: 'empty' };
  if (/\s/.test(v)) return { status: 'invalid', error: 'Links cannot contain spaces.' };

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v);
  const blockedScheme = /^(javascript|data|vbscript|file|mailto|tel|sms|ftp|blob):/i.test(v);
  if (blockedScheme || (hasScheme && !/^https?:\/\//i.test(v))) {
    return { status: 'invalid', error: 'Only http:// and https:// links are supported.' };
  }

  try {
    const u = new URL(hasScheme ? v : `https://${v}`);
    const host = u.hostname;
    const ok = host === 'localhost' || IPV4.test(host) || DOMAIN.test(host);
    if (!ok) return { status: 'invalid', error: 'Enter a valid web address, like example.com/page.' };
    return { status: 'valid', url: u.href, isHttp: u.protocol === 'http:' };
  } catch {
    return { status: 'invalid', error: 'Enter a valid web address, like example.com/page.' };
  }
}

const encoder = new TextEncoder();
export const utf8Bytes = (s: string) => encoder.encode(s).length;

export const IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const IMAGE_EXT = /\.(png|jpe?g)$/i;

export function validateImageFile(file: File, maxBytes: number): string | null {
  if (!IMAGE_TYPES.includes(file.type) || !IMAGE_EXT.test(file.name)) {
    return 'Unsupported file. Choose a PNG, JPG or JPEG image.';
  }
  if (file.size === 0) return 'This file is empty.';
  if (file.size > maxBytes) {
    return `This image is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)}.`;
  }
  return null;
}

export function validateLogoFile(file: File): string | null {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    return 'Logo must be a PNG, JPG or WebP image.';
  }
  if (file.size > 1024 * 1024) return 'Logo must be 1 MB or smaller.';
  return null;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}
