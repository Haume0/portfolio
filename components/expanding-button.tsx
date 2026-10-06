"use client";

import { AnimatePresence } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";

export default function ExpandingButton(props: {
  children: ReactNode;
  button: ReactNode;
}) {
  const [seeMore, setSeeMore] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(`.seeMore`)) {
        setSeeMore(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <AnimatePresence mode="wait">
      {seeMore ? (
        props.children
      ) : (
        <span
          onClick={() => {
            setSeeMore(true);
          }}
        >
          {props.button}
        </span>
      )}
    </AnimatePresence>
  );
}
