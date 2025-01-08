import { motion, AnimatePresence } from "motion/react";
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
        <AnimatePresence>
          {props.show && (
            <div className="flex flex-col gap-1 absolute right-0 top-full mt-2">
              {props.children.map((child, index) => (
                <>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 1,
                      rotate: index * angleStep,
                      x: index * translateStep * (1 - index * 2),
                      // y: index * translateStep,
                    }}
                    exit={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                      delay: index * 0.1,
                    }}
                    style={{
                      transformOrigin: "left top",
                    }}
                  >
                    {child}
                  </motion.div>
                </>
              ))}
            </div>
          )}
        </AnimatePresence>
      </span>
    </>
  );
}
