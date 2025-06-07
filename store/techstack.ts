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
            id: "vscode",
            name: "VS Code",
        },
        {
            id: "go",
            name: "Go Lang",
        },
        {
            id: "react",
            name: "React",
        },
        {
            id: "next",
            name: "Next",
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
            id: "typescript",
            name: "TypeScript",
        },
        {
            id: "figma",
            name: "Figma",
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
