import { ReactNode } from "react";

const InfiniteMarquee = ({ children, speed = "40s" }) => {
  return (
    <div className="overflow-x-hidden py-4 whitespace-nowrap relative w-full">
      <div
        className="flex items-center md:gap-6 gap-4 w-max animate-marquee"
        style={{ animationDuration: speed }}
      >
        {children}
        {children}
        {children}
      </div>
    </div>
  );
};

export default InfiniteMarquee;
