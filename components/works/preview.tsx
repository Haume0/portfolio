"use client";

import MarkdownRenderer from "../md-renderer";
import type { IProject } from "@/lib/projects";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";

const spring = { type: "spring", damping: 25, stiffness: 100 } as const;

// Açık proje URL'de tutulur (/works/:id): link paylaşılabilir ve doğrudan açılabilir.
// Native pushState Next router'ıyla senkron çalışır; sayfa yeniden render edilmeden
// usePathname güncellenir, geri tuşu da modalı kapatır.
// useState gibi kullanılır ama açık proje URL'de tutulur (/works/:id): link paylaşılabilir
// ve doğrudan açılabilir. Native pushState Next router'ıyla senkron çalışır; sayfa yeniden
// render edilmeden usePathname güncellenir, geri tuşu da modalı kapatır.
export function useInspect(projects: IProject[]) {
  const pathname = usePathname();
  // Modal bu sayfada pushState ile açıldıysa kapatmak history.back() olur; aksi halde
  // (link doğrudan açıldıysa) back siteden çıkaracağı için /works'e replace edilir.
  const pushed = useRef(false);

  const inspect = projects.find(
    (project) => pathname === `/works/${project.id}`,
  );
  const setInspect = (project?: IProject) => {
    if (project) {
      pushed.current = true;
      window.history.pushState(null, "", `/works/${project.id}`);
      return;
    }
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", "/works");
    }
  };

  return [inspect, setInspect] as const;
}

export default function WorksPreview({
  project,
  onClose,
}: {
  onClose: () => void;
  project: IProject;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLImageElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [coverRatio, setCoverRatio] = useState<number>();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const observer = new ResizeObserver(() =>
      setHeaderHeight(header.offsetHeight),
    );
    observer.observe(header);

    // Link doğrudan açıldığında görsel hydration'dan önce yüklenmiş olabilir; onLoad kaçar.
    const cover = coverRef.current;
    if (cover?.complete && cover.naturalWidth) {
      setCoverRatio(cover.naturalWidth / cover.naturalHeight);
    }

    return () => observer.disconnect();
  }, []);

  return (
    // Çıkış animasyonu için AnimatePresence içinde render edilmeli; overflow kilidi
    // unmount'ta, yani çıkış animasyonu bittikten sonra kalkar.
    <motion.section
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 size-full bg-dark/80 overflow-y-auto backdrop-blur-sm [--modal-p:1rem] sm:[--modal-p:1.5rem] md:[--modal-p:2rem] p-(--modal-p)"
    >
      <motion.button
        type="button"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        // Kendi kısa geçişi şart: aksi halde girişteki spring+delay'i miras alır ve
        // AnimatePresence modalı kaldırmak için ~1sn bu butonu bekler.
        exit={{ scale: 0, rotate: 90, transition: { duration: 0.2 } }}
        transition={{ ...spring, delay: 0.2 }}
        className="main-button absolute right-8 top-8 text-2xl p-0! size-12! items-center justify-center flex aspect-square rounded-2xl bg-dark! hover:bg-white!"
      >
        <Icon icon="ion:close" />
      </motion.button>
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
        }}
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{
          y: 80,
          opacity: 0,
          transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] },
        }}
        transition={{ ...spring, delay: 0.1 }}
        // Başlık + kapak ilk ekrana kırpılmadan sığsın diye kolon genişliği kalan yüksekliğe
        // göre kapağın en-boy oranından hesaplanır. İçerik görselleri de aynı kolonda
        // olduğundan hepsi kapakla aynı genişlikte kalır.
        style={{
          maxWidth: coverRatio
            ? `min(72rem, calc((100dvh - 2 * var(--modal-p) - ${headerHeight}px) * ${coverRatio}))`
            : undefined,
        }}
        className="max-w-6xl mx-auto flex flex-col"
      >
        <div ref={headerRef} className="@container flex flex-col gap-4 pb-4">
          <nav className="relative flex items-center whitespace-nowrap text-sm text-light/60">
            <span className="text-light truncate min-w-0">{project.id}</span>
            <span className="mx-2 shrink-0">•</span>
            <span className="text-light truncate min-w-0">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </nav>
          {/* Kolon kısa ekranlarda viewport'tan bağımsız daralabildiği için buton, viewport'a
              göre değil kolon genişliğine göre yana alınır; aksi halde kolondan taşıyor. */}
          <div className="flex flex-col gap-4 @xl:flex-row @xl:items-end @xl:justify-between">
            <span>
              <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-2">
                {project.title}
              </h1>
              <p className="font-light text-lg sm:text-xl lg:text-2xl">
                {project.description}
              </p>
            </span>
            <a
              href={project.link.url}
              target="_blank"
              rel="noreferrer"
              className="main-button bg-dark! hover:bg-white! shrink-0 w-max"
            >
              <Icon icon="ion:open-outline" />
              {project.link.name}
            </a>
          </div>
        </div>
        <img
          ref={coverRef}
          src={project.image || "/main.webp"}
          alt={project.title}
          onLoad={(e) =>
            setCoverRatio(
              e.currentTarget.naturalWidth / e.currentTarget.naturalHeight,
            )
          }
          className="w-full rounded-2xl shadow-2xl"
          loading="eager"
        />
        {/* MarkdownRenderer'ın yatay padding'i içerik görsellerini kapaktan dar yapıyordu. */}
        <article className="*:max-w-none *:px-0 [&_img]:w-full">
          <MarkdownRenderer content={project.content} />
        </article>
      </motion.div>
    </motion.section>
  );
}
