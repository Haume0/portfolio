import * as motion from "motion/react-client";
import Header from "@/layouts/header";
import EasterBackground from "./easter";

export default function Main() {
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-dvh flex">
      <main className="bg-main p-4 sm:p-6 md:p-8 overflow-clip flex flex-col rounded-3xl w-full relative">
        <Header />
        <EasterBackground />
        {/* "IMAGINATIVE" is ~6.65em wide in Lato Black; capping font-size at 15cqw keeps it inside the container on narrow screens */}
        <div className="@container mt-auto flex flex-col relative overflow-hidden items-start justify-start">
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
            className="font-lato font-black text-nowrap leading-[88%] text-[min(4.5rem,15cqw)] sm:text-[min(9rem,15cqw)] 2xl:text-[min(11.25rem,15cqw)] text-white"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.7,
            }}
          >
            I CREATE
          </motion.h1>
          <motion.h1
            className="font-lato font-black leading-[88%] text-[min(4.5rem,15cqw)] sm:text-[min(9rem,15cqw)] xl:text-[min(11.25rem,15cqw)] text-white"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.8,
            }}
          >
            IMAGINATIVE
          </motion.h1>
          <motion.h1
            className="font-lato font-black flex flex-col items-start sm:items-center sm:flex-row w-full gap-2 leading-[88%] text-[min(4.5rem,15cqw)] sm:text-[min(9rem,15cqw)] 2xl:text-[min(11.25rem,15cqw)] text-white"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.9,
            }}
          >
            IDEAS
            <div className="px-6 py-2 h-max bg-white text-[var(--myname)]! mt-2 font-sora rounded-[1.25rem] flex flex-col">
              <h1 className="font-bold text-4xl sm:text-[2.8rem] ease-smooth duration-500 sm:leading-[1.2] md:leading-none md:text-[4.5rem]">
                Emin Erçoban
              </h1>
              <p className="font-extralight text-lg sm:text-[1.8rem] sm:leading-[1.2] md:leading-none md:text-[2.5rem]">
                Product Designer & Developer
              </p>
            </div>
          </motion.h1>
        </div>
      </main>
    </div>
  );
}
