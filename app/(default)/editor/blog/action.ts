"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import AdmZip from "adm-zip";
import matter from "gray-matter";
import type { IBlogData, IFileData } from "@/lib/blogs";
import { removeUnreferencedAssets } from "@/lib/content-assets";

const blogsDirectory = path.join(process.cwd(), "public", "blogs");

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
      .replace(/^-+|-+$/g, "") || "blog-yazisi"
  );
}

function normalizeZipPath(value: string) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

function getTitleAndContent(markdown: string, fallbackTitle: string) {
  const lines = markdown.split(/\r?\n/);
  const firstHeadingIndex = lines.findIndex((line) => /^#\s+/.test(line));

  if (firstHeadingIndex === -1) {
    return {
      title: fallbackTitle.replace(/\.md$/i, "") || "Başlıksız",
      content: markdown.trim(),
    };
  }

  const title = lines[firstHeadingIndex].replace(/^#\s+/, "").trim();
  lines.splice(firstHeadingIndex, 1);

  return {
    title: title || "Başlıksız",
    content: lines.join("\n").trim(),
  };
}

function collectZipEntries(zip: AdmZip, blogData: IBlogData) {
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;

    const fullPath = normalizeZipPath(entry.entryName);
    const baseName = path.posix.basename(fullPath);

    if (!baseName || fullPath.startsWith("__MACOSX/")) continue;

    if (baseName.endsWith(".zip")) {
      collectZipEntries(new AdmZip(entry.getData()), blogData);
      continue;
    }

    if (baseName.endsWith(".md") && !blogData.mdFileFound) {
      blogData.mdFileFound = true;
      const markdown = entry.getData().toString("utf8");
      const parsed = getTitleAndContent(markdown, baseName);
      blogData.title = parsed.title;
      blogData.content = parsed.content;
      continue;
    }

    if (!baseName.endsWith(".md")) {
      blogData.embeds.push({
        buffer: entry.getData(),
        name: fullPath,
      });
    }
  }
}

async function getAvailableSlug(title: string) {
  await fs.mkdir(blogsDirectory, { recursive: true });

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let index = 2;

  while (true) {
    try {
      await fs.access(path.join(blogsDirectory, slug));
      slug = `${baseSlug}-${index}`;
      index += 1;
    } catch {
      return slug;
    }
  }
}

function getSafeAssetName(file: IFileData, usedNames: Set<string>) {
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

function replaceAll(content: string, from: string, to: string) {
  return from ? content.split(from).join(to) : content;
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

  let nextContent = content;
  for (const candidate of candidates) {
    nextContent = replaceAll(nextContent, candidate, publicPath);
  }

  return nextContent;
}

function createFrontmatter(data: {
  title: string;
  slug: string;
  date: string;
  updated: string;
  cover: string | null;
  published: boolean;
}) {
  return [
    "---",
    `title: ${JSON.stringify(data.title)}`,
    `slug: ${JSON.stringify(data.slug)}`,
    `date: ${JSON.stringify(data.date)}`,
    `updated: ${JSON.stringify(data.updated)}`,
    `published: ${data.published}`,
    data.cover ? `cover: ${JSON.stringify(data.cover)}` : "cover: null",
    "---",
    "",
  ].join("\n");
}

// Kapak assets/ dışında, yazının kendi klasöründe cover.<uzantı> olarak durur.
async function writeCover(blogDirectory: string, slug: string, file: File) {
  const extension = path.extname(file.name).toLowerCase() || ".webp";
  const coverName = `cover${extension}`;

  await fs.writeFile(
    path.join(blogDirectory, coverName),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/blogs/${slug}/${coverName}`;
}

function assertSafeSlug(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^[a-z0-9-]+$/.test(value)) {
    throw new Error("Geçersiz blog slug değeri.");
  }

  return value;
}

function getBlogDirectory(slug: string) {
  const directory = path.resolve(blogsDirectory, slug);
  const root = path.resolve(blogsDirectory);

  if (!directory.startsWith(root + path.sep)) {
    throw new Error("Geçersiz blog yolu.");
  }

  return directory;
}

function serializeFrontmatter(data: Record<string, string | boolean | null>) {
  return [
    "---",
    ...Object.entries(data).map(([key, value]) => {
      if (typeof value === "string") {
        return `${key}: ${JSON.stringify(value)}`;
      }

      return `${key}: ${value}`;
    }),
    "---",
    "",
  ].join("\n");
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/editor/blog");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function addBlog(_prev: unknown, formdata: FormData) {
  const blogFile = formdata.get("blog") as File;
  if (!blogFile || blogFile.size === 0) {
    throw new Error("Blog için bir zip dosyası yüklenmelidir.");
  }

  const blogData: IBlogData = {
    title: "",
    content: "",
    embeds: [],
    mdFileFound: false,
  };

  try {
    const fileBuffer = Buffer.from(await blogFile.arrayBuffer());
    collectZipEntries(new AdmZip(fileBuffer), blogData);

    if (!blogData.mdFileFound) {
      throw new Error("Zip arşivi içinde .md uzantılı bir dosya bulunamadı.");
    }

    const slug = await getAvailableSlug(blogData.title);
    const blogDirectory = path.join(blogsDirectory, slug);
    const assetsDirectory = path.join(blogDirectory, "assets");
    const usedAssetNames = new Set<string>();

    await fs.mkdir(assetsDirectory, { recursive: true });

    let content = blogData.content;
    for (const embed of blogData.embeds) {
      const assetName = getSafeAssetName(embed, usedAssetNames);
      const publicPath = `/blogs/${slug}/assets/${encodeURIComponent(assetName)}`;

      await fs.writeFile(path.join(assetsDirectory, assetName), embed.buffer);
      content = replaceAssetReferences(content, embed.name, publicPath);
    }

    const thumbFile = formdata.get("thumb") as File | null;
    let cover: string | null = null;

    if (thumbFile && thumbFile.size > 0) {
      cover = await writeCover(blogDirectory, slug, thumbFile);
    }

    const now = new Date();
    const frontmatter = createFrontmatter({
      title: blogData.title,
      slug,
      date: now.toISOString().slice(0, 10),
      updated: now.toISOString(),
      cover,
      published: true,
    });

    await fs.writeFile(
      path.join(blogDirectory, "index.md"),
      `${frontmatter}${content}\n`,
      "utf8",
    );
  } catch (error) {
    console.error("Blog eklenirken bir hata oluştu:", error);
    throw new Error("Blog oluşturulamadı. Lütfen daha sonra tekrar deneyin.");
  }

  revalidateBlogPaths();
  return "Blog yüklendi";
}

export async function toggleBlogPublished(formdata: FormData) {
  const slug = assertSafeSlug(formdata.get("slug"));
  const published = formdata.get("published") === "true";
  const markdownPath = path.join(getBlogDirectory(slug), "index.md");

  const markdown = await fs.readFile(markdownPath, "utf8");
  const { data, content } = matter(markdown);
  const nextData = {
    ...data,
    slug,
    published,
    updated: new Date().toISOString(),
  };

  await fs.writeFile(
    markdownPath,
    `${serializeFrontmatter(nextData)}${content.trimStart()}\n`,
    "utf8",
  );

  revalidateBlogPaths(slug);
}

// Notion'suz yeni yazı: zip import'uyla aynı slug ve frontmatter, ama taslak olarak; boş yazı sitede görünmesin.
export async function createBlog(formdata: FormData) {
  const title = formdata.get("title");
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Başlık zorunlu.");
  }

  const slug = await getAvailableSlug(title.trim());
  await fs.mkdir(path.join(blogsDirectory, slug), { recursive: true });

  const now = new Date();
  const frontmatter = createFrontmatter({
    title: title.trim(),
    slug,
    date: now.toISOString().slice(0, 10),
    updated: now.toISOString(),
    cover: null,
    published: false,
  });
  await fs.writeFile(
    path.join(blogsDirectory, slug, "index.md"),
    frontmatter,
    "utf8",
  );

  revalidateBlogPaths(slug);
  redirect(`/editor/blog/${slug}`);
}

export async function updateBlog(_prev: string | null, formdata: FormData) {
  const slug = assertSafeSlug(formdata.get("slug"));
  const title = formdata.get("title");
  const content = formdata.get("content");

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof content !== "string"
  ) {
    throw new Error("Başlık ve içerik zorunlu.");
  }

  const blogDirectory = getBlogDirectory(slug);
  const markdownPath = path.join(blogDirectory, "index.md");
  const { data } = matter(await fs.readFile(markdownPath, "utf8"));
  const coverFile = formdata.get("cover");
  let cover: string | null = typeof data.cover === "string" ? data.cover : null;

  // Yeni kapak seçilmediyse mevcut kapak korunur.
  if (coverFile instanceof File && coverFile.size > 0) {
    if (!coverFile.type.startsWith("image/")) {
      throw new Error("Kapak bir görsel olmalı.");
    }
    const nextCover = await writeCover(blogDirectory, slug, coverFile);
    // Neden: Uzantı değişince (cover.png → cover.webp) eski kapak dosyası geride kalmasın; yalnızca bu yazının
    // klasöründeki cover.* dosyası silinir.
    if (
      cover &&
      cover !== nextCover &&
      cover.startsWith(`/blogs/${slug}/cover.`)
    ) {
      await fs.rm(path.join(blogDirectory, path.basename(cover)), {
        force: true,
      });
    }
    cover = nextCover;
  }

  const nextData = {
    ...data,
    title: title.trim(),
    cover,
    updated: new Date().toISOString(),
  };

  // Neden: Tarayıcı form metnini CRLF ile gönderiyor; dosyalar LF kalmalı. Gövde olduğu gibi yazılır ki
  // dokunulmamış içerik dosyada değişmesin.
  const markdown = `${serializeFrontmatter(nextData)}${content.replace(/\r\n?/g, "\n")}`;
  await fs.writeFile(markdownPath, markdown, "utf8");

  // Neden: Editörde yüklenip vazgeçilen veya değiştirilen görseller artık metinde geçmiyor.
  await removeUnreferencedAssets(
    blogDirectory,
    `/blogs/${slug}/assets/`,
    markdown,
  );

  revalidateBlogPaths(slug);
  revalidatePath(`/editor/blog/${slug}`);
  return "Blog kaydedildi";
}

export async function deleteBlog(formdata: FormData) {
  const slug = assertSafeSlug(formdata.get("slug"));

  await fs.rm(getBlogDirectory(slug), { recursive: true, force: true });
  revalidateBlogPaths(slug);
}
