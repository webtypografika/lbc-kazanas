import sharp from "sharp";
import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";

export async function processImage(file: File): Promise<{ url: string; thumbUrl: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();

  // Full size: max 1920px wide, webp
  const fullBuffer = await sharp(buffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const { url } = await put(`images/${id}.webp`, fullBuffer, {
    access: "public",
    contentType: "image/webp",
  });

  // Thumbnail: 600px wide, webp
  const thumbBuffer = await sharp(buffer)
    .resize(600, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  const { url: thumbUrl } = await put(`images/${id}-thumb.webp`, thumbBuffer, {
    access: "public",
    contentType: "image/webp",
  });

  return { url, thumbUrl };
}

export async function deleteImage(url: string, thumbUrl: string) {
  const urls = [url, thumbUrl].filter(Boolean);
  if (urls.length > 0) {
    await del(urls);
  }
}
