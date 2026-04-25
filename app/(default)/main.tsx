import Header from "@/layouts/header";
import * as motion from "motion/react-client";
import EasterBackground from "./easter";

export default function Main() {
    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-dvh flex">
            <main className="bg-main p-4 sm:p-6 md:p-8 overflow-clip flex flex-col rounded-3xl w-full relative">
                <Header />
                <EasterBackground />
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
                        }}
                    >
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
                        }}
                    >
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
                        }}
                    >
                        TRUE
                        <div className="px-6 py-2 h-max bg-white text-[var(--myname)]! mt-2 font-sora rounded-[1.25rem] flex flex-col">
                            <h1 className="font-bold text-4xl sm:text-[2.8rem] ease-smooth duration-500 sm:leading-[1.2] md:leading-none md:text-[4.5rem]">
                                Emin Erçoban
                            </h1>
                            <p className="font-extralight text-lg sm:text-[1.8rem] sm:leading-[1.2] md:leading-none md:text-[2.5rem]">
                                Full-Stack Web Developer
                            </p>
                        </div>
                    </motion.h1>
                </div>
            </main>
        </div>
    );
}
