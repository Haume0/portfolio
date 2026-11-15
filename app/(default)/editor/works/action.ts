"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import AdmZip from "adm-zip";
import matter from "gray-matter";

import { removeUnreferencedAssets } from "@/lib/content-assets";

const worksDirectory = path.join(process.cwd(), "public", "works");

type FileData = {
  buffer: Buffer;
  name: string;
};

type ProjectImportData = {
  content: string;
  embeds: FileData[];
  mdFileFound: boolean;
};

function slugify(value: string) {
  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  return (
    value
      .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (char) => trMap[char] || char)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project"
  );
}

function normalizeZipPath(value: string) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

function collectZipEntries(zip: AdmZip, projectData: ProjectImportData) {
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const fullPath = normalizeZipPath(entry.entryName);
    const baseName = path.posix.basename(fullPath);

    if (!baseName || fullPath.startsWith("__MACOSX/")) continue;

    if (baseName.endsWith(".zip")) {
      collectZipEntries(new AdmZip(entry.getData()), projectData);
      continue;
    }

    if (baseName.endsWith(".md") && !projectData.mdFileFound) {
      projectData.mdFileFound = true;
      projectData.content = entry.getData().toString("utf8").trim();
      continue;
    }

    if (!baseName.endsWith(".md")) {
      projectData.embeds.push({
        buffer: entry.getData(),
        name: fullPath,
      });
    }
  }
}

function getSafeAssetName(file: FileData, usedNames: Set<string>) {
  const parsed = path.parse(path.posix.basename(file.name));
  const base = slugify(parsed.name);
  const extension = parsed.ext.toLowerCase();
  let fileName = `${base}${extension}`;
  let index = 2;

  while (usedNames.has(fileName)) {
    fileName = `${base}-${index}${extension}`;
    index += 1;
  }

  usedNames.add(fileName);
  return fileName;
}

function replaceAssetReferences(
  content: string,
  originalPath: string,
  publicPath: string,
) {
  const normalized = normalizeZipPath(originalPath);
  const baseName = path.posix.basename(normalized);
  const candidates = new Set([
    normalized,
    baseName,
    encodeURI(normalized),
    encodeURI(baseName),
    normalized.replace(/ /g, "%20"),
    baseName.replace(/ /g, "%20"),
  ]);

  // Neden: Adaylar tek geçişte, uzundan kısaya değiştirilir. Sırayla değiştirmek, dosya adı zaten güvenli
  // olduğunda (anasayfa.webp) kısa adı az önce yazılan yolun içinde tekrar bulup yolu ikiliyordu.
  const pattern = [...candidates]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((candidate) => candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return content.replace(new RegExp(pattern, "g"), publicPath);
}

function getString(formdata: FormData, key: string, fallback = "") {
  const value = formdata.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function getText(formdata: FormData, key: string) {
  const value = formdata.get(key);
  // Neden: Tarayıcı form metnini CRLF ile gönderiyor; dosyalar LF kalmalı.
  return typeof value === "string" ? value.replace(/\r\n?/g, "\n") : "";
}

function assertSafeId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^[a-z0-9-]+$/.test(value)) {
    throw new Error("Geçersiz proje id değeri.");
  }

  return value;
}

function getProjectDirectory(id: string) {
  const directory = path.resolve(worksDirectory, id);
  const root = path.resolve(worksDirectory);

  if (!directory.startsWith(root + path.sep)) {
    throw new Error("Geçersiz proje yolu.");
  }

  return directory;
}

function serializeFrontmatter(data: Record<string, string | boolean | number>) {
  return [
    "---",
    ...Object.entries(data)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}: ${JSON.stringify(value)}`;
        }

        return `${key}: ${value}`;
      }),
    "---",
    "",
  ].join("\n");
}

function revalidateWorksPaths() {
  revalidatePath("/");
  revalidatePath("/editor/works");
}

async function projectExists(id: string) {
  try {
    await fs.access(getProjectDirectory(id));
    return true;
  } catch {
    return false;
  }
}

// Neden: Yeni proje tek bir taslak klasörüyle başlar ki görseller ilk andan itibaren gerçek yerine yüklenebilsin;
// gerçek id kaydedilince updateProject klasörü yeniden adlandırır.
const draftId = "untitled-project";

// Taslak eksik kaydedilebilir; yayına alınacak proje kartın tüm alanlarını ve gerçek bir id'yi taşımalı.
function publishProblem(project: {
  id: string;
  title: unknown;
  description: unknown;
  linkName: unknown;
  linkUrl: unknown;
  image: unknown;
}) {
  if (project.id === draftId) {
    return `Yayına almak için önce proje id'sini değiştir; "${draftId}" yayına alınamaz.`;
  }
  const missing = [
    [project.title, "başlık"],
    [project.description, "açıklama"],
    [project.linkName, "link adı"],
    [project.linkUrl, "link adresi"],
    [project.image, "kart görseli"],
  ]
    .filter(([value]) => !value)
    .map(([, label]) => label);
  return missing.length
    ? `Yayına almak için eksik: ${missing.join(", ")}.`
    : null;
}

// Taslak yoksa oluşturur, varsa yarım kaldığı haliyle açar.
export async function openDraftProject() {
  const directory = getProjectDirectory(draftId);
  const markdownPath = path.join(directory, "index.md");

  try {
    await fs.access(markdownPath);
  } catch {
    const now = new Date().toISOString();
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(
      markdownPath,
      serializeFrontmatter({
        id: draftId,
        published: false,
        createdAt: now,
        updated: now,
      }),
      "utf8",
    );
  }

  revalidateWorksPaths();
  redirect(`/editor/works?edit=${draftId}`);
}

export async function updateProject(_prev: string | null, formdata: FormData) {
  const originalId = assertSafeId(formdata.get("originalId"));
  const rawId = getString(formdata, "id");
  const id = slugify(rawId);
  const title = getString(formdata, "title");
  const description = getString(formdata, "description");
  const object = getString(formdata, "object");
  const linkName = getString(formdata, "linkName", "Visit");
  const linkUrl = getString(formdata, "linkUrl", "#");
  const manualContent = getText(formdata, "content");
  const published = formdata.get("published") === "true";
  const imageFile = formdata.get("image") as File | null;
  const notionFile = formdata.get("notion") as File | null;

  const originalDirectory = getProjectDirectory(originalId);
  const projectDirectory = getProjectDirectory(id);

  try {
    const originalMarkdownPath = path.join(originalDirectory, "index.md");
    const markdown = await fs.readFile(originalMarkdownPath, "utf8");
    const { data } = matter(markdown);

    // Doğrulama dosyalara dokunmadan önce yapılır; reddedilen kayıt hiçbir şeyi değiştirmez.
    const problem = published
      ? publishProblem({
          id,
          title,
          description,
          linkName,
          linkUrl,
          image: (imageFile && imageFile.size > 0) || data.image,
        })
      : null;
    if (problem) return problem;

    if (id !== originalId) {
      if (await projectExists(id)) {
        throw new Error("Bu proje id değeri zaten kullanılıyor.");
      }

      await fs.rename(originalDirectory, projectDirectory);
    }

    const assetsDirectory = path.join(projectDirectory, "assets");
    const markdownPath = path.join(projectDirectory, "index.md");
    const now = new Date().toISOString();
    // Neden: Taslağın kart görseli henüz olmayabilir; boş değer frontmatter'a yazılmaz.
    let imagePath = typeof data.image === "string" ? data.image : "";

    imagePath = imagePath.split(`/works/${originalId}/`).join(`/works/${id}/`);

    if (imageFile && imageFile.size > 0) {
      const imageExtension =
        path.extname(imageFile.name).toLowerCase() ||
        path.extname(imagePath) ||
        ".webp";
      const imageName = `image${imageExtension}`;

      imagePath = `/works/${id}/${imageName}`;

      await fs.writeFile(
        path.join(projectDirectory, imageName),
        Buffer.from(await imageFile.arrayBuffer()),
      );
    }

    const projectData: ProjectImportData = {
      content: "",
      embeds: [],
      mdFileFound: false,
    };
    let content = manualContent;

    if (notionFile && notionFile.size > 0) {
      collectZipEntries(
        new AdmZip(Buffer.from(await notionFile.arrayBuffer())),
        projectData,
      );
      // Neden: Eski ekleme formundaki gibi zip'te markdown yoksa editördeki metin korunur.
      if (projectData.mdFileFound) content = projectData.content;

      await fs.rm(assetsDirectory, { recursive: true, force: true });
      await fs.mkdir(assetsDirectory, { recursive: true });

      const usedAssetNames = new Set<string>();
      for (const embed of projectData.embeds) {
        const assetName = getSafeAssetName(embed, usedAssetNames);
        const publicPath = `/works/${id}/assets/${encodeURIComponent(assetName)}`;

        await fs.writeFile(path.join(assetsDirectory, assetName), embed.buffer);
        content = replaceAssetReferences(content, embed.name, publicPath);
      }
    }

    content = content.split(`/works/${originalId}/`).join(`/works/${id}/`);

    const frontmatter = serializeFrontmatter({
      id,
      image: imagePath,
      title,
      description,
      object,
      linkName,
      linkUrl,
      published,
      createdAt: typeof data.createdAt === "string" ? data.createdAt : now,
      updated: now,
    });

    const nextMarkdown = `${frontmatter}${content.trimStart()}\n`;
    await fs.writeFile(markdownPath, nextMarkdown, "utf8");

    // Neden: Editörde yüklenip vazgeçilen veya değiştirilen görseller silinir. Kimlik değişikliği ve yol
    // yeniden yazımı bittikten sonra son id ve son metinle çalışır; zip import edildiyse atlanır, çünkü
    // zip'in az önce yazdığı ve markdown'da geçmeyen dosyalar import'un kendi kararıdır.
    if (!(notionFile && notionFile.size > 0)) {
      await removeUnreferencedAssets(
        projectDirectory,
        `/works/${id}/assets/`,
        nextMarkdown,
      );
    }
  } catch (error) {
    console.error("Proje güncellenirken bir hata oluştu:", error);
    throw new Error("Proje güncellenemedi.");
  }

  revalidateWorksPaths();
  // Neden: Id değişince klasör de değişti; eski ?edit= adresi artık bulunamaz, yeni id'nin formuna gidilir.
  if (id !== originalId) redirect(`/editor/works?edit=${id}`);
  return "Proje güncellendi";
}

export async function toggleProjectPublished(formdata: FormData) {
  const id = assertSafeId(formdata.get("id"));
  const published = formdata.get("published") === "true";
  const markdownPath = path.join(getProjectDirectory(id), "index.md");
  const markdown = await fs.readFile(markdownPath, "utf8");
  const { data, content } = matter(markdown);
  const problem = published
    ? publishProblem({
        id,
        title: data.title,
        description: data.description,
        linkName: data.linkName,
        linkUrl: data.linkUrl,
        image: data.image,
      })
    : null;

  if (problem) {
    throw new Error(problem);
  }

  await fs.writeFile(
    markdownPath,
    serializeFrontmatter({
      id,
      image: data.image,
      title: data.title,
      description: data.description,
      object: data.object,
      linkName: data.linkName,
      linkUrl: data.linkUrl,
      published,
      createdAt: data.createdAt,
      updated: new Date().toISOString(),
    }) +
      content.trimStart() +
      "\n",
    "utf8",
  );

  revalidateWorksPaths();
}

export async function deleteProject(formdata: FormData) {
  const id = assertSafeId(formdata.get("id"));

  await fs.rm(getProjectDirectory(id), { recursive: true, force: true });
  revalidateWorksPaths();
}
