"use server";

import fs from "node:fs/promises";
import path from "node:path";

import { safeAssetName } from "@/lib/content-assets";

const contentRoot = path.join(process.cwd(), "public");
// Neden: SVG içinde script taşıyabildiği ve sitede aynı origin'den sunulduğu için kabul edilmiyor.
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"];
// Neden: Sunucu aksiyonu gövde sınırı 20mb (next.config.ts); form verisinin geri kalanına pay bırakılır.
const maxImageSize = 15 * 1024 * 1024;

// Görseli içeriğin kendi assets/ klasörüne doğrudan yazar ve herkese açık URL'sini döndürür.
// collection içerik klasörünü seçer (blogs, works); editör yalnızca bağlanmış hâlini görür.
export async function uploadAsset(
  collection: "blogs" | "works",
  id: string,
  formdata: FormData,
): Promise<{ url: string } | { error: string }> {
  const file = formdata.get("file");

  if (!["blogs", "works"].includes(collection) || !/^[a-z0-9-]+$/.test(id)) {
    return { error: "Geçersiz içerik klasörü." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Yüklenecek dosya bulunamadı." };
  }

  const name = safeAssetName(file.name);
  if (
    !file.type.startsWith("image/") ||
    !imageExtensions.includes(path.extname(name))
  ) {
    return {
      error: `"${file.name}" bir görsel değil. PNG, JPG, GIF, WEBP veya AVIF yükleyebilirsin.`,
    };
  }
  if (file.size > maxImageSize) {
    return {
      error: `"${file.name}" 15 MB'tan büyük, daha küçük bir görsel seç.`,
    };
  }

  const contentDirectory = path.resolve(contentRoot, collection, id);
  try {
    await fs.access(path.join(contentDirectory, "index.md"));
  } catch {
    return { error: "Bu içerik bulunamadı." };
  }

  const assetsDirectory = path.join(contentDirectory, "assets");
  await fs.mkdir(assetsDirectory, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const { name: base, ext } = path.parse(name);
  let fileName = name;
  let index = 2;

  // Neden: Aynı adda farklı bir dosya varsa üzerine yazılmaz, sona -2, -3 eklenir; aynı dosya tekrar yüklenirse o kullanılır.
  while (true) {
    const target = path.join(assetsDirectory, fileName);
    try {
      const existing = await fs.readFile(target);
      if (existing.equals(buffer)) break;
      fileName = `${base}-${index}${ext}`;
      index += 1;
    } catch {
      await fs.writeFile(target, buffer, { flag: "wx" });
      break;
    }
  }

  return {
    url: `/${collection}/${id}/assets/${encodeURIComponent(fileName)}`,
  };
}
