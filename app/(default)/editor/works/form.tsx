"use client";

import { startTransition, useActionState, useState } from "react";

import type { IProject } from "@/lib/projects";

import MarkdownEditor from "@/components/markdown-editor";

import { uploadAsset } from "../assets";
import { updateProject } from "./action";

// Her zaman var olan bir projeyi düzenler; yeni proje "Yeni Proje" ile açılan untitled-project taslağıdır.
export default function ProjectForm({ project }: { project: IProject }) {
  const [imageName, setImageName] = useState<string | null>(null);
  const [notionName, setNotionName] = useState<string | null>(null);
  const [state, action, pending] = useActionState(updateProject, null);

  return (
    <form
      // Neden: action prop'u her gönderimden sonra formu sıfırlıyor; yayına alma reddedildiğinde doldurulan
      // alanlar ve seçilen dosyalar kaybolmasın diye gönderim elle yapılır.
      onSubmit={(event) => {
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);
        startTransition(() => action(formdata));
      }}
      className="bg-dark rounded-4xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <span>
          <h2 className="font-extrabold text-4xl sm:text-6xl">Project Edit</h2>
          <p className="font-light text-lg md:text-xl text-white/60 mt-1">
            Kart bilgilerini, slug'i ve markdown içeriğini güncelle. Taslak
            eksik alanlarla kaydedilebilir; yayına almak için hepsi gerekli.
          </p>
        </span>
      </div>

      <input type="hidden" name="originalId" value={project.id} />

      <input
        name="id"
        required
        placeholder="project-id"
        defaultValue={project.id}
        className="text-field"
      />
      <input
        name="title"
        placeholder="Project title"
        defaultValue={project.title}
        className="text-field"
      />
      <input
        name="description"
        placeholder="Card description"
        defaultValue={project.description}
        className="text-field md:col-span-2"
      />
      <input
        name="object"
        placeholder="object position, örn: top-left"
        defaultValue={project.object}
        className="text-field md:col-span-2"
      />
      <input
        name="linkName"
        placeholder="Link name, örn: Visit"
        defaultValue={project.link.name}
        className="text-field"
      />
      <input
        name="linkUrl"
        placeholder="https://..."
        defaultValue={project.link.url}
        className="text-field"
      />

      <label className="group cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>
            <h2 className="font-extrabold text-3xl sm:text-5xl">Card Image</h2>
            <p className="font-light text-lg md:text-xl text-white/60">
              Yeni görsel seçmezsen mevcut kart görseli korunur.
            </p>
          </span>
          <span className="main-button bg-white! text-black! group-hover:bg-works! group-hover:text-white!">
            Görsel Seç
          </span>
        </span>
        <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
          {imageName || project.image || "Henüz görsel seçilmedi"}
        </span>
        <input
          type="file"
          className="sr-only"
          name="image"
          accept="image/*"
          onChange={(event) => {
            setImageName(event.target.files?.[0]?.name || null);
          }}
        />
      </label>

      <label className="group cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
        <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>
            <h2 className="font-extrabold text-3xl sm:text-5xl">Notion Zip</h2>
            <p className="font-light text-lg md:text-xl text-white/60">
              Seçilirse markdown ve assets yeniden yazılır.
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
          className="sr-only"
          name="notion"
          accept=".zip"
          onChange={(event) => {
            setNotionName(event.target.files?.[0]?.name || null);
          }}
        />
      </label>

      <div className="md:col-span-2 flex flex-col gap-3">
        <span>
          <h2 className="font-extrabold text-3xl sm:text-5xl">
            Markdown Content
          </h2>
          <p className="font-light text-lg md:text-xl text-white/60">
            Zip seçersen bu içerik zip içindeki markdown ile ezilir.
          </p>
        </span>
        {/* Neden: Sitedeki works detayı gibi tam genişlik ve tam genişlik görseller; iç boşluk editör kutusundan gelir. */}
        <article className="[&_.ProseMirror]:max-w-none [&_img]:w-full">
          <MarkdownEditor
            name="content"
            markdown={project.content}
            upload={uploadAsset.bind(null, "works", project.id)}
          />
        </article>
      </div>

      <label className="font-light text-lg md:text-xl rounded-2xl bg-body py-3 px-4 flex gap-3 items-center md:col-span-2">
        <input
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={project.published}
          className="size-5 accent-white"
        />
        Yayında
      </label>

      <div className="flex md:col-span-2 justify-end">
        <button
          type="submit"
          disabled={pending}
          className="main-button w-full! disabled:pointer-events-none disabled:opacity-60 sm:w-max!"
        >
          {pending ? "Kaydediliyor" : "Projeyi Güncelle"}
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
