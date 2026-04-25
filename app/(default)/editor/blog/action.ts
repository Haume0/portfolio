"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import AdmZip from "adm-zip";
import matter from "gray-matter";
import { type IBlogData, type IFileData } from "@/lib/blogs";

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
}) {
    return [
        "---",
        `title: ${JSON.stringify(data.title)}`,
        `slug: ${JSON.stringify(data.slug)}`,
        `date: ${JSON.stringify(data.date)}`,
        `updated: ${JSON.stringify(data.updated)}`,
        "published: true",
        data.cover ? `cover: ${JSON.stringify(data.cover)}` : "cover: null",
        "---",
        "",
    ].join("\n");
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

export async function addBlog(prev: any, formdata: FormData) {
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
            throw new Error(
                "Zip arşivi içinde .md uzantılı bir dosya bulunamadı.",
            );
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

            await fs.writeFile(
                path.join(assetsDirectory, assetName),
                embed.buffer,
            );
            content = replaceAssetReferences(content, embed.name, publicPath);
        }

        const thumbFile = formdata.get("thumb") as File | null;
        let cover: string | null = null;

        if (thumbFile && thumbFile.size > 0) {
            const extension =
                path.extname(thumbFile.name).toLowerCase() || ".webp";
            const coverName = `cover${extension}`;
            const coverBuffer = Buffer.from(await thumbFile.arrayBuffer());

            await fs.writeFile(
                path.join(blogDirectory, coverName),
                coverBuffer,
            );
            cover = `/blogs/${slug}/${coverName}`;
        }

        const now = new Date();
        const frontmatter = createFrontmatter({
            title: blogData.title,
            slug,
            date: now.toISOString().slice(0, 10),
            updated: now.toISOString(),
            cover,
        });

        await fs.writeFile(
            path.join(blogDirectory, "index.md"),
            frontmatter + content + "\n",
            "utf8",
        );
    } catch (error) {
        console.error("Blog eklenirken bir hata oluştu:", error);
        throw new Error(
            "Blog oluşturulamadı. Lütfen daha sonra tekrar deneyin.",
        );
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
        serializeFrontmatter(nextData) + content.trimStart() + "\n",
        "utf8",
    );

    revalidateBlogPaths(slug);
}

export async function deleteBlog(formdata: FormData) {
    const slug = assertSafeSlug(formdata.get("slug"));

    await fs.rm(getBlogDirectory(slug), { recursive: true, force: true });
    revalidateBlogPaths(slug);
}
