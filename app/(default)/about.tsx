"use client";
import useSocials from "@/store/socials";
import useTechs from "@/store/techstack";
import { useInView, motion } from "motion/react";
import { useRef } from "react";

export default function AboutSection() {
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true });
  const techs = useTechs();
  const socials = useSocials();
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
            <a
              href="/cv.pdf"
              className="font-light flex gap-2 items-center text-lg md:text-xl rounded-xl bg-dark ease-gentle duration-300 hover:bg-white hover:text-black size-max py-1.5 px-3"
            >
              👀 My CV
            </a>
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
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
