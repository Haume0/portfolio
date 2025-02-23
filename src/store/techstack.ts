import { create } from 'zustand'

interface ITech {
  id: string;
  name: string;
}
interface ITechStore {
  techs: ITech[];
}

const useTechs = create<ITechStore>(() => ({
  techs: [
    {
      id: "vscode",
      name: "VS Code"
    },
    {
      id: "go",
      name: "Go"
    },
    {
      id: "react",
      name: "React"
    },
    {
      id: "next",
      name: "Next"
    },
    {
      id: "tailwind",
      name: "Tailwind"
    },
    {
      id: "typescript",
      name: "TypeScript"
    },
    {
      id: "figma",
      name: "Figma"
    },
  ]
}))

export default useTechs