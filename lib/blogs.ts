import fs from "fs";
import path from "path";

const blogsDirectory = path.join(process.cwd(), "public", "blogs");

type Frontmatter = Record<string, string | boolean | null>;

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    cover: string | null;
    published: boolean;
    date: string;
    updated: string;
}

export interface FileData {
    buffer: Buffer;
    name: string;
}

export interface BlogData {
    title: string;
    content: string;
    embeds: FileData[];
    mdFileFound: boolean;
}

function parseValue(value: string) {
    const trimmed = value.trim();

    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (trimmed === "null") return null;

    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }

    return trimmed;
}

export function parseFrontmatter(markdown: string) {
    if (!markdown.startsWith("---")) {
        return { data: {} as Frontmatter, content: markdown };
    }

    const end = markdown.indexOf("\n---", 3);
    if (end === -1) {
        return { data: {} as Frontmatter, content: markdown };
    }

    const rawFrontmatter = markdown.slice(3, end).trim();
    const content = markdown.slice(end + 4).trimStart();
    const data: Frontmatter = {};

    for (const line of rawFrontmatter.split(/\r?\n/)) {
        const separator = line.indexOf(":");
        if (separator === -1) continue;

        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1);
        data[key] = parseValue(value);
    }

    return { data, content };
}

function readBlog(slug: string): BlogPost | null {
    const markdownPath = path.join(blogsDirectory, slug, "index.md");

    if (!fs.existsSync(markdownPath)) {
        return null;
    }

    const markdown = fs.readFileSync(markdownPath, "utf8");
    const { data, content } = parseFrontmatter(markdown);
    const title = typeof data.title === "string" ? data.title : slug;
    const date = typeof data.date === "string" ? data.date : "";
    const updated = typeof data.updated === "string" ? data.updated : date;
    const cover = typeof data.cover === "string" ? data.cover : null;
    const published = data.published !== false;

    return {
        id: slug,
        slug,
        title,
        content,
        cover,
        published,
        date,
        updated,
    };
}

export function getAllBlogs(
    options: { includeDrafts?: boolean; limit?: number } = {},
) {
    if (!fs.existsSync(blogsDirectory)) {
        return [];
    }

    const blogs = fs
        .readdirSync(blogsDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => readBlog(entry.name))
        .filter((blog): blog is BlogPost => Boolean(blog))
        .filter((blog) => options.includeDrafts || blog.published)
        .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    return typeof options.limit === "number"
        ? blogs.slice(0, options.limit)
        : blogs;
}

export function getBlog(slug: string) {
    const blog = readBlog(slug);

    if (!blog || !blog.published) {
        return null;
    }

    return blog;
}

export function getBlogSlugs() {
    return getAllBlogs().map((blog) => blog.slug);
}
