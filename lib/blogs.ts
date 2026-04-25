import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogsDirectory = path.join(process.cwd(), "public", "blogs");

interface IBlogFrontmatter {
    title: string;
    cover?: string;
    published: boolean;
    date: string;
    updated: string;
}

interface IGetAllBlogsOptions {
    includeDrafts?: boolean;
    limit?: number;
}

export interface IBlog {
    id: string;
    slug: string;
    title: string;
    content: string;
    cover: string | null;
    published: boolean;
    date: string;
    updated: string;
}

export interface IFileData {
    buffer: Buffer;
    name: string;
}

export interface IBlogData {
    title: string;
    content: string;
    embeds: IFileData[];
    mdFileFound: boolean;
}

function readBlog(slug: string): IBlog | null {
    const markdownPath = path.join(blogsDirectory, slug, "index.md");

    if (!fs.existsSync(markdownPath)) {
        return null;
    }

    const markdown = fs.readFileSync(markdownPath, "utf8");
    const { data, content } = matter(markdown);
    const frontmatter = data as IBlogFrontmatter;

    return {
        id: slug,
        slug,
        title: frontmatter.title,
        content,
        cover: frontmatter.cover || null,
        published: frontmatter.published,
        date: frontmatter.date,
        updated: frontmatter.updated,
    };
}

export function getAllBlogs(
    options: IGetAllBlogsOptions = {},
): IBlog[] {
    if (!fs.existsSync(blogsDirectory)) {
        return [];
    }

    const blogs = fs
        .readdirSync(blogsDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => readBlog(entry.name))
        .filter((blog): blog is IBlog => Boolean(blog))
        .filter((blog) => options.includeDrafts || blog.published)
        .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    return typeof options.limit === "number"
        ? blogs.slice(0, options.limit)
        : blogs;
}

export function getBlog(slug: string): IBlog | null {
    const blog = readBlog(slug);

    if (!blog || !blog.published) {
        return null;
    }

    return blog;
}

export function getBlogSlugs(): string[] {
    return getAllBlogs().map((blog) => blog.slug);
}
