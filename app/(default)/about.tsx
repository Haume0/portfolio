"use client";
import { Icon } from "@iconify/react";
import Askolotl from "@/components/askolotl";
import useSocials from "@/store/socials";
import useTechs from "@/store/techstack";
import { AnimatePresence, useInView, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const spring = { type: "spring", damping: 25, stiffness: 100 } as const;

export default function AboutSection() {
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true });
  const techs = useTechs();
  const socials = useSocials();
  const [resume, setResume] = useState(false);

  useEffect(() => {
    if (!resume) return;
    // Modal açıkken arkadaki sayfa kaymasın; works preview modalıyla aynı kilit.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setResume(false);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [resume]);
  return (
    <div className="p-4 sm:p-6 md:p-8 pt-0!">
      <section
        className="bg-about overflow-hidden gap-12 p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-7 rounded-3xl size-full"
        ref={aboutRef}
      >
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
            className="font-extrabold text-5xl sm:text-7xl lg:text-8xl"
          >
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
            className="font-light text-lg md:text-xl [&_strong]:font-semibold"
          >
            Hello, I'm Emin Erçoban, a{" "}
            <strong>self-taught Product Designer & Developer</strong> based in
            Antalya, Türkiye. I started learning design and code on my own{" "}
            <strong>over 5 years ago</strong> and have been building products
            for real clients ever since.
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
            className="font-light text-lg md:text-xl [&_strong]:font-semibold"
          >
            Because I work as a freelancer, I take part in{" "}
            <strong>every stage of product development</strong>,{" "}
            <strong>from design to code, and from code to launch</strong>. This
            gave me experience in{" "}
            <strong>brand identity, UI, frontend and backend</strong>. I design
            and build websites, e-commerce stores, web applications, desktop and
            mobile applications.
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
            className="font-light text-lg md:text-xl [&_strong]:font-semibold"
          >
            I also have an <strong>associate degree</strong> in this field. It
            strengthened my fundamentals, and I met great people there.
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
              delay: 1,
            }}
            className="font-light text-lg md:text-xl"
          >
            Have a project idea or a job opportunity? Feel free to reach out.
          </motion.p>
          <ul className="flex flex-wrap">
            {techs.tags.map((tag, i) => (
              <motion.li
                initial={{
                  y: "-40%",
                  opacity: 0,
                }}
                animate={aboutInView ? { y: "0%", opacity: 1 } : {}}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 1 + i * 0.2,
                }}
                key={i}
                className="font-light text-sm md:text-base rounded-full bg-body py-0.5 px-2 mr-2 mb-2"
              >
                {tag}
              </motion.li>
            ))}
          </ul>
          <motion.span
            initial={{
              y: "-40%",
              opacity: 0,
            }}
            animate={aboutInView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 1.2,
            }}
          >
            <Askolotl />
          </motion.span>
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
          className="flex rounded-2xl col-span-1 lg:col-span-3 items-center justify-center flex-col bg-dark p-8 gap-3"
        >
          <img
            src="https://avatars.githubusercontent.com/u/70094846"
            className="w-32 md:w-48 lg:w-64 aspect-square object-cover object-center rounded-3xl"
            alt=""
          />
          <h1 className="font-extrabold text-center text-4xl md:text-5xl lg:text-6xl">
            Emin Erçoban
          </h1>
          <p className="font-light text-center text-xl md:text-2xl lg:text-3xl">
            Product Designer & Developer
          </p>
          <ul className="grid grid-cols-2 grid-rows-2 sm:flex sm:flex-wrap items-center justify-center gap-2">
            {socials.socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                className="main-button w-full! sm:w-max!"
              >
                {social.name}
              </a>
            ))}
            {/* Mobilde 2 sütunlu gridde tek kalan 5. buton satırı tam kaplasın. */}
            <button
              type="button"
              onClick={() => setResume(true)}
              className="main-button w-full! sm:w-max! col-span-2"
            >
              <Icon icon="ion:document-text-outline" className="text-2xl" />
              Resume
            </button>
          </ul>
        </motion.div>
      </section>
      {/* Kart transform animasyonlu olduğu için fixed modal body'ye portal edilir; AnimatePresence portal'ı geçerli çocuk saymadığından keyed Fragment ile sarılır. */}
      <AnimatePresence>
        {resume && (
          <Fragment key="resume">
            {createPortal(
              <motion.section
                onClick={() => setResume(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex size-full cursor-zoom-out items-end sm:items-center justify-center bg-dark/80 backdrop-blur-sm p-4 sm:p-6 md:p-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90, transition: { duration: 0.2 } }}
                  transition={{ ...spring, delay: 0.2 }}
                  className="absolute right-8 top-8 flex gap-2"
                >
                  {/* Mobil Safari iframe içindeki PDF'in yalnızca ilk sayfasını gösterir; tam görünüm için yeni sekme. */}
                  <a
                    href="/cv.pdf"
                    target="_blank"
                    rel="noopener"
                    aria-label="Open in new tab"
                    onClick={(e) => e.stopPropagation()}
                    className="main-button text-2xl p-0! size-12! aspect-square rounded-2xl bg-dark! hover:bg-white!"
                  >
                    <Icon icon="ion:open-outline" />
                  </a>
                  <button
                    type="button"
                    aria-label="Close"
                    className="main-button text-2xl p-0! size-12! aspect-square rounded-2xl bg-dark! hover:bg-white!"
                  >
                    <Icon icon="ion:close" />
                  </button>
                </motion.div>
                <motion.iframe
                  // Tek sayfalık CV'de küçük resim paneli gereksiz yer kaplar; sayfa genişliğe sığdırılır.
                  src="/cv.pdf#navpanes=0&view=FitH"
                  title="Emin Erçoban Resume"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: 80,
                    opacity: 0,
                    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] },
                  }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="w-full max-w-4xl h-[calc(100dvh-7rem)] sm:h-[calc(100dvh-4rem)] rounded-[1.25rem] bg-white shadow-2xl"
                />
              </motion.section>,
              document.body,
            )}
          </Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}
