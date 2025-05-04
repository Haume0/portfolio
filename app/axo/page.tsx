"use client";
import Contact, { useContact } from "@/components/Contact";
import FanList from "@/components/FanList";
import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import useProjects from "@/store/projects";
import useSocials from "@/store/socials";
import useTechs from "@/store/techstack";
import { AnimatePresence, motion, useInView } from "motion/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Axo() {
  const contact = useContact();
  // About ref
  const axoRef = useRef(null);
  const axoInView = useInView(axoRef, { once: true });
  return (
    <>
      <div className="bg-body p-4 space-y-6 sm:p-6 md:p-8 pt-0">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
        <section
          className="bg-about overflow-hidden gap-12 p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-7 rounded-3xl size-full"
          ref={axoRef}>
          <main className="flex col-span-1 lg:col-span-4 flex-col gap-4">
            <motion.h1
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={axoInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
              id="about"
              className="font-extrabold text-3xl sm:text-5xl lg:text-6xl">
              About the project
            </motion.h1>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={axoInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.4,
              }}
              className="font-light text-lg md:text-xl">
              Axo is a modern, lightweight, and efficient RESTful API Scaffold
              written in Go. It is designed to simplify the development of
              backend services by leveraging the power of Go's standard library
              and the popular GORM ORM for database interactions. Axo aims to
              provide developers with a fast, scalable, and easy-to-use
              framework for building robust APIs.
            </motion.p>
            <motion.span
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={axoInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.6,
              }}
              className="font-light text-lg md:text-xl">
              <a
                target="_blank"
                href="https://github.com/haume0/axo"
                className="main-button w-full! sm:w-max!">
                Github
              </a>
            </motion.span>
          </main>
          <motion.div
            initial={{
              transform: "scale(0.4)",
              opacity: 0,
              transformOrigin: "center",
            }}
            animate={axoInView ? { transform: "scale(1)", opacity: 1 } : {}}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 100,
              delay: 1,
            }}
            className="flex rounded-2xl col-span-1 lg:col-span-3 items-center justify-center flex-col bg-dark p-8 gap-3">
            <img
              src="/works/axo-icon.webp"
              className="w-32 md:w-48 lg:w-64 aspect-square rounded-3xl"
              alt=""
            />
            <h1 className="font-extrabold text-center text-4xl md:text-5xl lg:text-6xl">
              🪸 Axo REST API 🌊
            </h1>
            <p className="font-light text-center text-xl md:text-2xl lg:text-3xl">
              A modern, lightweight, and efficient RESTful API Scaffold written
              in Go.
            </p>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}
