import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const id = context.params?.id || "";
  if (!/^[a-f0-9]{12}$/.test(id)) return new Response("Not found", { status: 404 });

  const entry = await getStore("qrnova-images").getWithMetadata(id, { type: "arrayBuffer" });
  if (!entry) return new Response("Not found", { status: 404 });

  return new Response(entry.data, {
    headers: {
      "Content-Type": entry.metadata?.type || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export const config = { path: "/i/:id" };
