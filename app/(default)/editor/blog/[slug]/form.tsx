"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import MarkdownEditor from "@/components/markdown-editor";
import type { IBlog } from "@/lib/blogs";

import { uploadAsset } from "../../assets";
import { updateBlog } from "../action";

export default function EditBlogForm({ blog }: { blog: IBlog }) {
  const [state, action, pending] = useActionState(updateBlog, null);
  const [coverName, setCoverName] = useState<string | null>(null);

  return (
    <form
      action={action}
      className="max-w-4xl mx-auto w-full flex flex-col gap-4"
    >
      <input type="hidden" name="slug" value={blog.slug} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/editor/blog"
          className="main-button bg-dark! hover:bg-white! hover:text-black! w-full! sm:w-max!"
        >
          Bloglar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="main-button w-full! disabled:pointer-events-none disabled:opacity-60 sm:w-max!"
        >
          {pending ? "Kaydediliyor" : "Kaydet"}
        </button>
      </div>

      {state && (
        <p className="font-light text-lg md:text-xl rounded-2xl bg-blog py-3 px-4">
          {state}
        </p>
      )}

      <input
        name="title"
        required
        placeholder="Blog başlığı"
        defaultValue={blog.title}
        className="text-field"
      />

      <label className="group cursor-pointer rounded-3xl bg-dark p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 ease-smooth duration-300">
        <span className="relative flex size-32 shrink-0 overflow-hidden rounded-3xl bg-body sm:size-40">
          {blog.cover ? (
            // Neden: Kapak aynı adla (cover.png) değişebildiği için önbellekteki eski görsel gösterilmesin.
            <img
              src={`${blog.cover}?v=${blog.updated}`}
              alt={blog.title}
              className="size-full object-cover object-center"
            />
          ) : (
            <span className="m-auto px-4 text-center font-light text-white/40">
              Görsel yok
            </span>
          )}
        </span>
        <span className="flex flex-col gap-3 flex-1">
          <span>
            <h2 className="font-extrabold text-3xl sm:text-5xl">
              Kapak Görseli
            </h2>
            <p className="font-light text-lg md:text-xl text-white/60">
              Seçmezsen mevcut kapak korunur.
            </p>
          </span>
          <span className="font-light text-base md:text-lg rounded-2xl bg-body py-2 px-4 text-white/70">
            {coverName || "Yeni kapak seçilmedi"}
          </span>
        </span>
        <span className="main-button bg-white! text-black! group-hover:bg-blog! group-hover:text-white!">
          Görsel Seç
        </span>
        <input
          type="file"
          className="sr-only"
          name="cover"
          accept="image/*"
          onChange={(event) => {
            setCoverName(event.target.files?.[0]?.name || null);
          }}
        />
      </label>

      <article className="max-w-none mt-4">
        <MarkdownEditor
          name="content"
          markdown={blog.content}
          upload={uploadAsset.bind(null, "blogs", blog.slug)}
        />
      </article>
    </form>
  );
}
