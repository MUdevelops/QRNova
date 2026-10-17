import { useEffect, useState } from 'react';

export type Hosting =
  | { state: 'checking' }
  | { state: 'available'; maxBytes: number }
  | { state: 'unavailable'; reason: string };

const DEFAULT_REASON =
  'Image hosting is not set up on this deployment. It runs on Netlify Functions — see the README to enable it.';

export function useImageHosting(): Hosting {
  const [hosting, setHosting] = useState<Hosting>({ state: 'checking' });

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    (async () => {
      try {
        const res = await fetch('/api/upload', { signal: ctrl.signal, headers: { Accept: 'application/json' } });
        const isJson = (res.headers.get('content-type') ?? '').includes('application/json');
        if (!res.ok || !isJson) throw new Error('not available');
        const body = (await res.json()) as { available?: boolean; maxBytes?: number };
        if (cancelled) return;
        if (body.available) setHosting({ state: 'available', maxBytes: body.maxBytes ?? 4 * 1024 * 1024 });
        else setHosting({ state: 'unavailable', reason: 'Image hosting has been turned off by the site owner.' });
      } catch {
        if (!cancelled) setHosting({ state: 'unavailable', reason: DEFAULT_REASON });
      } finally {
        clearTimeout(timer);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  return hosting;
}

export async function uploadImage(file: File): Promise<string> {
  let res: Response;
  try {
    res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
  } catch {
    throw new Error('Network error. Check your connection and try again.');
  }
  let body: { url?: string; error?: string } = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok || !body.url) throw new Error(body.error ?? 'Upload failed. Please try again.');
  return body.url;
}
