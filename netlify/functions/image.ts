import { getStore } from '@netlify/blobs';

// GET /i/:id — serves an image previously uploaded through /api/upload
export const config = { path: '/i/:id' };

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export default async (req: Request, context: { params: Record<string, string> }): Promise<Response> => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });

  const id = context.params?.id ?? '';
  if (!ID.test(id)) return new Response('Not found', { status: 404 });

  try {
    const store = getStore('qrnova-images');
    const entry = await store.getWithMetadata(id, { type: 'arrayBuffer' });
    if (!entry) return new Response('Not found', { status: 404 });

    const type = entry.metadata?.type === 'image/png' ? 'image/png' : 'image/jpeg';
    return new Response(req.method === 'HEAD' ? null : entry.data, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  } catch (err) {
    console.error('image fetch failed', err);
    return new Response('Server error', { status: 500 });
  }
};
