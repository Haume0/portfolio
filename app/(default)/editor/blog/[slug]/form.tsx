"use client";

import dynamic from "next/dynamic";
import { useActionState, useState } from "react";

import type { IBlog } from "@/lib/blogs";

import { updateBlog } from "../action";

// BlockNote DOM'a ihtiyaç duyuyor, sunucuda render edilemez.
const NotionEditor = dynamic(() => import("@/components/notion-editor"), {
  ssr: false,
  loading: () => <div className="min-h-80 rounded-xl bg-body" />,
});

export default function BlogEditForm(props: { blog: IBlog }) {
  const [coverName, setCoverName] = useState<string | null>(null);
  const [state, action, pending] = useActionState(updateBlog, null);
  const blog = props.blog;

  return (
    <form
      action={action}
      className="bg-dark rounded-4xl p-4 sm:p-6 grid grid-cols-1 gap-4"
    >
      <input type="hidden" name="slug" value={blog.slug} />

      <input
        name="title"
        required
        placeholder="Yazı başlığı"
        defaultValue={blog.title}
        className="text-field"
      />

      <label className="group relative cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>
            <h2 className="font-extrabold text-3xl sm:text-5xl">
              Kapak Görseli
            </h2>
            <p className="font-light text-lg md:text-xl text-white/60">
              Yeni görsel seçmezsen mevcut kapak korunur.
            </p>
          </span>
          <span className="main-button bg-white! text-black! group-hover:bg-blog! group-hover:text-white!">
            Görsel Seç
          </span>
        </span>
        <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
          {coverName || blog.cover || "Henüz kapak seçilmedi"}
        </span>
        {/* Input kutuyu kaplar; label'a bırakılan dosya input'a ulaşmadığı için sürükle-bırak ancak böyle çalışır. */}
        <input
          type="file"
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          name="thumb"
          accept="image/*"
          onChange={(event) => {
            setCoverName(event.target.files?.[0]?.name || null);
          }}
        />
      </label>

      {/* Kayıttan sonra editör kalıcı asset linkleriyle yeniden kurulur; aksi
          halde taşınmış temp görsellerin linkleri bir sonraki kayıtta kırılır. */}
      <NotionEditor
        key={blog.updated}
        name="content"
        defaultValue={blog.content}
      />

      <div className="flex justify-end">
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
    </form>
  );
}
