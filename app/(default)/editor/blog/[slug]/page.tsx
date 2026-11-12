import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getAllBlogs } from "@/lib/blogs";

import BlogEditForm from "./form";

export default async function BlogEditor(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const blog = getAllBlogs({ includeDrafts: true }).find(
    (blog) => blog.slug === slug,
  );

  if (!blog) {
    notFound();
  }

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
                Blog Edit
              </h1>
              <p className="font-medium text-lg sm:text-xl mt-2">
                {blog.title} yazısını düzenliyorsun. ✦
              </p>
              <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                Blok eklemek için “/” yaz, görselleri sürükleyip bırakabilir
                veya yapıştırabilirsin.
              </p>
            </span>
            <span className="flex flex-col sm:flex-row gap-2 sm:items-start">
              <Link
                href="/editor/blog"
                className="main-button bg-dark! hover:bg-white! hover:text-black! w-full! sm:w-max!"
              >
                Bloglar
              </Link>
              {blog.published && (
                <Link
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  className="main-button bg-dark! hover:bg-white! hover:text-black! w-full! sm:w-max!"
                >
                  Görüntüle
                </Link>
              )}
            </span>
          </div>
          <BlogEditForm blog={blog} />
        </section>
      </div>

      <Footer />
    </>
  );
}
