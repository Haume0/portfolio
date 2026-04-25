"use client";

import { useState, useActionState } from "react";
import { addBlog } from "./action";

export default function AddBlogForm() {
    const [blogName, setBlogName] = useState<string | null>(null);
    const [coverName, setCoverName] = useState<string | null>(null);
    const [state, action, pending] = useActionState(addBlog, null);
    return (
        <form
            action={action}
            className="bg-dark rounded-4xl p-4 sm:p-6 grid grid-cols-2 gap-4 lg:col-span-3"
        >
            <label
                htmlFor="blog"
                className="group cursor-pointer rounded-2xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300"
            >
                <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span>
                        <h2 className="font-extrabold text-3xl sm:text-5xl">
                            Blog Zip
                        </h2>
                        <p className="font-light text-lg md:text-xl text-white/60">
                            Notion export arşivi zorunlu.
                        </p>
                    </span>
                    <span className="main-button bg-white! text-black! group-hover:bg-blog! group-hover:text-white!">
                        Dosya Seç
                    </span>
                </span>
                <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
                    {blogName || "Henüz zip seçilmedi"}
                </span>
                <input
                    type="file"
                    className="sr-only"
                    name="blog"
                    id="blog"
                    accept=".zip"
                    required
                    onChange={(event) => {
                        setBlogName(event.target.files?.[0]?.name || null);
                    }}
                />
            </label>

            <label
                htmlFor="thumb"
                className="group cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300"
            >
                <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span>
                        <h2 className="font-extrabold text-3xl sm:text-5xl">
                            Kapak Görseli
                        </h2>
                        <p className="font-light text-lg md:text-xl text-white/60">
                            Opsiyonel, seçilmezse cover boş kalır.
                        </p>
                    </span>
                    <span className="main-button bg-white! text-black! group-hover:bg-blog! group-hover:text-white!">
                        Görsel Seç
                    </span>
                </span>
                <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
                    {coverName || "Henüz kapak seçilmedi"}
                </span>
                <input
                    type="file"
                    className="sr-only"
                    name="thumb"
                    id="thumb"
                    accept="image/*"
                    onChange={(event) => {
                        setCoverName(event.target.files?.[0]?.name || null);
                    }}
                />
            </label>

            <div className="flex col-span-2 justify-end">
                <button
                    disabled={pending}
                    className="main-button w-full! disabled:pointer-events-none disabled:opacity-60 sm:w-max!"
                >
                    {pending ? "Import Ediliyor" : "Import Et"}
                </button>
            </div>

            {state && (
                <p className="font-light text-lg md:text-xl rounded-2xl bg-blog py-3 px-4">
                    {state}
                </p>
            )}
        </form>
    );
}
