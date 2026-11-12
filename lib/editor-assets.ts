import fs from "node:fs/promises";
import path from "node:path";

// Editöre yüklenen görseller kayıt onaylanana kadar burada bekler; önizleme
// buradan çalışır. Kayıtta içerikte geçenler assets'e taşınır, gerisi silinir.
const tempRoot = path.join(process.cwd(), "public", "editor-temp");

export function getTempDirectory(session: string) {
  if (!/^[0-9a-f-]{36}$/.test(session)) {
    throw new Error("Geçersiz yükleme oturumu.");
  }

  return path.join(tempRoot, session);
}

// Aynı klasördeki dosyanın üzerine yazmamak için isme -2, -3 eklenir.
export function getAvailableFileName(existing: Set<string>, fileName: string) {
  const parsed = path.parse(fileName);
  let name = fileName;
  let index = 2;

  while (existing.has(name)) {
    name = `${parsed.name}-${index}${parsed.ext}`;
    index += 1;
  }

  return name;
}

export async function commitTempAssets(
  content: string,
  session: FormDataEntryValue | null,
  assetsDirectory: string,
  publicAssetsPath: string,
) {
  if (typeof session !== "string" || !session) return content;

  const tempDirectory = getTempDirectory(session);
  const tempFiles = await fs.readdir(tempDirectory).catch(() => []);
  let nextContent = content;

  for (const fileName of tempFiles) {
    const tempUrl = `/editor-temp/${session}/${encodeURIComponent(fileName)}`;
    if (!nextContent.includes(tempUrl)) continue;

    await fs.mkdir(assetsDirectory, { recursive: true });
    const assetName = getAvailableFileName(
      new Set(await fs.readdir(assetsDirectory)),
      fileName,
    );

    await fs.rename(
      path.join(tempDirectory, fileName),
      path.join(assetsDirectory, assetName),
    );
    nextContent = nextContent
      .split(tempUrl)
      .join(`${publicAssetsPath}/${encodeURIComponent(assetName)}`);
  }

  await fs.rm(tempDirectory, { recursive: true, force: true });
  return nextContent;
}
