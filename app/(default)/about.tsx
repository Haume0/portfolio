"use client";
import useSocials from "@/store/socials";
import useTechs from "@/store/techstack";
import { Icon } from "@iconify/react";
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
                        className="font-light text-lg md:text-xl"
                    >
                        Hello, I'm Emin Erçoban a{" "}
                        <strong>full stack web developer & designer</strong> in
                        Turkey/Antalya. My mission is to enhance projects,
                        applications with creative design and modern
                        technologies.
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
                        className="font-light text-lg md:text-xl"
                    >
                        I'm currently working as a freelancer alongside my best
                        friend on platforms like Fiverr and Bionluk, where we
                        deliver{" "}
                        <strong>
                            websites, web applications, desktop and mobile
                            applications
                        </strong>
                        . I also experianced in{" "}
                        <strong>
                            UI/UX design, graphic design, and brand identity
                            development.
                        </strong>
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
                        className="font-light text-lg md:text-xl"
                    >
                        It has been about 4 years since I started design and
                        developing things, I am a self-taught software
                        developer. In 2023 i started studying in an associate
                        degree program. I met very nice people in there, my
                        current goal is to switch to a bachelor program and get
                        my license.
                    </motion.p>
                    <ul className="flex flex-wrap">
                        {techs.tags.map((tag, i) => (
                            <motion.li
                                initial={{
                                    y: "-40%",
                                    opacity: 0,
                                }}
                                animate={
                                    aboutInView ? { y: "0%", opacity: 1 } : {}
                                }
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
                    <a
                        href="/cv.pdf"
                        className="font-light flex gap-2 items-center text-lg md:text-xl rounded-2xl bg-dark ease-gentle duration-300 hover:bg-white hover:text-black size-max py-1.5 pl-1.5 px-3"
                    >
                        <Icon
                            icon="tabler:file-cv-filled"
                            className="text-3xl"
                        />
                        Check my CV
                    </a>
                </div>
                <motion.div
                    initial={{
                        transform: "scale(0.4)",
                        opacity: 0,
                        transformOrigin: "center",
                    }}
                    animate={
                        aboutInView ? { transform: "scale(1)", opacity: 1 } : {}
                    }
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
                        Full-Stack Developer & Designer
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
