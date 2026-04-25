import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getAllBlogs } from "@/lib/blogs";
import Link from "next/link";

const editorSections = [
    {
        title: "Blog",
        description:
            "Notion export dosyalarını içeri al, yazıları yayına al veya taslakta tut.",
        href: "/editor/blog",
        status: "Aktif",
        action: "Blog Yönet",
    },
    {
        title: "Works",
        description:
            "Projeleri, case study içeriklerini ve vitrin sıralamasını yönetmek için hazır alan.",
        href: "#",
        status: "Yakında",
        action: "Planlandı",
        disabled: true,
    },
    {
        title: "Content",
        description:
            "Ana sayfa metinleri, teknoloji listesi ve küçük içerik blokları için genişleme noktası.",
        href: "#",
        status: "Yakında",
        action: "Beklemede",
        disabled: true,
    },
];

export default function EditorPage() {
    const blogs = getAllBlogs({ includeDrafts: true });
    const publishedBlogs = blogs.filter((blog) => blog.published).length;
    const draftBlogs = blogs.length - publishedBlogs;

    return (
        <>
            <div className="p-4 space-y-6 sm:p-6 md:p-8">
                <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
                    <Header hideStar />
                </div>

                <section className="bg-main overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full gap-12 relative">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <span>
                            <img
                                src="/star.svg"
                                alt=""
                                className="mb-4 h-16 sm:h-24"
                            />
                            <h1 className="font-extrabold text-6xl sm:text-8xl lg:text-9xl leading-[88%]">
                                Editor Panel
                            </h1>
                            <p className="font-medium text-lg sm:text-xl mt-4">
                                Site içeriklerini tek yerden yönet. ✦
                            </p>
                            <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                                Şimdilik blog aktif. Sonra works, ana sayfa
                                içerikleri ve diğer küçük modüller buraya aynı
                                düzenle eklenebilir.
                            </p>
                        </span>
                    </div>
                </section>

                <section className="bg-grey overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full gap-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between w-full">
                        <span>
                            <h2 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl">
                                Modules
                            </h2>
                            <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                                Aktif ve planlanan editör bölümleri. Yeni içerik
                                tipi geldiğinde sadece yeni kart eklemek
                                yeterli.
                            </p>
                        </span>
                        <Link
                            href="/editor/blog"
                            className="main-button bg-dark! hover:bg-white! hover:text-black!"
                        >
                            Blog Import
                        </Link>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {editorSections.map((section) => {
                            const content = (
                                <article
                                    className={`group flex min-h-72 flex-col overflow-hidden rounded-3xl p-4 sm:p-6 ease-smooth duration-500 ${
                                        section.disabled
                                            ? "bg-body text-white/50"
                                            : "bg-dark text-white"
                                    }`}
                                >
                                    <span className="flex items-start justify-between gap-4">
                                        <img
                                            src="/star.svg"
                                            alt=""
                                            className="h-8"
                                        />
                                    </span>

                                    <span className="mt-auto">
                                        <h3 className="font-extrabold text-4xl sm:text-6xl">
                                            {section.title}
                                        </h3>
                                        <p className="mt-3 text-lg font-light leading-snug text-white/60">
                                            {section.description}
                                        </p>
                                        <span
                                            className={`mt-6 flex h-14 w-max items-center justify-center rounded-xl px-5 text-base font-medium sm:text-xl ${
                                                section.disabled
                                                    ? "bg-dark text-white/40"
                                                    : "bg-body text-white group-hover:bg-white group-hover:text-black"
                                            }`}
                                        >
                                            {section.action}
                                        </span>
                                    </span>
                                </article>
                            );

                            return section.disabled ? (
                                <div key={section.title}>{content}</div>
                            ) : (
                                <Link key={section.title} href={section.href}>
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}
