"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import PocketBase from "pocketbase";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import MarkdownRenderer from "@/components/MarkdownRendere";
import { WorkPost } from "@/app/admin/works/page";

export default function Work({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  const [work, _work] = useState<WorkPost | null>(null);
  const [loading, _loading] = useState(true);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true });

  useEffect(() => {
    (async () => {
      try {
        const escapedId = resolvedParams.id.replaceAll('"', '\\"');
        let data: WorkPost;

        try {
          data = await pb
            .collection("works")
            .getFirstListItem(`slug = "${escapedId}" && is_published = true`, {
              requestKey: `${resolvedParams.id}:slug`,
            });
        } catch {
          data = await pb.collection("works").getOne(resolvedParams.id, {
            filter: "is_published=true",
            requestKey: resolvedParams.id,
          });
        }
        data.embeds.forEach((embed) => {
          const parts = embed.split("_");
          const exc = parts[parts.length - 1].split(".")[0];
          const pure = embed.replaceAll(`_${exc}`, "");
          console.log(embed + ":" + pure);
          const full = `${pb.baseURL}api/files/${data.collectionId}/${data.id}/${embed}`;
          console.log(full);
          data.content = data.content.replaceAll(pure, full);
        });
        _work(data);
      } catch (error) {
        console.error("Failed to fetch work post:", error);
        _work(null);
      } finally {
        _loading(false);
      }
    })();
  }, []);

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
                Please wait while we search for your work post.
              </p>
            </div>
          ) : !work ? (
            <div className="flex flex-col items-center justify-center py-16 text-center m-auto">
              <Icon icon="material-symbols:sad-tab-rounded" fontSize="7rem" />
              <h3 className="text-5xl font-black text-milk mb-2">
                Ops, Not Found
              </h3>
              <p className="text-milk/60 max-w-md">
                We couldn't find such a work post. Please come back later.
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
                  <Link href="/works" className="hover:text-light shrink-0">
                    Works
                  </Link>
                  <span className="mx-2 shrink-0">/</span>
                  <span className="text-light truncate min-w-0">
                    {work.title}
                  </span>
                </div>
              </nav>
              <motion.h1
                initial={{
                  y: -48,
                  opacity: 0,
                }}
                animate={
                  sectionInView
                    ? {
                        y: 0,
                        opacity: 1,
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
                className="font-extrabold text-5xl sm:text-6xl lg:text-7xl"
              >
                {work.title}
              </motion.h1>
              <motion.p
                initial={{
                  y: -48,
                  opacity: 0,
                }}
                animate={
                  sectionInView
                    ? {
                        y: 0,
                        opacity: 1,
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
                className="text-lg sm:text-xl lg:text-2xl mb-4 mt-2"
              >
                {work.description}
              </motion.p>
              {/*<motion.img
                initial={{
                  y: -48,
                  opacity: 0,
                }}
                animate={
                  sectionInView
                    ? {
                        y: 0,
                        opacity: 1,
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
                  work.image
                    ? `${pb.baseURL}/api/files/${work.collectionId}/${work.id}/${work.image}`
                    : "/main.webp"
                }
                alt={work.title}
                className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                loading="eager"
              />*/}
              {work.content ? (
                <motion.article
                  initial={{
                    y: -48,
                    opacity: 0,
                  }}
                  animate={
                    sectionInView
                      ? {
                          y: 0,
                          opacity: 1,
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
                  <MarkdownRenderer content={work.content} />
                </motion.article>
              ) : null}
            </div>
          )}
        </section>
      </div>

      <div className="p-4 sm:p-6 md:p-8 py-0">
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
            <img src="/star.svg" alt="" className="size-10" />
            Subscribe for stay tuned!
            <img src="/star.svg" alt="" className="size-10" />
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
