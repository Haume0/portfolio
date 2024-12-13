import { create } from 'zustand'

interface IProject {
  id: string;
  image: string;
  title: string;
  description: string;
  link: {
    name: string;
    url: string;
  };
}
interface IProjectStore {
  projects: IProject[];
}

const useProjects = create<IProjectStore>(() => ({
  projects: [
    {
      id: "pal",
      image: "/works/pal.png",
      title: "The Pal App",
      description: "A social media app for adventurers.",
      link: { name: "Project", url: "https://www.behance.net/gallery/197091485/The-Pal-App" }
    },
    {
      id: "bilentropy",
      image: "/works/bilentropy.png",
      title: "Bilentropy Magazine",
      description: "A magaazine about popular science.",
      link: { name: "Visit", url: "https://www.behance.net/gallery/213763703/Bilentropy-Popueler-Bilim-Dergisi" }
    },
    {
      id: "mackbear-banner-design",
      image: "/works/mackbear-banner-design.png",
      title: "Mackbear Coffe Advertisement",
      description: "A banner for Mackbear Coffe Co.",
      link: { name: "Visit", url: "https://www.behance.net/gallery/184409237/Mackbear-Banner-Design" }
    }, {
      id: "pal",
      image: "/works/pal.png",
      title: "The Pal App",
      description: "A social media app for adventurers.",
      link: { name: "Project", url: "https://www.behance.net/gallery/197091485/The-Pal-App" }
    },
    {
      id: "bilentropy",
      image: "/works/bilentropy.png",
      title: "Bilentropy Magazine",
      description: "A magaazine about popular science.",
      link: { name: "Visit", url: "https://www.behance.net/gallery/213763703/Bilentropy-Popueler-Bilim-Dergisi" }
    },
    {
      id: "mackbear-banner-design",
      image: "/works/mackbear-banner-design.png",
      title: "Mackbear Coffe Advertisement",
      description: "A banner for Mackbear Coffe Co.",
      link: { name: "Visit", url: "https://www.behance.net/gallery/184409237/Mackbear-Banner-Design" }
    },

  ]
}))

export default useProjects