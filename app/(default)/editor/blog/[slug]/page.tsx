import { notFound } from "next/navigation";

import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getAllBlogs } from "@/lib/blogs";

import EditBlogForm from "./form";

export default async function EditBlog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Taslaklar da düzenlenebilmeli; getBlog yalnızca yayındakileri döndürüyor.
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
        <section className="bg-grey p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full min-h-2/5">
          <EditBlogForm blog={blog} />
        </section>
      </div>
      <Footer />
    </>
  );
}
