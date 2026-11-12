"use client";

import { useActionState, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import type { IProject } from "@/lib/projects";

import { addProject, updateProject } from "./action";

// BlockNote DOM'a ihtiyaç duyuyor, sunucuda render edilemez.
const NotionEditor = dynamic(() => import("@/components/notion-editor"), {
  ssr: false,
  loading: () => <div className="min-h-80 rounded-xl bg-body" />,
});

export default function ProjectForm(props: { project?: IProject }) {
  const [imageName, setImageName] = useState<string | null>(null);
  const [notionName, setNotionName] = useState<string | null>(null);
  const [state, action, pending] = useActionState(
    props.project ? updateProject : addProject,
    null,
  );

  useEffect(() => {
    // Yeni proje kaydedilince form ve editör sıfırlansın; aksi halde editör
    // assets'e taşınmış temp görsellerin linklerini tutup sonraki kayda taşıyor.
    if (!props.project && state) window.location.reload();
  }, [props.project, state]);

  const project = props.project;

  return (
    <form
      action={action}
      className="bg-dark rounded-4xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <span>
          <h2 className="font-extrabold text-4xl sm:text-6xl">
            {project ? "Project Edit" : "New Project"}
          </h2>
          <p className="font-light text-lg md:text-xl text-white/60 mt-1">
            {project
              ? "Kart bilgilerini, slug'i ve markdown içeriğini güncelle."
              : "Yeni proje kartı ve opsiyonel detay içeriği oluştur."}
          </p>
        </span>
        {project && (
          <Link
            href="/editor/works"
            className="main-button bg-body! hover:bg-white! hover:text-black! w-full! sm:w-max!"
          >
            Yeni Proje
          </Link>
        )}
      </div>

      {project && <input type="hidden" name="originalId" value={project.id} />}

      <input
        name="id"
        required
        placeholder="project-id"
        defaultValue={project?.id}
        className="text-field"
      />
      <input
        name="title"
        required
        placeholder="Project title"
        defaultValue={project?.title}
        className="text-field"
      />
      <input
        name="description"
        required
        placeholder="Card description"
        defaultValue={project?.description}
        className="text-field md:col-span-2"
      />
      <input
        name="object"
        placeholder="object position, örn: top-left"
        defaultValue={project?.object}
        className="text-field md:col-span-2"
      />
      <input
        name="linkName"
        required
        placeholder="Link name, örn: Visit"
        defaultValue={project?.link.name}
        className="text-field"
      />
      <input
        name="linkUrl"
        required
        placeholder="https://..."
        defaultValue={project?.link.url}
        className="text-field"
      />

      <label className="group relative cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>
            <h2 className="font-extrabold text-3xl sm:text-5xl">Card Image</h2>
            <p className="font-light text-lg md:text-xl text-white/60">
              {project
                ? "Yeni görsel seçmezsen mevcut kart görseli korunur."
                : "/works/<id>/image.ext olarak yazılır."}
            </p>
          </span>
          <span className="main-button bg-white! text-black! group-hover:bg-works! group-hover:text-white!">
            Görsel Seç
          </span>
        </span>
        <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
          {imageName || (project ? project.image : "Henüz görsel seçilmedi")}
        </span>
        {/* Input kutuyu kaplar; label'a bırakılan dosya input'a ulaşmadığı için sürükle-bırak ancak böyle çalışır. */}
        <input
          type="file"
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          name="image"
          accept="image/*"
          required={!project}
          onChange={(event) => {
            setImageName(event.target.files?.[0]?.name || null);
          }}
        />
      </label>

      <label className="group relative cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>
            <h2 className="font-extrabold text-3xl sm:text-5xl">Notion Zip</h2>
            <p className="font-light text-lg md:text-xl text-white/60">
              {project
                ? "Seçilirse markdown ve assets yeniden yazılır."
                : "Opsiyonel proje detay markdown'u."}
            </p>
          </span>
          <span className="main-button bg-white! text-black! group-hover:bg-works! group-hover:text-white!">
            Zip Seç
          </span>
        </span>
        <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
          {notionName || "Henüz zip seçilmedi"}
        </span>
        <input
          type="file"
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          name="notion"
          accept=".zip"
          onChange={(event) => {
            setNotionName(event.target.files?.[0]?.name || null);
          }}
        />
      </label>

      <div className="md:col-span-2 flex flex-col gap-3">
        <span>
          <h2 className="font-extrabold text-3xl sm:text-5xl">Content</h2>
          <p className="font-light text-lg md:text-xl text-white/60">
            Zip seçersen bu alan zip içindeki markdown ile ezilir.
          </p>
        </span>
        {/* Kayıttan sonra editör kalıcı asset linkleriyle yeniden kurulur; aksi
            halde taşınmış temp görsellerin linkleri bir sonraki kayıtta kırılır. */}
        <NotionEditor
          key={project?.updated ?? "new-project"}
          name="content"
          defaultValue={project?.content ?? ""}
        />
      </div>

      <label className="font-light text-lg md:text-xl rounded-2xl bg-body py-3 px-4 flex gap-3 items-center md:col-span-2">
        <input
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={project?.published ?? true}
          className="size-5 accent-white"
        />
        Yayında oluştur
      </label>

      <div className="flex md:col-span-2 justify-end">
        <button
          type="submit"
          disabled={pending}
          className="main-button w-full! disabled:pointer-events-none disabled:opacity-60 sm:w-max!"
        >
          {pending
            ? "Kaydediliyor"
            : project
              ? "Projeyi Güncelle"
              : "Proje Ekle"}
        </button>
      </div>

      {state && (
        <p className="font-light text-lg md:text-xl rounded-2xl bg-works py-3 px-4 md:col-span-2">
          {state}
        </p>
      )}
    </form>
  );
}
