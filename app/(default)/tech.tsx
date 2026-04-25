"use client";
import TechCard from "@/components/tech-card";
import useTechs from "@/store/techstack";
import { useInView, motion } from "motion/react";
import { useRef } from "react";

export default function TechSection() {
    const techs = useTechs();

    const techsRef = useRef(null);
    const techsInView = useInView(techsRef, { once: true });

    return (
        <div className="p-4 sm:p-6 md:p-8 pt-0!">
            <section
                className=" bg-grey overflow-hidden p-4 sm:p-6 md:p-8 pb-12 flex flex-col rounded-3xl size-full"
                ref={techsRef}
            >
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
                    className="font-extrabold text-6xl sm:text-7xl md:text-8xl text-center"
                >
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
                                techsInView
                                    ? { transform: "scale(1)", opacity: 1 }
                                    : {}
                            }
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 100,
                                delay: 0.4 + idx * 0.2,
                            }}
                            key={idx}
                            style={{ zIndex: techs.techs.length - idx }}
                        >
                            <TechCard
                                name={tech.name}
                                image={`/techs/${tech.id}.png`}
                            />
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
                    className="font-light text-center mt-4 text-xl text-white/40"
                >
                    And there is more...
                </motion.p>
            </section>
        </div>
    );
}
