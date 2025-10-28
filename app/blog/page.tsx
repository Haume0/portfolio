"use client";
import Header from "@/layouts/header";
import PocketBase from "pocketbase";
import Footer from "@/layouts/footer";
import { useContact } from "@/components/Contact";
import ImageTrace from "@/components/imagetrace";
import { Icon } from "@iconify/react";
import { useInView, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string | null;
  is_published: boolean;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  embeds: string[];
}

export default function Blogs() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true });
  const contact = useContact();

  useEffect(() => {
    (async () => {
      const datas = await pb.collection("blogs").getFullList({
        filter: "is_published=true",
      });
      setBlogs(datas as BlogPost[]);
    })();
  }, []);
  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8 pt-0">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
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
                  Share an Idea
                </button>
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

          <div className="flex flex-col w-full max-w-full gap-2 mt-6">
            {blogs && blogs.length > 0 ? (
              Object.entries(
                blogs
                  .sort((a, b) => {
                    return (
                      new Date(b.created!).getTime() -
                      new Date(a.created!).getTime()
                    );
                  })
                  .reduce((acc: Record<string, BlogPost[]>, blog: BlogPost) => {
                    const monthYear = blog.created
                      ? new Date(blog.created).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          year: "numeric",
                          month: "numeric",
                        })
                      : "Bilinmiyor";
                    if (!acc[monthYear]) {
                      acc[monthYear] = [];
                    }
                    acc[monthYear].push(blog);
                    return acc;
                  }, {}),
              ).map(([monthYear, monthBlogs]: [string, BlogPost[]]) => (
                <div key={monthYear} className="flex flex-col gap-4 pb-12">
                  <motion.h2
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
                      delay: 0.8,
                    }}
                    className="text-2xl font-bold text-milk"
                  >
                    {monthYear}
                  </motion.h2>
                  <div className="flex flex-col gap-2">
                    {/* Removed the <pre> tag as it was likely for debugging */}
                    {monthBlogs.map((blog, i) => (
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
                          delay: 1 + 0.2 * i,
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
                                  ? `${pb.baseURL}/api/files/${blog.collectionId}/${blog.id}/${blog.image}`
                                  : "/main.webp"
                              }
                              title={blog.title}
                            />
                          </span>
                        </article>
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon icon="material-symbols:sad-tab-rounded" fontSize="7rem" />
                <h3 className="text-5xl font-black text-milk mb-2">
                  Ops, Not Found
                </h3>
                <p className="text-milk/60 max-w-md">
                  There are no blog posts available at the moment. Please check
                  back later.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className="p-4 sm:p-6 md:p-8 !py-0">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // Newsletter subscription
            const mail = (e.target as HTMLFormElement).mail.value;

            try {
              const record = await pb
                .collection("subscribes")
                .create({ mail: mail });
              alert(JSON.stringify(record));
            } catch (e: any) {
              alert("ERROR:\n" + e.data.data.mail.code);
            }
          }}
          className=" bg-about overflow-hidden p-6 gap-6 flex flex-col md:flex-row justify-between rounded-3xl size-full"
        >
          <h1 className="font-light text-4xl flex gap-6 items-center justify-center text-center md:text-left">
            <img src="/star.svg" alt="" className="!size-10" />
            Subscribe for stay tuned!
            <img src="/star.svg" alt="" className="!size-10" />
          </h1>
          <span className="flex gap-4 md:max-w-2/5 w-full">
            <input
              type="email"
              name="mail"
              required
              placeholder="E-mail address"
              className="text-field"
            />
            <button className="main-button shrink-0 col-span-2">
              Subscribe
            </button>
          </span>
        </form>
      </div>
      <Footer />
    </>
  );
}
