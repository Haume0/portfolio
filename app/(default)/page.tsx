import { getAllBlogs } from "@/lib/blogs";
import Main from "./main";
import WorksSection from "./works";
import TechSection from "./tech";
import BlogSection from "./blog/blog";
import Footer from "@/layouts/footer";
import Slider from "@/components/slider";
import AboutSection from "./about";

export default function page() {
    const blogs = getAllBlogs({ limit: 4 });
    return (
        <>
            <Main />
            <WorksSection />
            <TechSection />
            <div className="p-4 sm:p-6 md:p-8 pt-0!">
                <BlogSection blogs={blogs} limit={4} showcase />
            </div>
            <AboutSection />
            <div className="p-4 sm:p-6 md:p-8 pt-0!">
                <section className=" bg-about overflow-hidden p-6 py-4 flex justify-between rounded-3xl size-full">
                    <Slider text="Let’s work together">
                        <button className="main-button">Let's Talk</button>
                    </Slider>
                </section>
            </div>
            <Footer />
        </>
    );
}
