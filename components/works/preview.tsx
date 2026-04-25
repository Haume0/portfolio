"use client";

import MarkdownRenderer from "../md-renderer";
import { IProject } from "@/lib/projects";
import { useEffect } from "react";
import { Icon } from "@iconify/react";

export default function WorksPreview({
    project,
    onClose,
}: {
    onClose: () => void;
    project: IProject;
}) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <>
            <section
                onClick={onClose}
                className="fixed inset-0 z-50 size-full bg-dark/80 overflow-y-auto backdrop-blur-sm p-4 sm:p-6 md:p-8"
            >
                <button className="main-button absolute right-8 top-8 text-2xl p-0! size-12! items-center justify-center flex aspect-square rounded-2xl bg-dark! hover:bg-white!">
                    <Icon icon="ion:close" />
                </button>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="max-w-6xl mx-auto flex flex-col"
                >
                    <nav className="relative flex items-center whitespace-nowrap text-sm text-light/60 mb-4">
                        <span className="text-light truncate min-w-0">
                            {project.id}
                        </span>
                        <span className="mx-2 shrink-0">•</span>
                        <span className="text-light truncate min-w-0">
                            {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                    </nav>
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <span>
                            <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-2">
                                {project.title}
                            </h1>
                            <p className="font-light text-lg sm:text-xl lg:text-2xl">
                                {project.description}
                            </p>
                        </span>
                        <a
                            href={project.link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="main-button bg-dark! hover:bg-white! shrink-0 w-max"
                        >
                            <Icon icon="ion:open-outline" />
                            {project.link.name}
                        </a>
                    </div>
                    <img
                        src={project.image || "/main.webp"}
                        alt={project.title}
                        className="w-full aspect-289/226_ object-cover rounded-2xl shadow-2xl"
                        loading="eager"
                    />
                    <article className="max-w-none mt-8 [&_img]:w-full">
                        <MarkdownRenderer content={project.content} />
                    </article>
                </div>
            </section>
        </>
    );
}
