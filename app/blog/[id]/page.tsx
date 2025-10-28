"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import PocketBase from "pocketbase";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { BlogPost } from "../page";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import MarkdownRenderer from "@/components/MarkdownRendere";

export default function Blog({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  const [blog, _blog] = useState<BlogPost | null>(null);
  const [loading, _loading] = useState(true);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true });

  useEffect(() => {
    (async () => {
      try {
        let data: BlogPost = await pb
          .collection("blogs")
          .getOne(resolvedParams.id, {
            filter: "is_published=true",
          });
        data.embeds.forEach((embed) => {
          const parts = embed.split("_");
          const exc = parts[parts.length - 1].split(".")[0];
          const pure = embed.replaceAll(`_${exc}`, "");
          console.log(embed + ":" + pure);
          const full = `${pb.baseURL}api/files/${data.collectionId}/${data.id}/${embed}`;
          const mdlook = encodeURIComponent(pure.replaceAll("_", " "));
          data.content = data.content.replaceAll(mdlook, full);
        });
        _blog(data);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
        _blog(null);
      } finally {
        _loading(false);
      }
    })();
  }, [resolvedParams.id]);

  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8 pt-0">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
        <section
          ref={sectionRef}
          className="bg-grey p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full min-h-2/5"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center m-auto">
              <Icon icon="line-md:star-pulsating-loop" fontSize="7rem" />
              <h3 className="text-5xl font-black text-milk mb-2">
                Searching...
              </h3>
              <p className="text-milk/60 max-w-md">
                Please wait while we search for your blog post.
              </p>
            </div>
          ) : !blog ? (
            <div className="flex flex-col items-center justify-center py-16 text-center m-auto">
              <Icon icon="material-symbols:sad-tab-rounded" fontSize="7rem" />
              <h3 className="text-5xl font-black text-milk mb-2">
                Ops, Not Found
              </h3>
              <p className="text-milk/60 max-w-md">
                We couldn't find such a blog post. Please come back later.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <span ref={sectionRef}></span>
              <nav className="text-sm text-light/60 overflow-hidden mb-4">
                <div className="flex items-center whitespace-nowrap">
                  <Link href="/" className="hover:text-light shrink-0">
                    Home
                  </Link>
                  <span className="mx-2 shrink-0">/</span>
                  <Link href="/blog" className="hover:text-light shrink-0">
                    Blog
                  </Link>
                  <span className="mx-2 shrink-0">/</span>
                  <span className="text-light truncate min-w-0">
                    {blog.title}
                  </span>
                </div>
              </nav>
              <motion.h1
                initial={{
                  y: -48,
                  opacity: 0,
                  filter: "blur(16px)",
                }}
                animate={
                  sectionInView
                    ? {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                      }
                    : {}
                }
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.2,
                }}
                id="works"
                className="font-extrabold text-8xl mb-8"
              >
                {blog.title}
              </motion.h1>
              <motion.img
                initial={{
                  y: -48,
                  opacity: 0,
                  filter: "blur(16px)",
                }}
                animate={
                  sectionInView
                    ? {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                      }
                    : {}
                }
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.4,
                }}
                src={
                  blog.image
                    ? `${pb.baseURL}/api/files/${blog.collectionId}/${blog.id}/${blog.image}`
                    : "/main.webp"
                }
                alt={blog.title}
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                loading="eager"
              />
              <motion.article
                initial={{
                  y: -48,
                  opacity: 0,
                  filter: "blur(16px)",
                }}
                animate={
                  sectionInView
                    ? {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                      }
                    : {}
                }
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.6,
                }}
                className="max-w-none mt-8"
              >
                <MarkdownRenderer content={blog.content} />
              </motion.article>
            </div>
          )}
        </section>
      </div>
      <div className="p-4 sm:p-6 md:p-8 !py-0">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const mail = (e.target as HTMLFormElement).mail.value;
            try {
              const record = await pb
                .collection("subscribes")
                .create({ mail: mail });
              alert("Successfully subscribed: " + JSON.stringify(record.mail));
            } catch (e: any) {
              alert("ERROR:\n" + e.data.data.mail.message);
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
