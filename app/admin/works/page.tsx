"use client";
import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import { addWork } from "./action";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import WorkCard from "@/components/WorkCard";

export interface WorkPost {
  id: string;
  slug?: string;
  title: string;
  description: string;
  content: string;
  object?: string;
  link?: {
    name: string;
    url: string;
  };
  image: string | null;
  is_published: boolean;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  embeds: string[];
}

export default function WorksAdminPage() {
  const [secret, setSecret] = useState("");
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  const [works, setWorks] = useState<WorkPost[] | null>(null);
  async function getWorks() {
    const datas = await pb.collection("works").getFullList({
      sort: "-created",
    });

    setWorks(datas as WorkPost[]);
  }
  useEffect(() => {
    //saving to sessionstorage
    if (secret) {
      sessionStorage.setItem("secret", secret);
    }
  }, [secret]);
  useEffect(() => {
    getWorks();
    //loading from sessionstorage
    const storedSecret = sessionStorage.getItem("secret");
    if (storedSecret) {
      setSecret(storedSecret);
    }
  }, []);
  return (
    <>
      <div className="p-4 space-y-6 sm:p-6 md:p-8">
        <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
          <Header hideStar />
        </div>
        {/*CONTENT*/}
        <section className="bg-works p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
          <input
            type="password"
            name="secret"
            required
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Güvenlik kodunu girin."
            className="text-field"
          />
        </section>
        <section className="bg-works p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
          <form
            action={async (e) => {
              await addWork(e);
              getWorks();
            }}
            className="space-y-4"
          >
            <input
              type="hidden"
              name="secret"
              required
              value={secret}
              placeholder="Güvenlik kodunu girin."
              className="text-field"
            />
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-white/55 text-sm sm:text-base">
                  Works Admin
                </p>
                <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-none">
                  Proje Ekle
                </h1>
                <p className="mt-3 max-w-3xl font-light text-base sm:text-lg text-white/80">
                  Manuel proje girisi yapabilir veya zip ile markdown icerigini
                  ice alabilirsin. Zip yuklemezsen kayit bos content ile olusur.
                </p>
              </div>
            </div>
            <div className="rounded-3xl flex-1 bg-dark p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-bold text-2xl sm:text-3xl">
                  Temel Alanlar
                </h2>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <div className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.24em] text-white/45 px-2">
                    URL ID
                  </span>
                  <input
                    type="text"
                    name="id"
                    placeholder="hostlayici"
                    className="text-field"
                  />
                </div>
                <div className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.24em] text-white/45 px-2">
                    Title
                  </span>
                  <input
                    type="text"
                    name="title"
                    placeholder="hostlayici.com"
                    className="text-field"
                  />
                </div>
                <div className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.24em] text-white/45 px-2">
                    Description
                  </span>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Website re-design for Hostlayici Hosting Platform."
                    className="px-5 py-4 w-full outline-hidden text-white bg-body focus:bg-white focus:text-body rounded-xl font-medium text-xl font-sora ease-in-out duration-200 min-h-28 resize-y"
                  />
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-[13rem_minmax(0,1fr)]">
                <div className="grid gap-2">
                  <span className="text-sm uppercase tracking-[0.24em] text-white/45 px-2">
                    Object
                  </span>
                  <div className="relative">
                    <select
                      name="object"
                      defaultValue="center"
                      className="text-field appearance-none pr-12"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top left">Top Left</option>
                      <option value="top right">Top Right</option>
                      <option value="bottom left">Bottom Left</option>
                      <option value="bottom right">Bottom Right</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-white/50 text-xs">
                      ▼
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="grid gap-2 w-44">
                    <span className="text-sm uppercase tracking-[0.24em] text-white/45 px-2">
                      Link Text
                    </span>
                    <input
                      type="text"
                      name="linkName"
                      defaultValue="Visit"
                      placeholder="Visit"
                      className="text-field"
                    />
                  </div>
                  <div className="flex-1 grid gap-2">
                    <span className="text-sm uppercase tracking-[0.24em] text-white/45 px-2">
                      Link URL
                    </span>
                    <input
                      type="url"
                      name="linkUrl"
                      placeholder="https://ornek.com"
                      className="text-field min-w-0"
                    />
                  </div>
                  <button className="main-button w-full sm:w-auto px-8">
                    Yayınla
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <div className="rounded-3xl bg-dark p-4 sm:p-5 grid gap-4">
                <h2 className="font-bold text-2xl sm:text-3xl">Dosyalar</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <label
                    htmlFor="work"
                    className="rounded-2xl bg-body p-4 sm:p-5 flex min-h-32 flex-col justify-between gap-4 text-left hover:bg-white hover:text-black focus-within:bg-white focus-within:text-black transition-colors duration-200"
                  >
                    <span>
                      <span className="block text-sm uppercase tracking-[0.24em] opacity-55 mb-2">
                        Markdown Zip
                      </span>
                      <span className="block text-2xl font-bold leading-tight">
                        Proje Yükle
                      </span>
                      <span className="block text-sm opacity-65 mt-2">
                        Opsiyonel import
                      </span>
                    </span>
                    <input
                      type="file"
                      className="appearance-none leading-3 text-sm opacity-70 file:hidden"
                      name="work"
                      id="work"
                      accept=".zip"
                    />
                  </label>
                  <label
                    htmlFor="thumb"
                    className="rounded-2xl bg-body p-4 sm:p-5 flex min-h-32 flex-col justify-between gap-4 text-left hover:bg-white hover:text-black focus-within:bg-white focus-within:text-black transition-colors duration-200"
                  >
                    <span>
                      <span className="block text-sm uppercase tracking-[0.24em] opacity-55 mb-2">
                        Cover Image
                      </span>
                      <span className="block text-2xl font-bold leading-tight">
                        Kapak Görseli
                      </span>
                      <span className="block text-sm opacity-65 mt-2">
                        Boş bırakılabilir
                      </span>
                    </span>
                    <input
                      type="file"
                      className="appearance-none leading-3 text-sm opacity-70 file:hidden"
                      name="thumb"
                      id="thumb"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </section>
        <section className="bg-about p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
          <h1 className="text-3xl font-extrabold mb-2">Projeleri Düzenle</h1>
          {works && works.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              key="work-list"
            >
              {works.map((work) => (
                <article
                  key={work.id}
                  className="rounded-4xl bg-body p-3 flex flex-col gap-3"
                >
                  <WorkCard
                    target="_self"
                    className="w-full! max-w-none!"
                    id={work.id}
                    image={
                      work.image
                        ? `${pb.baseURL}/api/files/${work.collectionId}/${work.id}/${work.image}`
                        : "/main.webp"
                    }
                    title={work.title}
                    description={work.description}
                    object={work.object}
                    link={{
                      name: "Detail",
                      url: `/works/${work.slug || work.id}`,
                    }}
                  />
                  <div className="px-2 pb-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4 text-sm sm:text-base text-white/50">
                      <span>{work.id}</span>
                      <span>
                        {work.created
                          ? new Date(work.created).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Bilinmiyor"}
                      </span>
                    </div>
                    {work.link?.url ? (
                      <div className="text-sm text-white/50 truncate">
                        {work.link.name}: {work.link.url}
                      </div>
                    ) : null}
                    {work.slug ? (
                      <div className="text-sm text-white/40 truncate">
                        /works/{work.slug}
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                      <span className="text-white/60">
                        {work.is_published ? "Published" : "Draft"}
                      </span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={async () => {
                            if (!secret) {
                              alert("Kodu gir!");
                              return;
                            }
                            await pb.collection("works").update(
                              work.id,
                              {
                                ...work,
                                is_published: !work.is_published,
                              },
                              {
                                query: {
                                  auth: secret,
                                },
                              },
                            );
                            await getWorks();
                          }}
                          className="text-orange-500 hover:underline"
                        >
                          {work.is_published ? "Yayından Çek" : "Yayınla"}
                        </button>
                        <button
                          onClick={async () => {
                            if (!secret) {
                              alert("Kodu gir.");
                              return;
                            }
                            if (confirm("Bu projeyi silmekten emin misiniz?")) {
                              await pb.collection("works").delete(work.id, {
                                query: {
                                  auth: secret,
                                },
                              });
                              await getWorks();
                            }
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center m-auto">
              <Icon icon="material-symbols:sad-tab-rounded" fontSize="7rem" />
              <h3 className="text-5xl font-black text-milk mb-2">
                Ops, Not Found
              </h3>
              <p className="text-milk/60 max-w-md">
                Şu anda listelenecek bir proje yok.
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
