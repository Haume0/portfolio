"use client";
import useSocials from "@/store/socials";
import { useInView, motion } from "motion/react";
import Link from "next/link";
import React, { useRef } from "react";

export default function Footer() {
  // Footer ref
  const footerRef = useRef(null);
  const footerInView = useInView(footerRef, { once: true });
  const socials = useSocials();
  return (
    <div className="bg-body p-4 sm:p-6 md:p-8 !pt-0">
      <footer
        className=" bg-dark overflow-hidden gap-12 p-8 grid grid-cols-1 sm:grid-cols-2 grid-flow-row md:flex md:justify-between rounded-3xl size-full"
        ref={footerRef}
      >
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
          className="flex flex-col items-start justify-start"
        >
          <img src="/haume.svg" className=" h-14" alt="" />
          <p className="text-xl">Interstellar web developer.</p>
          <p className="font-thin text-white/40">© 2024 ✦ Emin Erçoban</p>
          <p className="font-thin text-white/40 mt-1">
            Co-Founder of{" "}
            <a
              href="https://cubidron.com"
              target="_blank"
              className="hover:underline font-normal hover:text-main"
            >
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
          className="flex flex-col items-start justify-start"
        >
          <img src="/star.svg" className=" h-9" alt="" />
          <p className="text-lg sm:text-xl font-extrabold">Leave me a story.</p>
          <a
            href="mailto:haume341@outlook.com?subject=There%20is%20your%20story.&body=Write%20your%20story%20here..."
            className="font-extralight text-xl sm:text-3xl"
          >
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
          className="flex flex-col items-start min-w-48 justify-start"
        >
          <p className="text-lg sm:text-xl">Navigation</p>
          <Link
            href="/#"
            className="font-extralight text-base hover:underline hover:text-main"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="font-extralight text-base hover:underline hover:text-main"
          >
            Blog
          </Link>
          <Link
            href="/#works"
            className="font-extralight text-base hover:underline hover:text-main"
          >
            Work
          </Link>
          <Link
            href="/#about"
            className="font-extralight text-base hover:underline hover:text-main"
          >
            About
          </Link>
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
          className="flex flex-col items-start min-w-48 justify-start"
        >
          <p className="text-lg sm:text-xl">Socials</p>
          {socials.socials.map((social, i) => (
            <a
              key={i}
              target="_blank"
              href={social.url}
              className="font-extralight text-base hover:underline hover:text-main"
            >
              {social.name}
            </a>
          ))}
        </motion.div>
      </footer>
    </div>
  );
}
