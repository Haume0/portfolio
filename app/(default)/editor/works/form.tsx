"use client";

import { useActionState, useState } from "react";

import { addProject } from "./action";

export default function AddProjectForm() {
    const [imageName, setImageName] = useState<string | null>(null);
    const [notionName, setNotionName] = useState<string | null>(null);
    const [state, action, pending] = useActionState(addProject, null);

    return (
        <form
            action={action}
            className="bg-dark rounded-4xl p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            <input
                name="id"
                required
                placeholder="project-id"
                className="text-field"
            />
            <input
                name="title"
                required
                placeholder="Project title"
                className="text-field"
            />
            <input
                name="description"
                required
                placeholder="Card description"
                className="text-field md:col-span-2"
            />
            <input
                name="object"
                placeholder="object position, örn: top-left"
                className="text-field md:col-span-2"
            />
            <input
                name="linkName"
                required
                placeholder="Link name, örn: Visit"
                className="text-field"
            />
            <input
                name="linkUrl"
                required
                placeholder="https://..."
                className="text-field"
            />

            <label className="group cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
                <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span>
                        <h2 className="font-extrabold text-3xl sm:text-5xl">
                            Card Image
                        </h2>
                        <p className="font-light text-lg md:text-xl text-white/60">
                            /works/&lt;id&gt;/image.ext olarak yazılır.
                        </p>
                    </span>
                    <span className="main-button bg-white! text-black! group-hover:bg-works! group-hover:text-white!">
                        Görsel Seç
                    </span>
                </span>
                <span className="font-light text-base md:text-lg rounded-2xl bg-dark py-2 px-4 text-white/70">
                    {imageName || "Henüz görsel seçilmedi"}
                </span>
                <input
                    type="file"
                    className="sr-only"
                    name="image"
                    accept="image/*"
                    required
                    onChange={(event) => {
                        setImageName(event.target.files?.[0]?.name || null);
                    }}
                />
            </label>

            <label className="group cursor-pointer rounded-3xl bg-body p-4 sm:p-6 flex flex-col gap-4 ease-smooth duration-300">
                <span className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span>
                        <h2 className="font-extrabold text-3xl sm:text-5xl">
                            Notion Zip
                        </h2>
                        <p className="font-light text-lg md:text-xl text-white/60">
                            Opsiyonel proje detay markdown'u.
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

            <label className="font-light text-lg md:text-xl rounded-2xl bg-body py-3 px-4 flex gap-3 items-center md:col-span-2">
                <input
                    type="checkbox"
                    name="published"
                    value="true"
                    defaultChecked
                    className="size-5 accent-white"
                />
                Yayında oluştur
            </label>

            <div className="flex md:col-span-2 justify-end">
                <button
                    disabled={pending}
                    className="main-button w-full! disabled:pointer-events-none disabled:opacity-60 sm:w-max!"
                >
                    {pending ? "Kaydediliyor" : "Proje Ekle"}
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
