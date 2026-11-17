"use client";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useContact } from "@/components/contact";
import useTechs from "@/store/techstack";

const spring = { type: "spring", damping: 25, stiffness: 200 } as const;

export default function Askolotl() {
  const [open, setOpen] = useState(false);
  // Sorulan soruların index'leri, soruluş sırasıyla; konuşma akışı buradan türetilir.
  const [asked, setAsked] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const contact = useContact();
  const techs = useTechs((state) => state.techs);

  // Kaydırılan sohbet içeriğinin üst/alt kenarlarını sert kırpmak yerine yumuşakça soldurur.
  const updateScrollFade = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const fade = 32;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const top = Math.min(Math.max(el.scrollTop, 0), fade);
    const bottom = Math.min(Math.max(maxScroll - el.scrollTop, 0), fade);
    const mask = `linear-gradient(to bottom, transparent 0, black ${top}px, black calc(100% - ${bottom}px), transparent 100%)`;
    el.style.maskImage = mask;
    el.style.webkitMaskImage = mask;
  }, []);

  const questions: { question: string; answer: ReactNode }[] = [
    {
      question: "Who are you?",
      answer: (
        <>
          Me? just a handsome little amphibian, oh and Haume is cool too. He's a
          self-taught Product Designer & Developer.
        </>
      ),
    },
    {
      question: "What can you build for me?",
      answer: (
        <>
          Sorry tiny hands! but Haume can create; Brand identity, ui designs,
          websites, desktop and mobile apps.
          <Link href="/works" className="askolotl-action">
            → Check it out.
          </Link>
        </>
      ),
    },
    {
      question: "What's you using?",
      answer: <>{techs.map((tech) => tech.name).join(", ")}.</>,
    },
    {
      question: "Can we work together?",
      answer: (
        <>
          Obviously! Tell Haume about your idea and he'll get back to you.
          <button
            type="button"
            onClick={() => {
              // Askolotl modalı açık kalırsa Contact modalının üstünde durur; önce kapatılır.
              setOpen(false);
              contact.open({ title: "Let's work together" });
            }}
            className="askolotl-action"
          >
            → Tell Haume
          </button>
        </>
      ),
    },
    {
      question: "Why an axolotl?",
      answer: <>no idea tbh</>,
    },
    // Şaka: serbest soru yok, hazır sorular var.
    { question: "Can I ask my own question?", answer: "No." },
  ];
  const remaining = questions
    .map((_, i) => i)
    .filter((i) => !asked.includes(i));

  useEffect(() => {
    if (!typing) return;
    const timeout = setTimeout(() => setTyping(false), 700);
    return () => clearTimeout(timeout);
  }, [typing]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: yeni soru veya cevap geldiğinde en alta kaydırmak için tetikleyici olarak kullanılıyorlar.
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
    updateScrollFade();
  }, [asked.length, typing]);

  useEffect(() => {
    if (!open) return;
    updateScrollFade();
    window.addEventListener("resize", updateScrollFade);
    return () => window.removeEventListener("resize", updateScrollFade);
  }, [open, updateScrollFade]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="main-button transition-colors"
      >
        <img src="/axo.webp" alt="" className="size-9" />
        Askolotl
      </button>
      {/* Buton, transform animasyonlu About içinde durduğu için fixed modal body'ye portal edilir; yoksa viewport yerine o elemana göre konumlanır.
          Portal AnimatePresence'ın çocuğu olarak kalır ki works preview modalı gibi çıkış animasyonu oynasın. */}
      <AnimatePresence>
        {open && (
          // AnimatePresence portal'ı geçerli çocuk saymaz; keyed Fragment ile sarılınca çıkış animasyonu portal içinde de çalışır.
          <Fragment key="askolotl">
            {createPortal(
              <motion.section
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
                transition={{ duration: 0.3 }}
                // Mobilde panel alta yaslanır ve kısalır; köşedeki kapatma butonu panelin üstüne binmez.
                className="fixed inset-0 z-50 flex size-full cursor-zoom-out items-end sm:items-center justify-center bg-dark/80 backdrop-blur-sm p-4 sm:p-6 md:p-8"
              >
                <motion.button
                  type="button"
                  aria-label="Close"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  // Kısa kendi geçişi: girişteki spring+delay'i miras alırsa modal kapanırken bu butonu bekler.
                  exit={{ scale: 0, rotate: 90, transition: { duration: 0.2 } }}
                  transition={{ ...spring, delay: 0.2 }}
                  className="main-button absolute right-8 top-8 text-2xl p-0! size-12! items-center justify-center flex aspect-square rounded-2xl bg-dark! hover:bg-white!"
                >
                  <Icon icon="ion:close" />
                </motion.button>
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Askolotl"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: 80,
                    opacity: 0,
                    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] },
                  }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="relative flex cursor-default flex-col overflow-hidden w-full max-w-[44rem] h-[min(52rem,calc(100dvh-7rem))] sm:h-[min(52rem,calc(100dvh-4rem))] rounded-[1.25rem] bg-dark shadow-2xl"
                >
                  {/* Glow: hero'daki uzay görselinin ufuk ışığı yoğun blur ile ışımaya dönüşür; 180° çevrilince dünya sol üste gelir. */}
                  <img
                    src="/main.webp"
                    alt=""
                    className="pointer-events-none absolute inset-0 size-full rotate-180 scale-150 object-cover opacity-50 blur-3xl"
                  />
                  <div className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-main/30 blur-3xl" />
                  <div className="relative p-5 pb-0">
                    <img src="/axo.webp" alt="" className="size-16" />
                  </div>

                  <div
                    ref={listRef}
                    onScroll={updateScrollFade}
                    className="hidden-scroll relative flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-5"
                  >
                    <p className="mb-3 text-3xl font-extrabold leading-tight">
                      <span className="font-light text-white/40">Hi there</span>
                      <br />
                      How can I help you?
                    </p>
                    {asked.map((index, position) => (
                      <div key={index} className="flex flex-col gap-3">
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={spring}
                          className="ml-auto max-w-[85%] rounded-2xl bg-main px-4 py-2.5 text-white"
                        >
                          {questions[index].question}
                        </motion.p>
                        {/* Son soru için cevap, kısa bir "yazıyor" süresinden sonra gelir. */}
                        {typing && position === asked.length - 1 ? (
                          <div className="flex w-max gap-1 rounded-2xl bg-body/80 p-4 backdrop-blur-md">
                            {[0, 1, 2].map((dot) => (
                              <motion.span
                                key={dot}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: dot * 0.15,
                                }}
                                className="size-1.5 rounded-full bg-white"
                              />
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={spring}
                            className="mr-auto flex max-w-[85%] flex-col items-start rounded-2xl bg-body/80 p-4 font-light backdrop-blur-md"
                          >
                            <span className="mb-2 flex items-center gap-2 text-sm font-normal text-white/40">
                              <span className="flex size-7 items-center justify-center rounded-lg">
                                <img
                                  src="/axo.webp"
                                  alt=""
                                  className="size-7"
                                />
                              </span>
                              Askolotl
                            </span>
                            {questions[index].answer}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="relative flex flex-col items-end gap-2 p-5 pt-2">
                    {(remaining.length ? remaining : [-1]).map((index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={typing}
                        onClick={() => {
                          if (index === -1) return setAsked([]);
                          setAsked((prev) => [...prev, index]);
                          setTyping(true);
                        }}
                        className="rounded-xl bg-body px-4 py-2.5 text-left font-medium hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black outline-hidden duration-200 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {index === -1
                          ? "Start over"
                          : questions[index].question}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.section>,
              document.body,
            )}
          </Fragment>
        )}
      </AnimatePresence>
    </>
  );
}
