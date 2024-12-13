import { motion } from "motion/react";

function App() {
  return (
    <div className="bg-body h-screen p-8">
      <main className=" bg-main p-8 flex flex-col rounded-3xl size-full">
        <header className="flex justify-between items-start">
          <div className=" w-1/3 flex overflow-hidden">
            <motion.span
              initial={{ y: "-100%", transformOrigin: "center top" }}
              animate={{ y: "0%", transformOrigin: "center top" }}
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
          <div className=" w-1/3 flex overflow-hidden justify-end gap-2">
            <motion.span
              initial={{ y: "-100%", transformOrigin: "center top" }}
              animate={{ y: "0%", transformOrigin: "center top" }}
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
              initial={{ y: "-100%", transformOrigin: "center top" }}
              animate={{ y: "0%", transformOrigin: "center top" }}
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
            className="font-lato font-black leading-[88%] text-milk"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.7,
            }}
            style={{ fontSize: "clamp(5rem, 10vw, 11rem)" }}>
            I MAKE
          </motion.h1>
          <motion.h1
            className="font-lato font-black leading-[88%] text-milk"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.8,
            }}
            style={{ fontSize: "clamp(5rem, 10vw, 11rem)" }}>
            DREAMS COME
          </motion.h1>
          <motion.h1
            className="font-lato font-black leading-[88%] text-milk"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 0.9,
            }}
            style={{ fontSize: "clamp(5rem, 10vw, 11rem)" }}>
            TRUE
          </motion.h1>
        </div>
      </main>
    </div>
  );
}

export default App;
