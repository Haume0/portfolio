"use client";
import { Icon } from "@iconify/react";
import {
  AnimatePresence,
  type MotionStyle,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import ImageTrace from "@/components/imagetrace";
import WorksPreview from "@/components/works/preview";
import type { IProject } from "@/lib/projects";
import useSocials from "@/store/socials";

const spring = { type: "spring", damping: 25, stiffness: 100 } as const;

export default function WorksIndex({ projects }: { projects: IProject[] }) {
  const socials = useSocials();
  const [view, setView] = useState<"grid" | "index">("grid");
  const [inspect, setInspect] = useState<IProject>();

  return (
    // overflow-x-clip: index modunda ImageTrace imleçle sağ kenara gelince yatay scroll açmasın;
    // clip (hidden değil) dikeyi serbest bırakır, görsel satırların üstüne taşabilir
    <section className="bg-works p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl overflow-x-clip">
      {inspect && (
        <WorksPreview onClose={() => setInspect(undefined)} project={inspect} />
      )}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        {/* Hero ile aynı ölçek: font-size 15cqw ile sınırlı, dar ekranda taşmaz */}
        <div className="@container flex-1 flex flex-col items-start">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ ...spring, delay: 0.3 }}
            className="font-lato font-black uppercase text-white leading-[88%] text-[min(4.5rem,15cqw)] sm:text-[min(9rem,15cqw)]"
          >
            All Works
            {/*<sup className="font-sora font-light text-[0.3em] ml-2">
              ({projects.length})
            </sup>*/}
          </motion.h1>
          <motion.p
            initial={{ y: "-40%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ ...spring, delay: 0.5 }}
            className="font-medium text-lg sm:text-xl mt-4"
          >
            Everything I've designed & built, in one place ✦
          </motion.p>
        </div>
        <motion.div
          initial={{ x: "40%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ ...spring, delay: 0.4 }}
          className="flex flex-wrap gap-2 lg:justify-end"
        >
          {(["grid", "index"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={`main-button capitalize ${view === option ? "bg-white! text-black!" : ""}`}
            >
              <Icon icon={option === "grid" ? "ion:grid" : "ion:list"} />
              {option}
            </button>
          ))}
          <a
            href={socials.getSocial("GitHub")?.url}
            target="_blank"
            rel="noopener"
            className="main-button"
          >
            <Icon icon="mdi:github" className="text-2xl" />
            GitHub
          </a>
          <a
            href={socials.getSocial("Behance")?.url}
            target="_blank"
            rel="noopener"
            className="main-button"
          >
            <Icon icon="mdi:behance" className="text-2xl" />
            Behance
          </a>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <WorksGrid key="grid" projects={projects} onInspect={setInspect} />
        ) : (
          <motion.ul
            key="index"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2 mt-12"
          >
            {projects.map((project, idx) => (
              <motion.li
                key={project.id}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ...spring, delay: idx * 0.04 }}
                className="relative hover:z-10"
              >
                <button
                  type="button"
                  onClick={() => setInspect(project)}
                  className="group w-full flex items-center gap-4 sm:gap-8 p-4 sm:px-6 rounded-2xl bg-body text-left cursor-pointer ease-smooth duration-500 hover:bg-milk hover:text-dark focus-visible:bg-milk focus-visible:text-dark outline-none"
                >
                  <span className="font-mono text-sm sm:text-base opacity-50 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 min-w-0 font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight truncate">
                    {project.title}
                  </span>
                  <span className="hidden lg:line-clamp-2 w-1/3 font-light text-lg leading-tight opacity-70">
                    {project.description}
                  </span>
                  <Icon
                    icon="ion:arrow-forward"
                    className="shrink-0 text-3xl ease-in-out duration-300 group-hover:-rotate-45"
                  />
                </button>
                {/* Blog listesindeki gibi kapak imleci takip eder; parent olarak li'yi dinler */}
                <ImageTrace image={project.image} title={project.title} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}

// Ayrı bileşen: useScroll hedef elemanı mount anında bağlar, grid ↔ index geçişinde yeniden kurulması gerekir
function WorksGrid({
  projects,
  onInspect,
}: {
  projects: IProject[];
  onInspect: (project: IProject) => void;
}) {
  const gridRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });
  // Orta sütun aşağıda başlar ve scroll'da diğerlerinden hızlı yükselir (zigzag parallax).
  // Yalnızca lg'deki 3 sütunlu düzende uygulanır; lg:pb-40 aşağı kaymanın payını bırakır.
  // Kayma li'ye değil içindeki button'a verilir: li satır hizasında kalır, böylece satırdaki
  // 3 kart görünüme aynı anda girer ve giriş gecikmesi soldan sağa düzgün kademelenir.
  const middleColumnY = useTransform(
    scrollYProgress,
    [0, 1],
    ["10rem", "-6rem"],
  );

  return (
    <motion.ul
      ref={gridRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={
        reduceMotion
          ? undefined
          : ({ "--column-y": middleColumnY } as MotionStyle)
      }
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 lg:pb-40 lg:[&>li:nth-child(3n+2)>button]:translate-y-(--column-y)"
    >
      {projects.map((project, idx) => (
        <motion.li
          key={project.id}
          // Ana sayfadaki works/tech kartlarıyla aynı giriş: scale(0.4) → 1, satır içinde kademeli
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ ...spring, delay: (idx % 3) * 0.2 }}
        >
          <button
            type="button"
            onClick={() => onInspect(project)}
            // Ana sayfa WorkCard mantığı: dinlenmede yalnızca kapak, hover/focus'ta kapak küçülüp
            // başlık+açıklamayı alttan açar. Kart kapak oranında sabit (border-box), padding
            // değişse de dış boyut aynı kalır ve grid zıplamaz. transition yalnızca padding/ring:
            // parallax translate'i de geçişe girerse kart scroll'un gerisinde kalır.
            className="group w-full aspect-2119/1657 flex flex-col gap-3 p-0 hover:p-3 focus-visible:p-3 rounded-3xl bg-dark text-left overflow-hidden cursor-pointer transition-[padding,box-shadow] ease-smooth duration-500 outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            {/* Yüzde yerine sabit pay: kart genişliği breakpoint'e göre değişse de metin alanı hep sığar */}
            <span className="relative block w-full h-full shrink-0 rounded-2xl overflow-hidden ease-smooth duration-500 group-hover:h-[calc(100%-6rem)] group-focus-visible:h-[calc(100%-6rem)]">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className={`size-full object-cover ${project.object === "top-left" ? "object-top-left" : "object-center"}`}
              />
              <span className="absolute top-3 right-3 flex items-center gap-2">
                <span className="h-12 px-5 flex items-center rounded-full bg-black/50 text-white backdrop-blur-xl opacity-0 translate-x-4 ease-smooth duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">
                  View Project
                </span>
                <span className="size-12 rounded-full bg-dark/50 backdrop-blur-xl text-2xl text-white flex items-center justify-center">
                  <Icon
                    icon="ion:arrow-forward"
                    className="ease-in-out duration-300 group-hover:-rotate-45"
                  />
                </span>
              </span>
            </span>
            <span className="flex flex-col min-w-0 px-2">
              <span className="font-bold text-2xl line-clamp-1">
                {project.title}
              </span>
              <span className="font-light text-base text-milk/70 line-clamp-2">
                {project.description}
              </span>
            </span>
          </button>
        </motion.li>
      ))}
    </motion.ul>
  );
}
