"use client";

import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import useProjects from "@/store/projects";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useContact } from "@/components/Contact";
import socials from "@/store/socials";
import useSocials from "@/store/socials";
import { main } from "motion/react-m";
import WorkCard from "@/components/WorkCard";

export default function WorksPage() {
  const [seeMore, setSeeMore] = useState(false);

  const projects = useProjects();
  const socials = useSocials();
  const contact = useContact();

  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true });
  const mainRef = useRef(null);
  const mainInView = useInView(mainRef, { once: true });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(`.seeMore`)) {
        setSeeMore(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>{" "}
        <section className="bg-works p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
          <span ref={mainRef}></span>
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
            <span>
              <motion.h1
                initial={{
                  y: "-40%",
                  opacity: 0,
                }}
                animate={mainInView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.2,
                }}
                id="works"
                className="font-extrabold mb-2 text-5xl sm:text-7xl lg:text-8xl"
              >
                Works
              </motion.h1>
              <motion.p
                initial={{
                  y: "-40%",
                  opacity: 0,
                }}
                animate={mainInView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4,
                }}
                className=" font-medium text-lg sm:text-xl"
              >
                Take a look at my projects. ✦
              </motion.p>
              <motion.p
                initial={{
                  y: "-40%",
                  opacity: 0,
                }}
                animate={mainInView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.6,
                }}
                className=" font-light text-xl"
              >
                A selection of product, web, and brand projects I designed and
                built.
              </motion.p>
            </span>
            <span className="flex sm:flex-col items-end gap-2 overflow-hidden">
              <motion.span
                initial={{
                  x: "100%",
                  opacity: 0,
                }}
                animate={mainInView ? { x: "0%", opacity: 1 } : {}}
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
                animate={mainInView ? { x: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4,
                }}
              >
                {/* ELEMTN */}
                <AnimatePresence mode="wait">
                  {seeMore ? (
                    <>
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
                    </>
                  ) : (
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
                      <button
                        onClick={() => {
                          setSeeMore(true);
                        }}
                        className="main-button"
                      >
                        ✦ See More
                      </button>
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* ENDELEMENT */}
              </motion.span>
            </span>
          </div>
        </section>
        <section
          ref={listRef}
          className="bg-grey p-4 sm:p-6 md:p-8 rounded-3xl overflow-hidden"
        >
          <div className="">
            <motion.h2
              initial={{ y: -32, opacity: 0 }}
              animate={listInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
              className="font-extrabold text-5xl sm:text-7xl"
            >
              All Works
            </motion.h2>
            <motion.p
              initial={{ y: -32, opacity: 0 }}
              animate={listInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.35,
              }}
              className="mt-2 font-light text-lg sm:text-xl text-white/70"
            >
              Scroll through the archive and open anything that catches your
              eye.
            </motion.p>
          </div>

          <ul className="relative h-max grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4 mt-6">
            {projects.projects.map((project, idx) => (
              <WorkCard
                className="size-full!"
                key={idx}
                object={project.object}
                id={project.id}
                image={project.image}
                title={project.title}
                description={project.description}
                link={project.link}
              />
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
}
