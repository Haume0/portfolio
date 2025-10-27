"use client";

import {
    AnimatePresence,
    motion,
    useSpring,
    useMotionValue,
} from "motion/react";
import { useState, useRef, useEffect } from "react";

// Detect Safari
const isSafari =
    typeof window !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default function ImageTrace(props: { image: string; title: string }) {
    const [isParentHovered, setIsParentHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const eheRef = useRef<HTMLDivElement>(null);

    // Motion values for smooth tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Safari için daha yumuşak spring ayarları
    const springConfig = isSafari
        ? { stiffness: 300, damping: 30, restDelta: 0.001 }
        : { stiffness: 500, damping: 40, restDelta: 0.01 };

    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Preload images
    useEffect(() => {
        const preloadImage = (src: string) => {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.src = src;
        };

        if (props.image) {
            preloadImage(props.image);
        } else {
            preloadImage("/default-blog-image.jpg");
        }

        preloadImage("/hero.png");
    }, [props.image]);

    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) return;

        const parentElement = containerElement.parentElement;
        if (!parentElement) return;

        const handleMouseMove = (event: MouseEvent) => {
            const parentRect = parentElement.getBoundingClientRect();
            const eheRect = eheRef.current?.getBoundingClientRect();

            const relativeX =
                event.clientX - parentRect.left - (eheRect?.width || 0) / 2;
            const relativeY =
                event.clientY - parentRect.top - (eheRect?.height || 0);

            // Safari için requestAnimationFrame kullan
            if (isSafari) {
                requestAnimationFrame(() => {
                    mouseX.set(relativeX);
                    mouseY.set(relativeY);
                });
            } else {
                mouseX.set(relativeX);
                mouseY.set(relativeY);
            }
        };

        const handleMouseEnter = (event: MouseEvent) => {
            setIsParentHovered(true);
            const parentRect = parentElement.getBoundingClientRect();
            const eheRect = eheRef.current?.getBoundingClientRect();

            if (eheRect) {
                const relativeX =
                    event.clientX - parentRect.left - (eheRect?.width || 0) / 2;
                const relativeY =
                    event.clientY - parentRect.top - (eheRect?.height || 0);

                mouseX.set(relativeX);
                mouseY.set(relativeY);
            }
        };

        const handleMouseLeave = () => {
            setIsParentHovered(false);
        };

        parentElement.addEventListener("mouseenter", handleMouseEnter);
        parentElement.addEventListener("mouseleave", handleMouseLeave);
        parentElement.addEventListener("mousemove", handleMouseMove);

        return () => {
            parentElement.removeEventListener("mouseenter", handleMouseEnter);
            parentElement.removeEventListener("mouseleave", handleMouseLeave);
            parentElement.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="pointer-events-none">
            <motion.div
                ref={eheRef}
                className="absolute pb-8 inset-0 z-50 size-max pointer-events-none"
                style={{
                    x: springX,
                    y: springY,
                }}
            >
                <AnimatePresence mode="wait">
                    {isParentHovered && (
                        <motion.div
                            key="image-preview"
                            initial={{
                                opacity: 0,
                                scale: 0.7,
                                filter: "blur(4px)",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.7,
                                filter: "blur(4px)",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: isSafari ? 80 : 100,
                                damping: isSafari ? 12 : 15,
                                mass: 0.5,
                                delay: isSafari ? 0.05 : 0.1,
                            }}
                        >
                            <img
                                draggable="false"
                                src={props.image}
                                alt={props.title}
                                className="rounded-2xl aspect-[4/5] object-center object-cover w-64 shadow-2xl"
                                style={{
                                    // Safari için hardware acceleration
                                    transform: "translateZ(0)",
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
