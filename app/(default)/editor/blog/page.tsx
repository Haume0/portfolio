import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import BlogSection from "../../blog/blog";
import { getAllBlogs } from "@/lib/blogs";
import AddBlogForm from "./form";

export default function Blogs() {
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
            </div>

            <Footer />
        </>
    );
}
