import React from "react";
import { useRef, useState, ReactNode } from "react";

export default function DragWrapper({
  rootClass = "",
  children,
}: {
  rootClass?: string;
  children: ReactNode;
}) {
  const ourRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mouseCoords = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ourRef.current) return;
    const slider = ourRef.current.children[0];
    const startX = e.pageX - (slider as HTMLElement).offsetLeft;
    const startY = e.pageY - (slider as HTMLElement).offsetTop;
    const scrollLeft = (slider as HTMLElement).scrollLeft;
    const scrollTop = (slider as HTMLElement).scrollTop;
    mouseCoords.current = { startX, startY, scrollLeft, scrollTop };
    setIsMouseDown(true);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
  };

  const handleDragEnd = () => {
    setIsMouseDown(false);
    if (!ourRef.current) return;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
    document.body.style.webkitUserSelect = "auto";
  };
  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (!isMouseDown || !ourRef.current) return;
    e.preventDefault();
    const slider = ourRef.current.children[0] as HTMLElement;
    const x = e.pageX - slider.offsetLeft;
    const y = e.pageY - slider.offsetTop;
    const walkY = (y - mouseCoords.current.startY) * 1.1;
    const walkX = (x - mouseCoords.current.startX) * 1.1;
    slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
    slider.scrollTop = mouseCoords.current.scrollTop - walkY;
    console.log(walkX, walkY);
  };

  return (
    <div
      ref={ourRef}
      className={
        rootClass +
        " select-none! overflow-hidden cursor-grab active:cursor-grabbing"
      }>
      {React.cloneElement(children as React.ReactElement, {
        onMouseDown: handleDragStart,
        onMouseUp: handleDragEnd,
        onMouseMove: handleDrag,
        onMouseLeave: handleDragEnd,
      })}
    </div>
  );
}
