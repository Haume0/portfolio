"use client";
import React, {
  useRef,
  useState,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";

export default function DragWrapper({
  rootClass = "",
  children,
  power = 1.1,
}: {
  rootClass?: string;
  children: ReactNode;
  power?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!scrollContainerRef.current) return;

    const slider = scrollContainerRef.current;
    const startX = e.pageX - slider.offsetLeft;
    const startY = e.pageY - slider.offsetTop;
    const scrollLeft = slider.scrollLeft;
    const scrollTop = slider.scrollTop;

    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // Disable smooth scroll and snap during drag
    slider.style.scrollBehavior = "auto";
    slider.style.scrollSnapType = "none";
  };

  const handleDragEnd = () => {
    setIsMouseDown(false);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
    document.body.style.webkitUserSelect = "auto";

    // Re-enable smooth scroll and snap after drag
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = "smooth";
      scrollContainerRef.current.style.scrollSnapType = "x mandatory";
    }
  };

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): void => {
    if (!isMouseDown || !scrollContainerRef.current) return;

    e.preventDefault();
    const slider = scrollContainerRef.current;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkY = (y - mouseCoords.current.startY) * power;
    const walkX = (x - mouseCoords.current.startX) * power;

    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
  };

  return (
    <div
      ref={containerRef}
      className={
        rootClass +
        " select-none overflow-hidden cursor-grab active:cursor-grabbing"
      }
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      onMouseLeave={handleDragEnd}
    >
      {isValidElement(children) ? (
        cloneElement(children, {
          ref: scrollContainerRef,
        } as any)
      ) : (
        <div ref={scrollContainerRef}>{children}</div>
      )}
    </div>
  );
}
