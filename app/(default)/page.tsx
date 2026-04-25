import { getAllBlogs } from "@/lib/blogs";
import Main from "./main";
import WorksSection from "./works";
import TechSection from "./tech";
import BlogSection from "./blog/blog";
import Footer from "@/layouts/footer";
import AboutSection from "./about";
import SliderSection from "./slider-section";
import { getAllProjects } from "@/lib/projects";

export default function page() {
    const blogs = getAllBlogs({ limit: 4 });
    const projects = getAllProjects();
    return (
        <>
            <Main />
            <WorksSection projects={projects} />
            <TechSection />
            <div className="p-4 sm:p-6 md:p-8 pt-0!">
                <BlogSection blogs={blogs} limit={4} showcase />
            </div>
            <AboutSection />
            <SliderSection />
            <Footer />
        </>
    );
}
