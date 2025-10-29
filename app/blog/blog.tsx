"use client";
import { useContact } from "@/components/Contact";
import ImageTrace from "@/components/imagetrace";
import Header from "@/layouts/header";
import { Icon } from "@iconify/react";
import { useInView, motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import PocketBase, { RecordFullListOptions } from "pocketbase";
import { useState, useRef, useEffect } from "react";
import { BlogPost } from "./page";
export default function BlogSection(props: {
  limit?: number;
  children?: React.ReactNode;
  showcase?: boolean;
}) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true });
  const contact = useContact();

  useEffect(() => {
    (async () => {
      const options: RecordFullListOptions = {
        filter: "is_published=true",
      };
      let datas;
      if (props.limit) {
        datas = (
          await pb.collection("blogs").getList(1, props.limit, {
            filter: "is_published=true",
          })
        ).items;
      } else {
        datas = await pb.collection("blogs").getFullList(options);
      }

      setTimeout(() => {
        setBlogs(datas as BlogPost[]);
        setLoading(false);
      }, 2000);
    })();
  }, []);
  return (
    <>
      <section className="bg-blog p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
        <span ref={sectionRef}></span>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between w-full">
          <span>
            <motion.h1
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={sectionInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
              id="works"
              className="font-extrabold mb-2 md:text-8xl"
            >
              Blog Posts
            </motion.h1>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={sectionInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.4,
              }}
              className=" font-medium text-lg sm:text-xl"
            >
              Take a look at my posts. ✦
            </motion.p>
            <motion.p
              initial={{
                y: "-40%",
                opacity: 0,
              }}
              animate={sectionInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.6,
              }}
              className=" font-light text-xl"
            >
              I share software and design tips filled with my mistakes,
              learnings, and experiences.
            </motion.p>
          </span>
          <span className="flex sm:flex-col items-end gap-2">
            <motion.span
              initial={{
                x: "100%",
                opacity: 0,
              }}
              animate={sectionInView ? { x: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
            >
              <button
                onClick={() => {
                  contact.open({
                    title: "Idea for Blog Post",
                  });
                }}
                className="main-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"
                  />
                </svg>
                Share an Idea
              </button>
            </motion.span>
            <motion.span
              initial={{
                x: "100%",
                opacity: 0,
              }}
              animate={sectionInView ? { x: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.2,
              }}
            >
              <Link href="blog" className="main-button">
                ✦ See More
              </Link>
            </motion.span>
            <motion.span
              className="flex gap-2 seeMore"
              initial={{
                x: "100%",
                opacity: 0,
                transformOrigin: "center top",
              }}
              animate={sectionInView ? { x: "0%", opacity: 1 } : {}}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.4,
              }}
            ></motion.span>
          </span>
        </div>

        <div className="flex flex-col w-full max-w-full gap-2 mt-12">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key={"loading"}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  filter: "blur(16px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  filter: "blur(16px)",
                }}
                className="flex flex-col items-center justify-center py-16 text-center m-auto"
              >
                <Icon icon="line-md:star-pulsating-loop" fontSize="7rem" />
                <h3 className="text-5xl font-black text-milk mb-2">
                  Searching...
                </h3>
                <p className="text-milk/60 max-w-md">
                  Please wait while we search for your blog post.
                </p>
              </motion.div>
            ) : blogs && blogs.length > 0 ? (
              <motion.div
                className="flex flex-col gap-4"
                key="blog-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {blogs.map((blog, i) => (
                  <motion.span
                    key={blog.id}
                    initial={{
                      y: "-40%",
                      opacity: 0,
                    }}
                    animate={
                      sectionInView
                        ? {
                            y: "0%",
                            opacity: 1,
                          }
                        : {}
                    }
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 100,
                      delay: 0.8 + 0.1 * i,
                    }}
                  >
                    <article
                      className={`relative group items-center rounded-2xl bg-body hover:bg-milk hover:text-dark ease-spring-stiff duration-500 flex gap-4 sm:gap-8 p-4 md:p-0`}
                    >
                      <span className="size-full p-0 md:p-5 items-center gap-3 md:gap-4 flex flex-row *:text-start">
                        <span className="text-primary text-sm sm:text-base">
                          #{i + 1}
                        </span>
                        <Link
                          href={`/blog/${blog.id}`}
                          className="hover:underline text-center sm:text-left"
                        >
                          <h1 className="text-xl sm:text-2xl lg:text-3xl">
                            {blog.title}
                          </h1>
                        </Link>
                        <span className="mx-auto hidden sm:block"></span>
                        <span className="absolute pointer-events-none inset-0 m-auto size-6 items-center justify-center text-2xl hidden sm:flex">
                          -
                        </span>
                        <p className="text-xs sm:text-sm text-light/60 text-center sm:text-right">
                          {blog.created
                            ? new Date(blog.created).toLocaleDateString(
                                "tr-TR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "Bilinmiyor"}
                        </p>
                        <Link
                          href={`/blog/${blog.id}`}
                          className="text-blog hover:underline text-base sm:text-lg"
                        >
                          Read Post
                        </Link>
                        <ImageTrace
                          image={
                            blog.image
                              ? `${pb.baseURL}/api/files/${blog.collectionId}/${blog.id}/${blog.image}?thumb=256x256`
                              : "/main.webp"
                          }
                          title={blog.title}
                        />
                      </span>
                    </article>
                  </motion.span>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={"not-found"}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  filter: "blur(16px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  filter: "blur(16px)",
                }}
                className="flex flex-col items-center justify-center py-16 text-center m-auto"
              >
                <Icon icon="material-symbols:sad-tab-rounded" fontSize="7rem" />
                <h3 className="text-5xl font-black text-milk mb-2">
                  Ops, Not Found
                </h3>
                <p className="text-milk/60 max-w-md">
                  There are no blog posts available at the moment. Please check
                  back later.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {props.children}
      </section>
    </>
  );
}
