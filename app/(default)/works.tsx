"use client";
import { AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import * as motion from "motion/react-client";
import ExpandingButton from "@/components/expanding-button";
import useSocials from "@/store/socials";
import { useContact } from "@/components/contact";
import DragWrapper from "@/components/drag-component";
import useProjects from "@/store/projects";
import WorkCard from "@/components/work-card";
import { getAllProjects } from "@/lib/projects";

export default function WorksSection(props: { projects: any }) {
    // const projects = useProjects();
    const sectionRef1 = useRef(null);
    const sectionInView1 = useInView(sectionRef1, { once: true });
    const socials = useSocials();
    const contact = useContact();
    return (
        <div className="p-4 sm:p-6 md:p-8 pt-0!">
            <section className="bg-works overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
                <span ref={sectionRef1}></span>
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
                    <span>
                        <motion.h1
                            initial={{
                                y: "-40%",
                                opacity: 0,
                            }}
                            animate={
                                sectionInView1 ? { y: "0%", opacity: 1 } : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.2,
                            }}
                            id="works"
                            className="font-extrabold text-5xl sm:text-7xl lg:text-8xl"
                        >
                            Selected Works
                        </motion.h1>
                        <motion.p
                            initial={{
                                y: "-40%",
                                opacity: 0,
                            }}
                            animate={
                                sectionInView1 ? { y: "0%", opacity: 1 } : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.4,
                            }}
                            className=" font-medium text-lg sm:text-xl"
                        >
                            Take a look at my projects ✦
                        </motion.p>
                        <motion.p
                            initial={{
                                y: "-40%",
                                opacity: 0,
                            }}
                            animate={
                                sectionInView1 ? { y: "0%", opacity: 1 } : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.6,
                            }}
                            className=" font-light text-xl"
                        >
                            Each project is designed to be creative and
                            eye-catching.
                        </motion.p>
                        <motion.p
                            initial={{
                                y: "-40%",
                                opacity: 0,
                            }}
                            animate={
                                sectionInView1 ? { y: "0%", opacity: 1 } : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.8,
                            }}
                            className=" font-light text-xl"
                        >
                            These designs are forged with modern technologies.
                        </motion.p>
                    </span>
                    <span className="flex sm:flex-col overflow-x-auto hidden-scroll items-end gap-2">
                        <motion.span
                            initial={{
                                x: "100%",
                                opacity: 0,
                            }}
                            animate={
                                sectionInView1 ? { x: "0%", opacity: 1 } : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.2,
                            }}
                        >
                            <button
                                onClick={() => {
                                    contact.open({
                                        title: "💡 I want to work with you!",
                                    });
                                }}
                                className="main-button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"
                                    />
                                </svg>
                                Let's Make More
                            </button>
                        </motion.span>
                        <motion.span
                            className="flex gap-2 seeMore"
                            initial={{
                                x: "100%",
                                opacity: 0,
                                transformOrigin: "center top",
                            }}
                            animate={
                                sectionInView1 ? { x: "0%", opacity: 1 } : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.4,
                            }}
                        >
                            <ExpandingButton
                                button={
                                    <motion.span
                                        key={0}
                                        initial={{
                                            scale: 0.8,
                                            opacity: 0,
                                        }}
                                        exit={{
                                            scale: 0.8,
                                            opacity: 0,
                                        }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            damping: 30,
                                            stiffness: 300,
                                            delay: 0,
                                        }}
                                        className="flex gap-2"
                                    >
                                        <button className="main-button">
                                            ✦ See More
                                        </button>
                                    </motion.span>
                                }
                            >
                                <motion.span
                                    key={1}
                                    initial={{
                                        x: "40%",
                                        opacity: 0,
                                    }}
                                    exit={{
                                        x: "40%",
                                        opacity: 0,
                                    }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        damping: 30,
                                        stiffness: 300,
                                        delay: 0.3,
                                    }}
                                >
                                    <a
                                        href={socials.getSocial("GitHub")?.url}
                                        target="_blank"
                                        className="main-button"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                                            />
                                        </svg>
                                        Github
                                    </a>
                                </motion.span>
                                <motion.span
                                    key={2}
                                    initial={{
                                        x: "40%",
                                        opacity: 0,
                                    }}
                                    exit={{
                                        x: "40%",
                                        opacity: 0,
                                    }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        damping: 30,
                                        stiffness: 300,
                                        delay: 0.2,
                                    }}
                                >
                                    <a
                                        href={socials.getSocial("Behance")?.url}
                                        target="_blank"
                                        className="main-button"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M19.58 12.27c-.04-.62-.25-1.09-.62-1.41c-.37-.32-.83-.48-1.38-.48c-.58 0-1.08.17-1.39.51c-.33.34-.54.8-.62 1.38m6.35-.23c.08.41.08 1 .08 1.77h-6.5c.05.9.35 1.52.94 1.88c.35.23.78.34 1.29.34c.53 0 .96-.14 1.27-.41c.2-.15.36-.35.5-.62h2.38c-.06.54-.35 1.07-.88 1.62c-.78.88-1.9 1.3-3.34 1.3c-1.19 0-2.23-.37-3.16-1.1c-.88-.73-1.34-1.92-1.34-3.57c0-1.55.41-2.75 1.23-3.55c.82-.83 1.88-1.24 3.19-1.24c.77 0 1.47.14 2.09.42c.62.28 1.14.71 1.54 1.32c.37.53.6 1.14.71 1.84M9.58 14.07c0-.65-.27-1.1-.79-1.34c-.29-.13-.71-.2-1.25-.23H4.87v3.34H7.5c.54 0 .96-.07 1.26-.22c.55-.27.82-.79.82-1.55m-4.71-3.61H7.5c.54 0 1-.1 1.32-.31c.34-.2.5-.57.5-1.09c0-.56-.22-.96-.66-1.15c-.39-.13-.88-.19-1.47-.19H4.87m6.85 4.7c.32.5.48 1.11.48 1.82c0 .76-.2 1.4-.55 1.99a3.6 3.6 0 0 1-.88.98c-.4.29-.87.51-1.41.62c-.54.11-1.12.17-1.75.17H2V5.55h6c1.53.03 2.6.45 3.23 1.33c.38.53.57 1.16.57 1.9c0 .76-.19 1.37-.57 1.83c-.23.26-.53.5-.95.71c.63.23 1.11.6 1.44 1.1m8.34-5.1h-5.01V6.07h5.01v1.25z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Behance
                                    </a>
                                </motion.span>
                            </ExpandingButton>
                        </motion.span>
                    </span>
                </div>
                <DragWrapper>
                    <ul className="h-max grid grid-flow-col hidden-scroll grid-rows-1 gap-4 mt-6 overflow-x-auto overflow-y-hidden">
                        {props.projects.map((project, idx) => (
                            <motion.span
                                initial={{
                                    transform: "scale(0.4)",
                                    opacity: 0,
                                    transformOrigin: "center",
                                }}
                                animate={
                                    sectionInView1
                                        ? {
                                              transform: "scale(1)",
                                              opacity: 1,
                                          }
                                        : {}
                                }
                                transition={{
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 100,
                                    delay: 0.6 + idx * 0.2,
                                }}
                                key={idx}
                            >
                                <WorkCard
                                    object={project.object}
                                    id={project.id}
                                    image={project.image}
                                    title={project.title}
                                    description={project.description}
                                    link={project.link}
                                />
                            </motion.span>
                        ))}
                    </ul>
                </DragWrapper>
            </section>
        </div>
    );
}
