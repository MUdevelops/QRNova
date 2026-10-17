import { getStore } from '@netlify/blobs';

// POST /api/upload  — raw image bytes in the body, Content-Type = image/png | image/jpeg
// GET  /api/upload  — reports whether image hosting is available
export const config = { path: '/api/upload' };

const STORE = 'qrnova-images';
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function maxBytes(): number {
  const mb = Number(process.env.IMAGE_MAX_MB ?? 4);
  const safe = Number.isFinite(mb) ? Math.min(Math.max(mb, 1), 4) : 4;
  return Math.floor(safe * 1024 * 1024);
}

function detectType(b: Uint8Array): 'image/png' | 'image/jpeg' | null {
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  return null;
}

export default async (req: Request): Promise<Response> => {
  const enabled = (process.env.IMAGE_UPLOAD_ENABLED ?? 'true').toLowerCase() !== 'false';

  if (req.method === 'GET') {
    return json({ available: enabled, maxBytes: maxBytes() });
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!enabled) return json({ error: 'Image hosting is disabled on this deployment.' }, 503);

  try {
    const buf = new Uint8Array(await req.arrayBuffer());
    if (buf.length === 0) return json({ error: 'No file received.' }, 400);
    if (buf.length > maxBytes()) {
      return json({ error: `Image is too large. Maximum size is ${Math.floor(maxBytes() / 1048576)} MB.` }, 413);
    }
    const type = detectType(buf);
    if (!type) return json({ error: 'Only PNG and JPG images are supported.' }, 415);

    const id = crypto.randomUUID();
    const store = getStore(STORE);
    await store.set(id, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, {
      metadata: { type, uploadedAt: new Date().toISOString() },
    });

    const origin = new URL(req.url).origin;
    return json({ id, url: `${origin}/i/${id}` }, 201);
  } catch (err) {
    console.error('upload failed', err);
    return json({ error: 'Upload failed. Image hosting may not be configured correctly.' }, 500);
  }
};
