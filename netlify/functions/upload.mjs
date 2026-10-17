import { getStore } from "@netlify/blobs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 4 * 1024 * 1024;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const { data, type } = body || {};
  if (typeof data !== "string" || !ALLOWED.includes(type)) {
    return json({ error: "Use a JPG, PNG or WebP image" }, 400);
  }

  const bytes = Buffer.from(data, "base64");
  if (!bytes.length || bytes.length > MAX_BYTES) {
    return json({ error: "Image must be under 4 MB" }, 413);
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  await getStore("qrnova-images").set(id, buffer, { metadata: { type } });

  return json({ url: new URL(`/i/${id}`, req.url).toString() });
};

export const config = { path: "/api/upload" };
