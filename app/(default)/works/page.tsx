import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getAllProjects } from "@/lib/projects";
import SliderSection from "../slider-section";
import WorksIndex from "./works-index";

export default function Works() {
  const projects = getAllProjects();

  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
        <WorksIndex projects={projects} />
      </div>
      <SliderSection />
      <Footer />
    </>
  );
}
