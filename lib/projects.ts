import fs from "fs";
import path from "path";
import matter from "gray-matter";

const worksDirectory = path.join(process.cwd(), "public", "works");

interface IProjectFrontmatter {
    image: string;
    title: string;
    description: string;
    object?: string;
    linkName: string;
    linkUrl: string;
    published: boolean;
    createdAt: string;
    updated: string;
}

interface IGetAllProjectsOptions {
    includeDrafts?: boolean;
    limit?: number;
}

export interface IProject {
    id: string;
    image: string;
    title: string;
    description: string;
    object?: string;
    link: {
        name: string;
        url: string;
    };
    content: string;
    published: boolean;
    createdAt: string;
    updated: string;
}

function readProject(id: string): IProject | null {
    const markdownPath = path.join(worksDirectory, id, "index.md");

    if (!fs.existsSync(markdownPath)) {
        return null;
    }

    const markdown = fs.readFileSync(markdownPath, "utf8");
    const { data, content } = matter(markdown);
    const frontmatter = data as IProjectFrontmatter;

    return {
        id,
        image: frontmatter.image,
        title: frontmatter.title,
        description: frontmatter.description,
        object: frontmatter.object,
        link: {
            name: frontmatter.linkName,
            url: frontmatter.linkUrl,
        },
        content,
        published: frontmatter.published,
        createdAt: frontmatter.createdAt,
        updated: frontmatter.updated,
    };
}

export function getAllProjects(
    options: IGetAllProjectsOptions = {},
): IProject[] {
    if (!fs.existsSync(worksDirectory)) {
        return [];
    }

    const projects = fs
        .readdirSync(worksDirectory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => readProject(entry.name))
        .filter((project): project is IProject => Boolean(project))
        .filter((project) => options.includeDrafts || project.published)
        .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    return typeof options.limit === "number"
        ? projects.slice(0, options.limit)
        : projects;
}

export function getProject(id: string): IProject | null {
    const project = readProject(id);

    if (!project || !project.published) {
        return null;
    }

    return project;
}
