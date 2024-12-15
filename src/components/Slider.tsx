import React from "react";
import "./Slider.css";

interface SliderProps {
  text: string;
  children?: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({ text, children }) => {
  return (
    <div
      id="slider"
      className="relative flex overflow-hidden gap-4 scroller w-full h-full">
      <div
        id="scroll_inner"
        className="flex gap-8 scroller_inner"
        style={{ "--t": "30s" } as React.CSSProperties}>
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div className="flex gap-8" key={i}>
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <div
                    key={j}
                    className="relative w-max flex items-center gap-8 justify-center shrink-0 overflow-hidden">
                    <img src="/star.svg" alt="" className="w-10" />
                    <span className="font-light text-4xl whitespace-nowrap">
                      {text}
                    </span>
                    {children}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Slider;
