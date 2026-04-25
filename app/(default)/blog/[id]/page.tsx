import Link from "next/link";
import { notFound } from "next/navigation";

import MarkdownRenderer from "@/components/md-renderer";
import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getBlog, getBlogSlugs } from "@/lib/blogs";

export function generateStaticParams() {
    return getBlogSlugs().map((id) => ({ id }));
}

export default async function Blog({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const blog = getBlog(id);

    if (!blog) {
        notFound();
    }

    return (
        <>
            <div className="p-4 space-y-6 sm:p-6 md:p-8 pt-0">
                <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
                    <Header hideStar />
                </div>
                <section className="bg-grey p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full min-h-2/5">
                    <div className="max-w-4xl mx-auto w-full">
                        <nav className="text-sm text-light/60 overflow-hidden mb-4">
                            <div className="flex items-center whitespace-nowrap">
                                <Link
                                    href="/"
                                    className="hover:text-light shrink-0"
                                >
                                    Home
                                </Link>
                                <span className="mx-2 shrink-0">/</span>
                                <Link
                                    href="/blog"
                                    className="hover:text-light shrink-0"
                                >
                                    Blog
                                </Link>
                                <span className="mx-2 shrink-0">/</span>
                                <span className="text-light truncate min-w-0">
                                    {blog.title}
                                </span>
                            </div>
                        </nav>
                        <h1
                            id="works"
                            className="font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-4"
                        >
                            {blog.title}
                        </h1>
                        <img
                            src={blog.cover || "/main.webp"}
                            alt={blog.title}
                            className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                            loading="eager"
                        />
                        <article className="max-w-none mt-8">
                            <MarkdownRenderer content={blog.content} />
                        </article>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}
