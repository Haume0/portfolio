"use client";

import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import PocketBase from "pocketbase";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { BlogPost } from "./blogs/page";
import { WorkPost } from "./works/page";

export default function AdminHomePage() {
  const [secret, setSecret] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const [works, setWorks] = useState<WorkPost[] | null>(null);
  const pb = useMemo(() => new PocketBase(process.env.NEXT_PUBLIC_PB_URL), []);

  useEffect(() => {
    const storedSecret = sessionStorage.getItem("secret");
    if (storedSecret) {
      setSecret(storedSecret);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const blogs = await pb.collection("blogs").getFullList({
          sort: "-created",
        });
        const works = await pb.collection("works").getFullList({
          sort: "-created",
        });
        setBlogs(blogs as BlogPost[]);
        setWorks(works as WorkPost[]);
      } catch {
        setBlogs([]);
      }
    })();
  }, [pb]);

  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8">
        <section className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative overflow-hidden">
          <Header hideStar />
          <div className="mt-10 md:mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.7fr)] lg:items-end">
            <div>
              <motion.p
                initial={{ y: -32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.2,
                }}
                className="font-medium text-lg sm:text-xl text-white/70"
              >
                Portfolio / Admin
              </motion.p>
              <motion.h1
                initial={{ y: -48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.35,
                }}
                className="font-lato font-black text-white leading-[88%] text-6xl sm:text-[5.5rem] xl:text-[8rem]"
              >
                ADMIN
                <br />
                CENTER
              </motion.h1>
              <motion.p
                initial={{ y: -32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 100,
                  delay: 0.5,
                }}
                className="mt-4 max-w-3xl font-light text-lg sm:text-xl"
              >
                Güvenlik kodunu bir kez gir, sonra blog ve works admin
                sayfalarına buradan geç. Altta da mevcut içeriklerinin hızlı bir
                özetini gör.
              </motion.p>
            </div>

            <motion.form
              initial={{ scale: 0.9, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 100,
                delay: 0.45,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                sessionStorage.setItem("secret", secret);
              }}
              className="bg-white text-main rounded-[1.75rem] p-3 sm:p-4 flex flex-col gap-3"
            >
              <p className="text-xl sm:text-2xl font-bold">Secret Access</p>
              <input
                type="password"
                name="secret"
                required
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                }}
                placeholder="Güvenlik kodunu girin"
                className="px-5 h-14 sm:h-16 w-full outline-hidden rounded-xl bg-main text-white placeholder:text-white/60 font-medium text-base sm:text-xl"
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <button className="main-button !bg-body hover:!bg-main hover:!text-white focus:!bg-main focus:!text-white w-full justify-center">
                  Kodu Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("secret");
                    setSecret("");
                  }}
                  className="main-button !bg-transparent !text-main border border-main/20 hover:!bg-main hover:!text-white focus:!bg-main focus:!text-white w-full justify-center"
                >
                  Temizle
                </button>
              </div>
            </motion.form>
          </div>
        </section>

        <section className="bg-works p-4 sm:p-6 md:p-8 rounded-3xl overflow-hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-extrabold text-5xl sm:text-7xl">
                Admin Routes
              </h2>
              <p className="mt-3 max-w-3xl font-light text-lg sm:text-xl">
                İçerik yönetimi için iki ayrı giriş noktası. Secret kodu
                yukarıda kaydettikten sonra doğrudan geçebilirsin.
              </p>
            </div>
          </div>

          <div className="grid gap-4 mt-8 xl:grid-cols-2">
            <Link
              href="/admin/works"
              className="group rounded-3xl bg-dark p-5 sm:p-6 flex flex-col gap-5 hover:bg-body transition-colors duration-300"
            >
              <div>
                <p className="text-white/50 text-sm sm:text-base">
                  Works Admin
                </p>
                <h3 className="font-bold text-3xl sm:text-4xl leading-tight">
                  Projeleri yonet
                </h3>
              </div>
            </Link>

            <Link
              href="/admin/blogs"
              className="group rounded-3xl bg-dark p-5 sm:p-6 flex flex-col gap-5 hover:bg-body transition-colors duration-300"
            >
              <div>
                <p className="text-white/50 text-sm sm:text-base">
                  Blogs Admin
                </p>
                <h3 className="font-bold text-3xl sm:text-4xl leading-tight">
                  Bloglari yonet
                </h3>
              </div>
            </Link>
          </div>
        </section>

        <section className="bg-grey p-4 sm:p-6 md:p-8 rounded-3xl overflow-hidden">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl bg-dark p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-white/50 text-sm sm:text-base">
                    Works Overview
                  </p>
                  <h2 className="font-extrabold text-4xl sm:text-5xl">works</h2>
                </div>
              </div>
              <div className="grid gap-3 mt-6">
                {works?.slice(0, 6).map((work, index) => (
                  <div
                    key={work.id}
                    className="rounded-2xl bg-body p-4 flex items-center gap-4"
                  >
                    <div className="size-14 rounded-2xl overflow-hidden shrink-0 bg-main/20">
                      <img
                        src={
                          work.image
                            ? `${pb.baseURL}/api/files/${work.collectionId}/${work.id}/${work.image}`
                            : "/main.webp"
                        }
                        alt={work.title}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/40 text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="font-semibold text-lg truncate">
                        {work.title}
                      </p>
                      <p className="text-white/55 text-sm line-clamp-1">
                        {work.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-dark p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-white/50 text-sm sm:text-base">
                    Blog Overview
                  </p>
                  <h2 className="font-extrabold text-4xl sm:text-5xl">Posts</h2>
                </div>
              </div>

              <div className="grid gap-3 mt-6">
                {blogs === null ? (
                  <div className="rounded-2xl bg-body p-4 text-white/60">
                    Blog verileri yukleniyor...
                  </div>
                ) : blogs.length > 0 ? (
                  blogs.slice(0, 6).map((blog, index) => (
                    <div
                      key={blog.id}
                      className="rounded-2xl bg-body p-4 flex items-center gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-white/40 text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="font-semibold text-lg truncate">
                          {blog.title}
                        </p>
                        <p className="text-white/55 text-sm truncate">
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
                      </div>
                      <div className="shrink-0 text-xs sm:text-sm text-white/50 text-right leading-tight min-w-16">
                        {blog.is_published ? "Published" : "Draft"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-body p-4 text-white/60">
                    Blog bulunamadi.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
