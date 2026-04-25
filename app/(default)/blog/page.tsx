import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import BlogSection from "./blog";
import Newsletter from "@/components/newsletter";
import { getAllBlogs } from "@/lib/blogs";

export default function Blogs() {
  const blogs = getAllBlogs();

  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
        <BlogSection blogs={blogs} />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
