import { motion } from "motion/react";
import WorkCard from "./components/WorkCard";
import useProjects from "./store/projects";
import DragWrapper from "./components/DragWrapper";

function App() {
  const projects = useProjects();
  return (
    <>
      <div className="bg-body h-screen p-8">
        <main className=" bg-main p-8 flex flex-col rounded-3xl size-full">
          <header className="flex justify-between items-start">
            <div className=" w-1/3 flex">
              <motion.span
                initial={{
                  y: "-100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                animate={{ y: "0%", opacity: 1, transformOrigin: "center top" }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.5,
                }}>
                <img src="haume.svg" alt="" />
              </motion.span>
            </div>
            <div className=" relative flex items-center justify-center z-10">
              <motion.img
                initial={{ scale: 0, transformOrigin: "center top" }}
                animate={{ scale: 1, transformOrigin: "center top" }}
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
                animate={{
                  scale: 1,
                  filter: "blur(0px)",
                  transformOrigin: "center",
                }}
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
            <div className=" w-1/3 flex justify-end gap-2">
              <motion.span
                initial={{
                  y: "-100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                animate={{ y: "0%", opacity: 1, transformOrigin: "center top" }}
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
                animate={{ y: "0%", opacity: 1, transformOrigin: "center top" }}
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
      <div className="bg-body p-8">
        <section className=" bg-works overflow-hidden p-8 flex flex-col rounded-3xl size-full">
          <div className="flex justify-between w-full">
            <span>
              <motion.h1
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                whileInView={{
                  y: "0%",
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1,
                }}
                className="font-extrabold text-8xl">
                Selected Works
              </motion.h1>
              <motion.p
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                whileInView={{
                  y: "0%",
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1.2,
                }}
                className=" font-medium text-xl">
                Take a look at my projects ✦
              </motion.p>
              <motion.p
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                whileInView={{
                  y: "0%",
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1.4,
                }}
                className=" font-light text-xl">
                Each project is designed to be creative and eye-catching.
              </motion.p>
              <motion.p
                initial={{
                  y: "-100%",
                  opacity: 0,
                }}
                whileInView={{
                  y: "0%",
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1.6,
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
                whileInView={{
                  x: "0%",
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1,
                }}>
                <button className="main-button">Let's Make More</button>
              </motion.span>
              <motion.span
                initial={{
                  x: "100%",
                  opacity: 0,
                  transformOrigin: "center top",
                }}
                whileInView={{
                  x: "0%",
                  opacity: 1,
                  transformOrigin: "center top",
                }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1.2,
                }}>
                <button className="main-button">See More</button>
              </motion.span>
            </span>
          </div>
          <DragWrapper>
            <div className="size-full grid grid-flow-col hidden-scroll grid-rows-1 overflow-y-hidden h-max gap-4 mt-6 overflow-x-auto">
              {projects.projects.map((project, idx) => (
                <motion.span
                  initial={{
                    y: "40%",
                    opacity: 0,
                    transformOrigin: "center top",
                  }}
                  whileInView={{
                    y: "0%",
                    opacity: 1,
                    transformOrigin: "center top",
                  }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 100,
                    delay: 1 + idx * 0.2,
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
            </div>
          </DragWrapper>
        </section>
      </div>
    </>
  );
}

export default App;
