"use server";

import fs from "node:fs/promises";
import path from "node:path";

import { getAvailableFileName, getTempDirectory } from "@/lib/editor-assets";

export async function uploadEditorAsset(formdata: FormData) {
  const session = formdata.get("session");
  const file = formdata.get("file");

  if (typeof session !== "string") {
    throw new Error("Yükleme oturumu bulunamadı.");
  }

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Yüklenecek dosya bulunamadı.");
  }

  const directory = getTempDirectory(session);
  await fs.mkdir(directory, { recursive: true });

  // Notion importundaki gibi okunabilir, URL güvenli isim: "Ekran Görüntüsü.PNG" → ekran-goruntusu.png
  const parsed = path.parse(file.name);
  const baseName =
    parsed.name
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "gorsel";
  const fileName = getAvailableFileName(
    new Set(await fs.readdir(directory)),
    `${baseName}${parsed.ext.toLowerCase()}`,
  );

  await fs.writeFile(
    path.join(directory, fileName),
    Buffer.from(await file.arrayBuffer()),
  );

  return `/editor-temp/${session}/${encodeURIComponent(fileName)}`;
}
