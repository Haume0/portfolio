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

function App() {
  const projects = useProjects();
  const techs = useTechs();
  const socials = useSocials();
  const [contactModal, setContactModal] = useState(false);
  const [navModal, setNavModal] = useState(false);
  const [background, setBackground] = useState(false);

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
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="bg-body p-8 min-h-dvh flex">
        <main className="bg-main p-4 sm:p-6 md:p-8 overflow-clip flex flex-col rounded-3xl w-full relative">
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
              alt="background image"
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
                <img src="/haume.svg" alt="" />
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
                alt="glowing star image"
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
                  onClick={() => {
                    setContactModal(true);
                  }}
                  className="main-button !hidden sm:!block">
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
                <motion.button
                  aria-label="Menu Button"
                  onClick={() => {
                    setNavModal(!navModal);
                  }}
                  className={`size-16 navModal shrink-0 gap-2 flex items-center justify-center text-white bg-body rounded-xl font-medium text-xl font-sora ease-smooth duration-1000 ${
                    navModal &&
                    "!bg-white !rounded-[2rem] !rotate-90 !text-black"
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
                {/* nav modal */}
                <AnimatePresence>
                  {navModal && (
                    <div className=" absolute navModal z-50 right-0 top-full mt-2 flex flex-col items-end justify-start gap-2">
                      <motion.span
                        initial={{
                          x: "60%",
                          opacity: 0,
                          transformOrigin: "center top",
                        }}
                        animate={{ x: "0%", opacity: 1 }}
                        exit={{ x: "60%", opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 180,
                          delay: 0.2,
                        }}>
                        <a href="#" className="main-button">
                          Home
                        </a>
                      </motion.span>
                      <motion.span
                        initial={{
                          x: "60%",
                          opacity: 0,
                          transformOrigin: "center top",
                        }}
                        animate={{ x: "0%", opacity: 1 }}
                        exit={{ x: "60%", opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 180,
                          delay: 0.4,
                        }}>
                        <a href="#works" className="main-button">
                          Works
                        </a>
                      </motion.span>
                      <motion.span
                        initial={{
                          x: "60%",
                          opacity: 0,
                          transformOrigin: "center top",
                        }}
                        animate={{ x: "0%", opacity: 1 }}
                        exit={{ x: "60%", opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 180,
                          delay: 0.6,
                        }}>
                        <a href="#about" className="main-button">
                          About
                        </a>
                      </motion.span>
                      <motion.span
                        initial={{
                          x: "60%",
                          opacity: 0,
                          transformOrigin: "center top",
                        }}
                        animate={{ x: "0%", opacity: 1 }}
                        exit={{ x: "60%", opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 180,
                          delay: 0.8,
                        }}>
                        <button
                          onClick={() => {
                            setContactModal(true);
                          }}
                          className="main-button sm:hidden">
                          Contact Me
                        </button>
                      </motion.span>
                    </div>
                  )}
                </AnimatePresence>
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
              alt="star image"
              className="h-20 sm:h-28 2xl:h-32"
            />
            <motion.h1
              className="font-lato font-black text-nowrap leading-[88%] text-7xl sm:text-[9rem] 2xl:text-[11.25rem] text-milk"
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
              className="font-lato font-black leading-[88%] text-7xl sm:text-[9rem] xl:text-[11.25rem] text-milk"
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
              className="font-lato font-black flex flex-col items-start sm:items-center sm:flex-row w-full gap-2 leading-[88%] text-7xl sm:text-[9rem] 2xl:text-[11.25rem] text-milk"
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
                className={`px-6 py-2 h-max bg-milk mt-2 font-sora rounded-[1.25rem] flex flex-col ${
                  background ? "text-black" : "text-main"
                }`}>
                <h1 className="font-bold text-4xl sm:text-[2.8rem] ease-smooth duration-500 sm:leading-[1.2] md:leading-[1] md:text-[4.5rem]">
                  Emin Erçoban
                </h1>
                <p className="font-extralight text-lg sm:text-[1.8rem] sm:leading-[1.2] md:leading-[1] md:text-[2.5rem]">
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
      <div className="bg-body p-8 pt-0">
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
                  Let's Make More
                </button>
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
                <button
                  onClick={async () => {
                    window.open(socials.getSocial("Behance")?.url, "_blank");
                    window.open(socials.getSocial("GitHub")?.url, "_blank");
                  }}
                  className="main-button">
                  See More
                </button>
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
      <div className="bg-body p-8 pt-0">
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
              Hello, I'm a full stack web developer & designer in Turkey. My
              goal is to enhance projects and applications with creative design
              and modern technologies.
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
                  className="main-button !w-full sm:!w-max">
                  {social.name}
                </a>
              ))}
            </ul>
          </motion.div>
        </section>
      </div>
      <div className="bg-body p-8 pt-0">
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
      <div className="bg-body p-8 pt-0">
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
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
