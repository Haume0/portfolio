"use client";
import { useContact } from "@/components/Contact";
import FanList from "@/components/FanList";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function Header(props: { hideStar?: boolean }) {
  const contact = useContact();
  const [navModal, setNavModal] = useState(false);
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
  // Header refs
  const headerRef1 = useRef(null);
  const headerInView1 = useInView(headerRef1, { once: true });

  const headerRef2 = useRef(null);
  const headerInView2 = useInView(headerRef2, { once: true });

  const headerRef3 = useRef(null);
  const headerInView3 = useInView(headerRef3, { once: true });
  return (
    <header
      className="flex relative z-50 justify-between items-start"
      ref={headerRef1}>
      <div className="w-1/3 h-16 items-center flex">
        <Link href="/" className="flex select-none">
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
        </Link>
      </div>
      {!props.hideStar && (
        <div
          className="relative select-none flex pointer-events-none items-center justify-center z-10"
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
      )}
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
              contact.open();
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
                  navModal && "bg-white! rounded-[2rem]! rotate-90! text-black!"
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
            <Link href="/#" className="main-button">
              Home
            </Link>
            <Link href="/#works" className="main-button">
              Works
            </Link>
            <Link href="/#about" className="main-button">
              About
            </Link>
            <button
              onClick={() => {
                contact.open();
                setNavModal(false);
              }}
              className="main-button sm:!hidden ">
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
  );
}
