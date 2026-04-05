import { create } from "zustand";

interface ITech {
    id: string;
    name: string;
}
interface ITechStore {
    techs: ITech[];
    tags: string[];
}

const useTechs = create<ITechStore>(() => ({
    techs: [
        {
            id: "zed",
            name: "Zed Editor",
        },
        {
            id: "go",
            name: "Go",
        },
        {
            id: "typescript",
            name: "TypeScript",
        },
        {
            id: "next",
            name: "Next",
        },
        {
            id: "react",
            name: "React",
        },
        {
            id: "svelte",
            name: "Svelte",
        },
        {
            id: "motion",
            name: "Framer Motion",
        },
        {
            id: "tailwind",
            name: "Tailwind",
        },
        {
            id: "figma",
            name: "Figma",
        },
        {
            id: "affinity",
            name: "Affinity Studio",
        },
    ],
    tags: [
        "UI&UX Design",
        "Graphic Design",
        "Brand Identity",
        "Full-Stack",
        "Web Development",
        "App Development",
    ],
}));

export default useTechs;
