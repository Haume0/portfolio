import { motion, useInView } from "framer-motion";
import WorkCard from "./components/WorkCard";
import useProjects from "./store/projects";
import DragWrapper from "./components/DragWrapper";
import { useRef } from "react";
import TechCard from "./components/TechCard";
import useTechs from "./store/techstack";

function App() {
  const projects = useProjects();
  const techs = useTechs();

  // Header refs
  const headerRef1 = useRef(null);
  const headerInView1 = useInView(headerRef1, { once: true });

  const headerRef2 = useRef(null);
  const headerInView2 = useInView(headerRef2, { once: true });

  const headerRef3 = useRef(null);
  const headerInView3 = useInView(headerRef3, { once: true });

  // Section refs
  const sectionRef1 = useRef(null);
  const sectionInView1 = useInView(sectionRef1, { once: true });
  // Techs ref
  const techsRef = useRef(null);
  const techsInView = useInView(techsRef, { once: true });

  return (
    <>
      <div className="bg-body h-screen p-8">
        <main className=" bg-main p-8 flex flex-col rounded-3xl size-full">
          <header className="flex justify-between items-start" ref={headerRef1}>
            <div className="w-1/3 flex">
              <motion.span
                initial={{
                  y: "-100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                animate={headerInView1 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.5,
                }}>
                <img src="/haume.svg" alt="" />
              </motion.span>
            </div>
            <div
              className="relative flex items-center justify-center z-10"
              ref={headerRef2}>
              <motion.img
                initial={{ scale: 0, transformOrigin: "center top" }}
                animate={headerInView2 ? { scale: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 50,
                }}
                src="/glowing-star.svg"
                className="absolute min-w-[40rem] min-h-[40rem] -top-[14rem] -z-10 blur-lg"
                alt=""
              />
              <motion.img
                initial={{
                  scale: 0,
                  filter: "blur(16px)",
                  transformOrigin: "center",
                }}
                animate={headerInView2 ? { scale: 1, filter: "blur(0px)" } : {}}
                transition={{
                  type: "spring",
                  damping: 40,
                  stiffness: 140,
                }}
                src="/star.svg"
                className=" mix-blend-difference"
                alt=""
              />
            </div>
            <div className="w-1/3 flex justify-end gap-2" ref={headerRef3}>
              <motion.span
                initial={{
                  y: "-100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                animate={headerInView3 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.6,
                }}>
                <a href="#about" className="main-button">
                  Contact Me
                </a>
              </motion.span>
              <motion.span
                initial={{
                  y: "-100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                animate={headerInView3 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.5,
                }}>
                <motion.button className="main-button">
                  <svg
                    width="25"
                    height="17"
                    viewBox="0 0 25 17"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M24.7539 16.8945H0.753906V14.2279H24.7539V16.8945ZM24.7539 10.2279H0.753906V7.5612H24.7539V10.2279ZM24.7539 3.5612H0.753906V0.894531H24.7539V3.5612Z"
                      fill="currentColor"
                    />
                  </svg>
                </motion.button>
              </motion.span>
            </div>
          </header>
          <div className="mt-auto flex flex-col relative overflow-hidden items-start justify-start">
            <motion.img
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.6,
              }}
              src="/star.svg"
              alt=""
              className="h-32"
            />
            <motion.h1
              className="font-lato font-black leading-[88%] text-[11.25rem] text-milk"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.7,
              }}>
              I MAKE
            </motion.h1>
            <motion.h1
              className="font-lato font-black leading-[88%] text-[11.25rem] text-milk"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.8,
              }}>
              DREAMS COME
            </motion.h1>
            <motion.h1
              className="font-lato font-black flex w-full items-center gap-2 leading-[88%] text-[11.25rem] text-milk"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.9,
              }}>
              TRUE
              <div className="px-6 py-2 h-max bg-white mt-2 text-main font-sora rounded-[1.25rem] flex flex-col">
                <h1 className="font-bold text-[4.5rem]">Emin Erçoban</h1>
                <p className="font-extralight text-[2.5rem]">
                  Full-Stack Web Developer
                </p>
              </div>
              <img src="/signs.svg" className=" ml-auto mt-auto" alt="" />
            </motion.h1>
          </div>
        </main>
      </div>
      <div className="bg-body p-8 pt-0">
        <section className="bg-works overflow-hidden p-8 flex flex-col rounded-3xl size-full">
          <span ref={sectionRef1}></span>
          <div className="flex justify-between w-full">
            <span>
              <motion.h1
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.2,
                }}
                className="font-extrabold text-8xl">
                Selected Works
              </motion.h1>
              <motion.p
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4,
                }}
                className=" font-medium text-xl">
                Take a look at my projects ✦
              </motion.p>
              <motion.p
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.6,
                }}
                className=" font-light text-xl">
                Each project is designed to be creative and eye-catching.
              </motion.p>
              <motion.p
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                animate={sectionInView1 ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.8,
                }}
                className=" font-light text-xl">
                These designs are forged with modern technologies.
              </motion.p>
            </span>
            <span className="flex flex-col items-end gap-2">
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
                }}>
                <button className="main-button">Let's Make More</button>
              </motion.span>
              <motion.span
                initial={{
                  x: "100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                animate={sectionInView1 ? { x: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4,
                }}>
                <button className="main-button">See More</button>
              </motion.span>
            </span>
          </div>
          <DragWrapper>
            <ul className="h-max grid grid-flow-col hidden-scroll grid-rows-1 gap-4 mt-6 overflow-x-auto overflow-y-hidden">
              {projects.projects.map((project, idx) => (
                <motion.span
                  initial={{
                    transform: "scale(0.4)",
                    opacity: 0,
                    transformOrigin: "center",
                  }}
                  animate={
                    sectionInView1 ? { transform: "scale(1)", opacity: 1 } : {}
                  }
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 100,
                    delay: 0.6 + idx * 0.2,
                  }}
                  key={idx}>
                  <WorkCard
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
      <div className="bg-body p-8 pt-0">
        <section
          className=" bg-grey overflow-hidden p-8 pb-12 flex flex-col rounded-3xl size-full"
          ref={techsRef}>
          <motion.h1
            initial={{
              y: "-100%",
              opacity: 0,
            }}
            animate={techsInView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.2,
            }}
            className="font-extrabold text-8xl text-center">
            Tech I ❤️
          </motion.h1>
          <ul className="flex flex-wrap items-center justify-center gap-4 h-max mt-4 w-full">
            {techs.techs.map((tech, idx) => (
              <motion.span
                initial={{
                  transform: "scale(0.4)",
                  opacity: 0,
                  transformOrigin: "center",
                }}
                animate={
                  techsInView ? { transform: "scale(1)", opacity: 1 } : {}
                }
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4 + idx * 0.2,
                }}
                key={idx}>
                <TechCard name={tech.name} image={`/techs/${tech.id}.png`} />
              </motion.span>
            ))}
          </ul>
          <motion.p
            initial={{
              y: "-100%",
              opacity: 0,
            }}
            animate={techsInView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.4 + techs.techs.length * 0.2,
            }}
            className="font-light text-center mt-4 text-xl text-white/40">
            And there is more...
          </motion.p>
        </section>
      </div>
    </>
  );
}

export default App;
