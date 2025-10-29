"use client";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import BlogSection from "./blog";
import Newsletter from "@/components/newsletter";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string | null;
  is_published: boolean;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  embeds: string[];
}

export default function Blogs() {
  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
        <BlogSection />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
