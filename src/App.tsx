import { AnimatePresence, motion, useInView } from "framer-motion";
import WorkCard from "./components/WorkCard";
import useProjects from "./store/projects";
import DragWrapper from "./components/DragWrapper";
import { useEffect, useRef, useState } from "react";
import TechCard from "./components/TechCard";
import useTechs from "./store/techstack";
import Slider from "./components/Slider";
import useSocials from "./store/socials";
import Contact from "./components/Contact";
import FanList from "./components/FanList";

function App() {
  const projects = useProjects();
  const techs = useTechs();
  const socials = useSocials();
  const [contactModal, setContactModal] = useState(false);
  const [navModal, setNavModal] = useState(false);
  const [background, setBackground] = useState(false);
  const [seeMore, setSeeMore] = useState(false);

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
  // About ref
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true });
  // Footer ref
  const footerRef = useRef(null);
  const footerInView = useInView(footerRef, { once: true });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(`.navModal`)) {
        setNavModal(false);
      }
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
      <div className="bg-body p-4 sm:p-6 md:p-8 min-h-dvh flex">
        <main className="bg-main p-4 sm:p-6 md:p-8 overflow-clip flex flex-col rounded-3xl w-full relative">
          <div className="snow"></div>
          <AnimatePresence>
            <motion.img
              initial={{
                filter: "blur(48px)",
                scale: 0.6,
                opacity: 0,
                borderRadius: "50%",
              }}
              animate={{
                filter: background ? "blur(0px)" : "blur(48px)",
                scale: background ? 1 : 0.6,
                opacity: background ? 1 : 0,
                borderRadius: background ? "0%" : "50%",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              src="/main.webp"
              alt="Emin Erçoban Haume Background Image"
              className={`absolute size-full object-cover object-center inset-0`}
            />
          </AnimatePresence>
          <header
            className="flex relative justify-between items-start"
            ref={headerRef1}>
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
                <img src="/haume.svg" alt="Emin Haume Erçoban logo" />
              </motion.span>
            </div>
            <div
              className="relative flex pointer-events-none items-center justify-center z-10"
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
                className="absolute min-w-[36rem] lg:min-w-[40rem] min-h-[36rem] lg:min-h-[40rem] -top-[14rem] -z-10 blur-lg"
                alt="spica star"
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
                className=" mix-blend-difference size-24 lg:size-32"
                alt="star image"
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
                <button
                  title="Emin Erçoban"
                  onClick={() => {
                    setContactModal(true);
                  }}
                  className="main-button hidden! sm:flex!">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5"
                    viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"
                    />
                  </svg>
                  Contact Me
                </button>
              </motion.span>
              <motion.span
                className="relative"
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
                <FanList
                  show={navModal}
                  button={
                    <motion.button
                      aria-label="Menu Button"
                      onClick={() => {
                        setNavModal(!navModal);
                      }}
                      className={`size-16 navModal shrink-0 gap-2 flex items-center justify-center text-white bg-body rounded-xl font-medium text-xl font-sora ease-smooth duration-1000 ${
                        navModal &&
                        "bg-white! rounded-[2rem]! rotate-90! text-black!"
                      }`}>
                      {!navModal ? (
                        <motion.svg
                          width="25"
                          height="17"
                          viewBox="0 0 25 17"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.3 }}>
                          <path
                            d="M24.7539 16.8945H0.753906V14.2279H24.7539V16.8945ZM24.7539 10.2279H0.753906V7.5612H24.7539V10.2279ZM24.7539 3.5612H0.753906V0.894531H24.7539V3.5612Z"
                            fill="currentColor"
                          />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                          transition={{ duration: 0.3 }}>
                          <path
                            fill="currentColor"
                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                          />
                        </motion.svg>
                      )}
                    </motion.button>
                  }>
                  <a href="#" className="main-button">
                    Home
                  </a>
                  <a href="#works" className="main-button">
                    Works
                  </a>
                  <a href="#about" className="main-button">
                    About
                  </a>
                  <button
                    onClick={() => {
                      setContactModal(true);
                    }}
                    className="main-button sm:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5"
                      viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"
                      />
                    </svg>
                    Contact Me
                  </button>
                </FanList>
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
              alt="star icon"
              className="h-20 sm:h-28 2xl:h-32"
            />
            <motion.h1
              className="font-lato font-black text-nowrap leading-[88%] text-7xl sm:text-[9rem] 2xl:text-[11.25rem] text-white"
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
              className="font-lato font-black leading-[88%] text-7xl sm:text-[9rem] xl:text-[11.25rem] text-white"
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
              className="font-lato font-black flex flex-col items-start sm:items-center sm:flex-row w-full gap-2 leading-[88%] text-7xl sm:text-[9rem] 2xl:text-[11.25rem] text-white"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.9,
              }}>
              TRUE
              <div
                className={`px-6 py-2 h-max bg-white mt-2 font-sora rounded-[1.25rem] flex flex-col ${
                  background ? "text-black" : "text-main"
                }`}>
                <h1 className="font-bold text-4xl sm:text-[2.8rem] ease-smooth duration-500 sm:leading-[1.2] md:leading-none md:text-[4.5rem]">
                  Emin Erçoban
                </h1>
                <p className="font-extralight text-lg sm:text-[1.8rem] sm:leading-[1.2] md:leading-none md:text-[2.5rem]">
                  Full-Stack Web Developer
                </p>
              </div>
            </motion.h1>
            <img
              onClick={() => {
                setBackground(!background);
              }}
              src="/signs.svg"
              className=" sm:absolute right-0 bottom-0 ml-auto mt-2 h-5 sm:h-7 2xl:h-9"
              alt="signs"
            />
          </div>
        </main>
      </div>
      <div className="bg-body p-4 sm:p-6 md:p-8 pt-0">
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
                className="font-extrabold md:text-8xl">
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
                className=" font-medium text-lg sm:text-xl">
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
                className=" font-light text-xl">
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
                className=" font-light text-xl">
                These designs are forged with modern technologies.
              </motion.p>
            </span>
            <span className="flex sm:flex-col items-end gap-2">
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
                <button
                  onClick={() => {
                    setContactModal(true);
                  }}
                  className="main-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5"
                    viewBox="0 0 24 24">
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
                animate={sectionInView1 ? { x: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4,
                }}>
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
                        }}>
                        <a
                          href={socials.getSocial("GitHub")?.url}
                          target="_blank"
                          className="main-button">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8"
                            viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                            />
                          </svg>
                          Github
                        </a>
                      </motion.span>
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
                          delay: 0.2,
                        }}>
                        <a
                          href={socials.getSocial("Behance")?.url}
                          target="_blank"
                          className="main-button">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8"
                            viewBox="0 0 24 24">
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
                      className="flex gap-2">
                      <button
                        onClick={() => {
                          setSeeMore(true);
                        }}
                        className="main-button">
                        ✦ See More
                      </button>
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* ENDELEMENT */}
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
      <div className="bg-body p-4 sm:p-6 md:p-8 pt-0">
        <section
          className=" bg-grey overflow-hidden p-4 sm:p-6 md:p-8 pb-12 flex flex-col rounded-3xl size-full"
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
            className="font-extrabold text-6xl sm:text-7xl md:text-8xl text-center">
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
                key={idx}
                style={{ zIndex: techs.techs.length - idx }}>
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
      <div className="bg-body p-4 sm:p-6 md:p-8 pt-0">
        <section
          className="bg-about overflow-hidden gap-12 p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-7 rounded-3xl size-full"
          ref={aboutRef}>
          <div className="flex col-span-1 lg:col-span-4 flex-col gap-4">
            <motion.h1
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={aboutInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
              id="about"
              className="font-extrabold text-5xl sm:text-7xl lg:text-8xl">
              About Me
            </motion.h1>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={aboutInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.4,
              }}
              className="font-light text-lg md:text-xl">
              Hello, I'm Emin Erçoban a full stack web developer & designer in
              Turkey. My goal is to enhance projects and applications with
              creative design and modern technologies.
            </motion.p>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={aboutInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.6,
              }}
              className="font-light text-lg md:text-xl">
              I currently work with my best friend on Fiverr and Bionluk as a
              freelancer selling websites, desktop applications and Minecraft
              launcher. We plan to develop our own projects and launch a
              start-up in addition to these jobs.
            </motion.p>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={aboutInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.8,
              }}
              className="font-light text-lg md:text-xl">
              It has been about 3 years since I started design and software, I
              am a self-taught software developer, but in 2023 I started
              studying in an associate degree program to learn something,
              although I stayed a little ahead, I met very nice people, my
              current goal is to switch to a bachelor program and get my
              license.
            </motion.p>
          </div>
          <motion.div
            initial={{
              transform: "scale(0.4)",
              opacity: 0,
              transformOrigin: "center",
            }}
            animate={aboutInView ? { transform: "scale(1)", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 1,
            }}
            className="flex rounded-2xl col-span-1 lg:col-span-3 items-center justify-center flex-col bg-dark p-8 gap-3">
            <img
              src="/profile.jpeg"
              className="w-32 md:w-48 lg:w-64 aspect-square rounded-3xl"
              alt=""
            />
            <h1 className="font-extrabold text-center text-4xl md:text-5xl lg:text-6xl">
              Emin Erçoban
            </h1>
            <p className="font-light text-center text-xl md:text-2xl lg:text-3xl">
              Full-Stack Developer & Designer
            </p>
            <ul className="grid grid-cols-2 grid-rows-2 sm:flex sm:flex-wrap items-center justify-center gap-2">
              {socials.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  className="main-button w-full! sm:w-max!">
                  {social.name}
                </a>
              ))}
            </ul>
          </motion.div>
        </section>
      </div>
      <div className="bg-body p-4 sm:p-6 md:p-8 pt-0">
        <section className=" bg-about overflow-hidden p-6 py-4 flex justify-between rounded-3xl size-full">
          <Slider text="Let’s work together">
            <button
              onClick={() => {
                setContactModal(true);
              }}
              className="main-button">
              Let's Talk
            </button>
          </Slider>
        </section>
      </div>
      <div className="bg-body p-4 sm:p-6 md:p-8 pt-0">
        <footer
          className=" bg-dark overflow-hidden gap-12 p-8 grid grid-cols-1 sm:grid-cols-2 grid-flow-row md:flex md:justify-between rounded-3xl size-full"
          ref={footerRef}>
          <motion.div
            initial={{
              transform: "scale(0.4)",
              opacity: 0,
              transformOrigin: "center",
            }}
            animate={footerInView ? { transform: "scale(1)", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.2,
            }}
            className="flex flex-col items-start justify-start">
            <img src="/haume.svg" className=" h-14" alt="" />
            <p className="text-xl">Interstellar web developer.</p>
            <p className="font-thin text-white/40">© 2024 ✦ Emin Erçoban</p>
            <p className="font-thin text-white/40 mt-1">
              Team member of{" "}
              <a
                href="https://cubidron.com"
                target="_blank"
                className="hover:underline font-normal hover:text-main">
                Cubidron
              </a>
            </p>
          </motion.div>
          <motion.div
            initial={{
              transform: "scale(0.4)",
              opacity: 0,
              transformOrigin: "center",
            }}
            animate={footerInView ? { transform: "scale(1)", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.4,
            }}
            className="flex flex-col items-start justify-start">
            <img src="/star.svg" className=" h-9" alt="" />
            <p className="text-lg sm:text-xl font-extrabold">
              Leave me a story.
            </p>
            <a
              href="mailto:haume341@outlook.com?subject=There%20is%20your%20story.&body=Write%20your%20story%20here..."
              className="font-extralight text-xl sm:text-3xl">
              haume341@outlook.com
            </a>
          </motion.div>
          <motion.div
            initial={{
              transform: "scale(0.4)",
              opacity: 0,
              transformOrigin: "center",
            }}
            animate={footerInView ? { transform: "scale(1)", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.6,
            }}
            className="flex flex-col items-start min-w-48 justify-start">
            <p className="text-lg sm:text-xl">Navigation</p>
            <a
              href="#"
              className="font-extralight text-base hover:underline hover:text-main">
              Home
            </a>
            <a
              href="#works"
              className="font-extralight text-base hover:underline hover:text-main">
              Works
            </a>
            <a
              href="#about"
              className="font-extralight text-base hover:underline hover:text-main">
              About
            </a>
          </motion.div>
          <motion.div
            initial={{
              transform: "scale(0.4)",
              opacity: 0,
              transformOrigin: "center",
            }}
            animate={footerInView ? { transform: "scale(1)", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.8,
            }}
            className="flex flex-col items-start min-w-48 justify-start">
            <p className="text-lg sm:text-xl">Socials</p>
            {socials.socials.map((social, i) => (
              <a
                key={i}
                target="_blank"
                href={social.url}
                className="font-extralight text-base hover:underline hover:text-main">
                {social.name}
              </a>
            ))}
          </motion.div>
        </footer>
      </div>
      <AnimatePresence>
        {contactModal && (
          <motion.div
            onClick={() => setContactModal(false)}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
            className="fixed inset-0 flex cursor-zoom-out flex-col gap-4 items-center justify-center bg-black/40 size-full z-50">
            <motion.h1
              onClick={(e) => {
                e.stopPropagation();
              }}
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              whileInView={{ y: "0%", opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
              id="about"
              className="font-extrabold cursor-default text-6xl">
              Contact Me
            </motion.h1>
            <motion.span
              onClick={(e) => {
                e.stopPropagation();
              }}
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.5,
              }}>
              <Contact className="cursor-default" />
              <ul className="grid grid-cols-2 mt-2 p-2 gap-2  bg-dark rounded-2xl grid-rows-2 sm:flex sm:flex-row items-center justify-center">
                {socials.socials.map((social, i) => (
                  <a key={i} href={social.url} className="main-button w-full!">
                    {social.name}
                  </a>
                ))}
              </ul>
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
