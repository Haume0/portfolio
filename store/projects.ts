import { create } from "zustand";

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
            id: "quellstudio",
            image: "/works/quellstudio.webp",
            title: "Quell Studio",
            description: "The website I built for CharmQuell's game studio.",
            link: { name: "Visit", url: "https://quellstudios.com/" },
        },
        {
            id: "oyunlayici",
            image: "/works/oyunlayici.webp",
            title: "Oyunlayıcı Website",
            description: "A Re-Design of Oyunlayici Hosting's Website.",
            link: { name: "Visit", url: "https://oyunlayici.com/" },
        },
        {
            id: "seaviptravel",
            image: "/works/seaviptravel.png",
            title: "Sea VIP Travel",
            description:
                "A website offering VIP Transfer services. I was responsible for brand design, UI/UX design, and development of the website.",
            link: { name: "Visit", url: "https://seaviptravel.com" },
        },
        {
            id: "rentacart",
            image: "/works/rentacart.webp",
            title: "Rent A Cart Web Design",
            description:
                "A humorous car (grocery cart) rental site. It was a school project, so I came up with such a fun work.",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/215917075/Rent-A-Cart",
            },
        },
        {
            id: "lofodo",
            image: "/works/lofodo.webp",
            title: "LOFODO",
            description:
                "Customizable Pomodoro Timer that i built for learning project.",
            link: { name: "Visit", url: "https://lofodo.haume.me" },
        },
        {
            id: "limelauncher",
            image: "/works/limelauncher.webp",
            title: "CraftLime Launcher",
            description:
                "Premium Minecraft Launcher for CraftLime Minecraft Server.",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/215921483/CraftLime-Launcher",
            },
        },
        {
            id: "basolauncher",
            image: "/works/basolauncher.webp",
            title: "Baso Launcher",
            description: "Premium Minecraft Launcher for Baso Network.",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/194630849/Baso-Minecraft-Launcher",
            },
        },
        {
            id: "kadimlauncher",
            image: "/works/kadimlauncher.webp",
            title: "Kadim Launcher Theme",
            description: "Premium Minecraft Launcher Theme",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/194633591/Kadim-Minecraft-Launcher",
            },
        },
        {
            id: "paperlauncher",
            image: "/works/paperlauncher.webp",
            title: "Papyrus Launcher Theme",
            description: "Premium Minecraft Launcher Theme",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/195096833/Papyrus-Launcher-Theme",
            },
        },
        {
            id: "elesyalauncher",
            image: "/works/elesyalauncher.webp",
            title: "Papyrus Launcher Theme",
            description: "Premium Minecraft Launcher Theme",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/194632301/Elsya-Minecraft-Launcher",
            },
        },
        {
            id: "obglobal",
            image: "/works/obglobal.png",
            title: "Obglobal Website",
            description:
                "A rent a car website. That i developt for a client. (not my design only code)",
            link: { name: "Visit", url: "https://obcarservice.com/" },
        },
        {
            id: "bilentropy",
            image: "/works/bilentropy.png",
            title: "Bilentropy Magazine",
            description:
                "A fictional popular science magazine, this is a school project but I think it's cool and I had a lot of fun.",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/213763703/Bilentropy-Popueler-Bilim-Dergisi",
            },
        },
        {
            id: "haumebranding",
            image: "/works/haumebranding.png",
            title: "Haume Brand Identity",
            description:
                "A brand identity for myself, a school projectt but cool. (currently not using)",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/194982797/Haume-Branding",
            },
        },
        {
            id: "pal",
            image: "/works/pal.webp",
            title: "The Pal App",
            description:
                "A social media app for adventurers, one of my old ideas that was always in the back of my mind. I designed it when we had a UI design work in school.",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/197091485/The-Pal-App",
            },
        },
        {
            id: "mackbear-banner-design",
            image: "/works/mackbear-banner-design.webp",
            title: "Mackbear Coffee Advertisement",
            description: "Advertisement banner for Mackbear Coffee Co.",
            link: {
                name: "Look",
                url: "https://www.behance.net/gallery/184409237/Mackbear-Banner-Design",
            },
        },
    ],
}));

export default useProjects;
