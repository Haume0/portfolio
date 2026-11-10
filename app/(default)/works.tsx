"use client";
import { AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import * as motion from "motion/react-client";
import Link from "next/link";
import { useContact } from "@/components/contact";
import DragWrapper from "@/components/drag-component";
import WorkCard from "@/components/works/card";
import type { IProject } from "@/lib/projects";
import WorksPreview, { useInspectedProject } from "@/components/works/preview";

export default function WorksSection(props: { projects: IProject[] }) {
  const contact = useContact();

  const { inspect, open, close } = useInspectedProject(props.projects);

  const sectionRef1 = useRef(null);
  const sectionInView1 = useInView(sectionRef1, { once: true });
  return (
    <div className="p-4 sm:p-6 md:p-8 pt-0!">
      <AnimatePresence>
        {inspect && (
          <WorksPreview key={inspect.id} onClose={close} project={inspect} />
        )}
      </AnimatePresence>
      <section className="bg-works overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
        <span ref={sectionRef1}></span>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
          <span>
            <motion.h1
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
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
              animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
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
              animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.6,
              }}
              className=" font-light text-xl"
            >
              Each project is designed to be creative and eye-catching.
            </motion.p>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
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
              animate={sectionInView1 ? { x: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  contact.open({
                    title: "💡 I want to work with you!",
                  });
                }}
                className="main-button"
              >
                <svg
                  aria-hidden="true"
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
              initial={{
                x: "100%",
                opacity: 0,
              }}
              animate={sectionInView1 ? { x: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.4,
              }}
            >
              <Link href="/works" className="main-button">
                ✦ See More
              </Link>
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
                  onInspect={() => open(project)}
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
