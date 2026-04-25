"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import AdmZip from "adm-zip";
import matter from "gray-matter";

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

function getString(formdata: FormData, key: string, fallback = "") {
    const value = formdata.get(key);
    return typeof value === "string" ? value.trim() : fallback;
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

export async function addProject(prev: string | null, formdata: FormData) {
    const rawId = getString(formdata, "id");
    const id = slugify(rawId);
    const title = getString(formdata, "title");
    const description = getString(formdata, "description");
    const object = getString(formdata, "object");
    const linkName = getString(formdata, "linkName", "Visit");
    const linkUrl = getString(formdata, "linkUrl", "#");
    const published = formdata.get("published") === "true";
    const imageFile = formdata.get("image") as File | null;
    const notionFile = formdata.get("notion") as File | null;

    if (!id || !title || !description || !linkName || !linkUrl) {
        throw new Error("Zorunlu proje bilgileri eksik.");
    }

    if (!imageFile || imageFile.size === 0) {
        throw new Error("Proje kart görseli yüklenmelidir.");
    }

    const projectDirectory = getProjectDirectory(id);
    const assetsDirectory = path.join(projectDirectory, "assets");

    try {
        await fs.mkdir(assetsDirectory, { recursive: true });

        const imageExtension = path.extname(imageFile.name).toLowerCase() || ".webp";
        const imageName = `image${imageExtension}`;
        const imagePath = `/works/${id}/${imageName}`;

        await fs.writeFile(
            path.join(projectDirectory, imageName),
            Buffer.from(await imageFile.arrayBuffer()),
        );

        const projectData: ProjectImportData = {
            content: "",
            embeds: [],
            mdFileFound: false,
        };

        if (notionFile && notionFile.size > 0) {
            collectZipEntries(
                new AdmZip(Buffer.from(await notionFile.arrayBuffer())),
                projectData,
            );
        }

        let content = projectData.content;
        const usedAssetNames = new Set<string>();

        for (const embed of projectData.embeds) {
            const assetName = getSafeAssetName(embed, usedAssetNames);
            const publicPath = `/works/${id}/assets/${encodeURIComponent(assetName)}`;

            await fs.writeFile(path.join(assetsDirectory, assetName), embed.buffer);
            content = replaceAssetReferences(content, embed.name, publicPath);
        }

        const now = new Date().toISOString();
        const frontmatter = serializeFrontmatter({
            id,
            image: imagePath,
            title,
            description,
            object,
            linkName,
            linkUrl,
            published,
            createdAt: now,
            updated: now,
        });

        await fs.writeFile(
            path.join(projectDirectory, "index.md"),
            frontmatter + content.trimStart() + "\n",
            "utf8",
        );
    } catch (error) {
        console.error("Proje eklenirken bir hata oluştu:", error);
        throw new Error("Proje oluşturulamadı.");
    }

    revalidateWorksPaths();
    return "Proje kaydedildi";
}

export async function toggleProjectPublished(formdata: FormData) {
    const id = assertSafeId(formdata.get("id"));
    const published = formdata.get("published") === "true";
    const markdownPath = path.join(getProjectDirectory(id), "index.md");
    const markdown = await fs.readFile(markdownPath, "utf8");
    const { data, content } = matter(markdown);

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
