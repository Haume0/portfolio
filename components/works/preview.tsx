"use client";

import MarkdownRenderer from "../md-renderer";
import type { IProject } from "@/lib/projects";
import { useEffect, useRef } from "react";
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
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
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
      className="fixed inset-0 z-50 size-full bg-dark/80 overflow-y-auto backdrop-blur-sm p-4 sm:p-6 md:p-8"
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
        className="max-w-6xl mx-auto flex flex-col"
      >
        <nav className="relative flex items-center whitespace-nowrap text-sm text-light/60 mb-4">
          <span className="text-light truncate min-w-0">{project.id}</span>
          <span className="mx-2 shrink-0">•</span>
          <span className="text-light truncate min-w-0">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </nav>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        <img
          src={project.image || "/main.webp"}
          alt={project.title}
          className="w-full aspect-289/226_ object-cover rounded-2xl shadow-2xl"
          loading="eager"
        />
        <article className="*:max-w-none [&_img]:w-full">
          <MarkdownRenderer content={project.content} />
        </article>
      </motion.div>
    </motion.section>
  );
}
