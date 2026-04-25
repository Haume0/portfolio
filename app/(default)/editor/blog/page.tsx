import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getAllBlogs } from "@/lib/blogs";
import Link from "next/link";
import AddBlogForm from "./form";
import { toggleBlogPublished } from "./action";
import DeleteBlogButton from "./delete-button";

export default function Blogs() {
    const blogs = getAllBlogs({ includeDrafts: true });

    return (
        <>
            <div className="p-4 space-y-6 sm:p-6 md:p-8">
                <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
                    <Header hideStar />
                </div>
                <section className="bg-blog overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full gap-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between w-full">
                        <span>
                            <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl">
                                Blog Import
                            </h1>
                            <p className="font-medium text-lg sm:text-xl mt-2">
                                Notion export zip dosyasını statik blog yazısına
                                çevir. ✦
                            </p>
                            <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                                Markdown ve görseller frontmatter içeren
                                dosyalar olarak
                                <code className="mx-2 rounded-xl bg-dark px-3 py-1 text-base">
                                    public/blogs
                                </code>
                                klasörüne yazılır.
                            </p>
                        </span>
                    </div>
                    <AddBlogForm />
                </section>

                <section className="bg-grey overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full gap-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between w-full">
                        <span>
                            <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl">
                                Bloglar
                            </h1>
                            <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                                Statik blog dosyalarını buradan yayına al,
                                yayından kaldır veya tamamen sil.
                            </p>
                        </span>
                        <span className="main-button bg-dark! hover:bg-white! hover:text-black!">
                            {blogs.length} Yazı
                        </span>
                    </div>

                    {blogs.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {blogs.map((blog) => (
                                <li
                                    key={blog.slug}
                                    className="bg-dark rounded-3xl p-4 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <span className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <span className="relative flex size-32 shrink-0 overflow-hidden rounded-3xl bg-body sm:size-40">
                                            {blog.cover ? (
                                                <img
                                                    src={blog.cover}
                                                    alt={blog.title}
                                                    className="size-full object-cover object-center"
                                                />
                                            ) : (
                                                <span className="m-auto px-4 text-center font-light text-white/40">
                                                    Görsel yok
                                                </span>
                                            )}
                                        </span>

                                        <span className="flex flex-col gap-2">
                                            <span className="flex flex-wrap gap-2 items-center">
                                                <span
                                                    className={`font-light text-sm md:text-base rounded-full py-0.5 px-2 ${
                                                        blog.published
                                                            ? "bg-blog"
                                                            : "bg-body text-white/60"
                                                    }`}
                                                >
                                                    {blog.published
                                                        ? "Yayında"
                                                        : "Taslak"}
                                                </span>
                                                <span className="font-light text-sm md:text-base rounded-full bg-body py-0.5 px-2 text-white/60">
                                                    {blog.date || "Tarih yok"}
                                                </span>
                                                <span className="font-light text-sm md:text-base rounded-full bg-body py-0.5 px-2 text-white/60">
                                                    /blog/{blog.slug}
                                                </span>
                                            </span>
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                className="font-extrabold text-3xl sm:text-5xl hover:text-white/60 ease-smooth duration-300"
                                            >
                                                {blog.title}
                                            </Link>
                                            <p className="font-light text-lg md:text-xl text-white/60 line-clamp-2 max-w-4xl">
                                                {blog.content ||
                                                    "Bu blog yazısında içerik bulunamadı."}
                                            </p>
                                        </span>
                                    </span>

                                    <span className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                                        <form action={toggleBlogPublished}>
                                            <input
                                                type="hidden"
                                                name="slug"
                                                value={blog.slug}
                                            />
                                            <input
                                                type="hidden"
                                                name="published"
                                                value={
                                                    blog.published
                                                        ? "false"
                                                        : "true"
                                                }
                                            />
                                            <button className="main-button w-full! sm:w-max!">
                                                {blog.published
                                                    ? "Yayından Kaldır"
                                                    : "Yayına Al"}
                                            </button>
                                        </form>

                                        <DeleteBlogButton
                                            slug={blog.slug}
                                            title={blog.title}
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="bg-dark rounded-3xl p-4 sm:p-6">
                            <h2 className="font-extrabold text-3xl sm:text-5xl">
                                Henüz blog yok
                            </h2>
                            <p className="font-light text-lg md:text-xl mt-2 text-white/60">
                                İlk Notion zip dosyanı import ettiğinde burada
                                listelenecek.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </>
    );
}
