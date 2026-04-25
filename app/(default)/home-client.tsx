"use client";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useProjects from "@/store/projects";
import useSocials from "@/store/socials";
import useTechs from "@/store/techstack";
import { useContact } from "@/components/contact";
import DragWrapper from "@/components/drag-component";
import Slider from "@/components/slider";
import TechCard from "@/components/tech-card";
import WorkCard from "@/components/work-card";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import type { BlogPost } from "@/lib/blogs";

export default function HomeClient({ blogs }: { blogs: BlogPost[] }) {
    const contact = useContact();
    const techs = useTechs();
    const socials = useSocials();

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8 pt-0!">
                <section className=" bg-about overflow-hidden p-6 py-4 flex justify-between rounded-3xl size-full">
                    <Slider text="Let’s work together">
                        <button
                            onClick={() => {
                                contact.open();
                            }}
                            className="main-button"
                        >
                            Let's Talk
                        </button>
                    </Slider>
                </section>
            </div>
            <Footer />
        </>
    );
}
