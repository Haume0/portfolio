"use client";
import useSocials from "@/store/socials";
import { AnimatePresence, motion } from "motion/react";
import { create } from "zustand";

interface ContactStore {
    show: boolean;
    predefine?: { title?: string; message?: string };
    open: (predefine?: { title?: string; message?: string }) => void;
    close: () => void;
}

export const useContact = create<ContactStore>((set) => ({
    show: false,
    open: (predefine) => set({ show: true, predefine: predefine }),
    close: () => set({ show: false }),
}));

export default function Contact(props: { className?: string }) {
    const socials = useSocials();
    const contact = useContact();
    return (
        <AnimatePresence>
            {contact.show && (
                <motion.div
                    onClick={() => contact.close()}
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    style={{
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                    }}
                    className="fixed inset-0 flex cursor-zoom-out flex-col gap-4 items-center justify-center bg-black/40 size-full z-50"
                >
                    <motion.h1
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        initial={{
                            y: "-40%",
                            opacity: 0,
                        }}
                        whileInView={{ y: "0%", opacity: 1 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 100,
                            delay: 0.2,
                        }}
                        id="about"
                        className="font-extrabold cursor-default text-6xl"
                    >
                        Contact Me
                    </motion.h1>
                    <motion.span
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        initial={{
                            scale: 0.8,
                            opacity: 0,
                        }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 100,
                            delay: 0.5,
                        }}
                    >
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                //get values
                                const target = e.target as HTMLFormElement;
                                const name = (
                                    target.elements.namedItem(
                                        "name",
                                    ) as HTMLInputElement
                                ).value;
                                const title = (
                                    target.elements.namedItem(
                                        "title",
                                    ) as HTMLInputElement
                                ).value;
                                const message = target.message.value;
                                const mailto = `mailto:haume341@outlook.com?subject=${encodeURIComponent(
                                    title,
                                )}&body=${encodeURIComponent(`💬 ${name},\n\n${message}`)}`;
                                window.open(mailto);
                            }}
                            className={`grid grid-cols-2 bg-dark p-2 gap-2 w-full sm:w-[44rem] rounded-[1.25rem] ${props.className}`}
                        >
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Name & Surname"
                                className="text-field"
                            />
                            <input
                                type="text"
                                name="title"
                                defaultValue={contact.predefine?.title}
                                required
                                placeholder="Subject"
                                className="text-field"
                            />
                            <textarea
                                onChange={(e) => {
                                    if (
                                        e.target.value.toLowerCase() ==
                                        "malemin"
                                    ) {
                                        e.target.value =
                                            "Ayıp ettin B., bunun hala çalışacağını mı sanıyorsun. 😅";
                                    }
                                }}
                                defaultValue={contact.predefine?.message}
                                required
                                name="message"
                                placeholder="Your message here..."
                                className="p-5 h-16 col-span-2 min-h-32 gap-2 flex w-full outline-hidden items-center justify-center text-white bg-body focus:bg-white focus:text-body rounded-xl font-medium text-xl font-sora ease-in-out duration-200"
                            ></textarea>
                            <button className="main-button w-full! col-span-2">
                                Send Mail
                            </button>
                        </form>
                        <ul className="grid grid-cols-2 mt-2 p-2 gap-2  bg-dark rounded-[1.25rem] grid-rows-2 sm:flex sm:flex-row items-center justify-center">
                            {socials.socials.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    className="main-button w-full!"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </ul>
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
