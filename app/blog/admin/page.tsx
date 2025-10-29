"use client";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import { addBlog } from "./action";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageTrace from "@/components/imagetrace";
import { Icon } from "@iconify/react";

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
    const [secret, setSecret] = useState("");
    const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
    const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
    async function getBlogs() {
        let datas = await pb.collection("blogs").getFullList({
            sort: "-created",
        });

        setBlogs(datas as BlogPost[]);
    }
    useEffect(() => {
        getBlogs();
    }, []);
    return (
        <>
            <div className="p-4 space-y-6 sm:p-6 md:p-8">
                <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
                    <Header hideStar />
                </div>
                {/*CONTENT*/}
                <section className="bg-blog p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
                    <input
                        type="text"
                        name="secret"
                        required
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Güvenlik kodunu girin."
                        className="text-field"
                    />
                </section>
                <section className="bg-blog p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
                    <form
                        action={async (e) => {
                            await addBlog(e);
                            getBlogs();
                        }}
                        className="flex items-center gap-2 w-full"
                    >
                        <h1 className="text-3xl font-extrabold mr-auto mb-2">
                            Blog Yazısı Ekle
                        </h1>
                        <input
                            type="hidden"
                            name="secret"
                            required
                            value={secret}
                            placeholder="Güvenlik kodunu girin."
                            className="text-field"
                        />
                        <label
                            htmlFor="blog"
                            className="main-button relative shrink-0 !gap-0 flex-col !items-start text-start"
                        >
                            Blog Yükle
                            <input
                                type="file"
                                className="appearance-none leading-3 text-xs"
                                name="blog"
                                id="blog"
                                accept=".zip"
                            />
                        </label>
                        <label
                            htmlFor="thumb"
                            className="main-button relative shrink-0 !gap-0 flex-col !items-start text-start"
                        >
                            Kapak Görseli
                            <input
                                type="file"
                                className="appearance-none leading-3 text-xs"
                                name="thumb"
                                id="thumb"
                                accept="image/*"
                            />
                        </label>
                        <button className="main-button shrink-0 leading-0 col-span-2">
                            Yayınla
                        </button>
                    </form>
                </section>
                <section className="bg-about p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Blog Yazılarını Düzenle
                    </h1>
                    {blogs && blogs.length > 0 ? (
                        <div className="flex flex-col gap-4" key="blog-list">
                            {blogs.map((blog, i) => (
                                <span key={blog.id}>
                                    <article
                                        className={`relative group items-center rounded-2xl bg-body ease-spring-stiff duration-500 flex gap-4 sm:gap-8 p-4 md:p-0`}
                                    >
                                        <span className="size-full p-0 md:p-5 items-center gap-2 md:gap-3 flex flex-row *:text-start">
                                            <span className="text-primary text-2xl sm:text-3xl leading-0">
                                                #
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
                                                {blog.id}
                                            </p>
                                            <p className="text-xs sm:text-sm text-light/60 text-center sm:text-right">
                                                {blog.created
                                                    ? new Date(
                                                          blog.created,
                                                      ).toLocaleDateString(
                                                          "tr-TR",
                                                          {
                                                              year: "numeric",
                                                              month: "long",
                                                              day: "numeric",
                                                          },
                                                      )
                                                    : "Bilinmiyor"}
                                            </p>
                                            <button
                                                onClick={async () => {
                                                    if (!secret) {
                                                        alert("Kodu gir!");
                                                        return;
                                                    }
                                                    await pb
                                                        .collection("blogs")
                                                        .update(
                                                            blog.id,
                                                            {
                                                                ...blog,
                                                                is_published:
                                                                    !blog.is_published,
                                                            },
                                                            {
                                                                query: {
                                                                    auth: secret,
                                                                },
                                                            },
                                                        );
                                                    await getBlogs();
                                                }}
                                                className="text-orange-500 hover:underline text-base sm:text-lg"
                                            >
                                                {blog.is_published
                                                    ? "Yayından Çek"
                                                    : "Yayınla"}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!secret) {
                                                        alert("Kodu gir.");
                                                        return;
                                                    }
                                                    if (
                                                        confirm(
                                                            "Bu yazıyı silmekten emin misiniz?",
                                                        )
                                                    ) {
                                                        await pb
                                                            .collection("blogs")
                                                            .delete(blog.id, {
                                                                query: {
                                                                    auth: secret,
                                                                },
                                                            });
                                                        await getBlogs();
                                                    }
                                                }}
                                                className="text-red-500 hover:underline text-base sm:text-lg"
                                            >
                                                Sil
                                            </button>
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
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center m-auto">
                            <Icon
                                icon="material-symbols:sad-tab-rounded"
                                fontSize="7rem"
                            />
                            <h3 className="text-5xl font-black text-milk mb-2">
                                Ops, Not Found
                            </h3>
                            <p className="text-milk/60 max-w-md">
                                There are no blog posts available at the moment.
                                Please check back later.
                            </p>
                        </div>
                    )}
                </section>
                {/*CONTENTEND*/}
            </div>
            <Footer />
        </>
    );
}
