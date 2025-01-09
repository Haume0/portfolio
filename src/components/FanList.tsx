import { motion, AnimatePresence } from "framer-motion";
import { ReactElement, ReactNode } from "react";

export default function FanList(props: {
  button: ReactNode;
  children: ReactElement[];
  show: boolean;
}) {
  const angleStep = 8; // Döndürme açısı adımı
  const translateStep = 2; // Çeviri adımı

  return (
    <>
      <span className="relative flex">
        {props.button}
        <AnimatePresence mode="wait">
          {props.show && (
            <div className="flex flex-col gap-1 absolute right-0 top-full mt-2">
              {props.children.map((child, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotate: 0, x: 0 }}
                  animate={{
                    opacity: 1,
                    rotate: index * angleStep,
                    x: index * translateStep * (1 - index * 2),
                  }}
                  exit={{ opacity: 0, rotate: 0, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: index * 0.1,
                  }}
                  style={{
                    transformOrigin: "left top",
                  }}>
                  {child}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </span>
    </>
  );
}
