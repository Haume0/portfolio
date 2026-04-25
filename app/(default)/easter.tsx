"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Eastereaster() {
    const [easter, setEaster] = useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--myname",
            easter ? "black" : "var(--color-main)",
        );

        if (easter) {
            return () => {
                document.documentElement.style.setProperty(
                    "--myname",
                    "var(--color-main)",
                );
            };
        }
    }, [easter]);
    return (
        <>
            <AnimatePresence>
                <motion.span
                    initial={{
                        filter: "blur(48px)",
                        scale: 0.6,
                        opacity: 0,
                        borderRadius: "50%",
                    }}
                    animate={{
                        filter: easter ? "blur(0px)" : "blur(48px)",
                        scale: easter ? 1 : 0.6,
                        opacity: easter ? 1 : 0,
                        borderRadius: easter ? "0%" : "50%",
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute size-full object-cover object-center inset-0"
                >
                    <Image
                        fill
                        src="/main.webp"
                        alt="Emin Erçoban Haume Background Image"
                    />
                </motion.span>
            </AnimatePresence>
            <img
                onClick={() => setEaster((prev) => !prev)}
                src="/signs.svg"
                className="order-last z-50 sm:absolute right-8 bottom-8 ml-auto mt-2 h-5 sm:h-7 2xl:h-9"
                alt="signs"
            />
        </>
    );
}
