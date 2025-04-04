import React from "react";
import InfiniteMarquee from "./InfiniteMarquee";
// Demo data
const demoData = [
  {
    id: 1,
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Unacademy_Logo.png/1200px-Unacademy_Logo.png?20180302191514",
    alt: "Unacademy",
  },
  {
    id: 2,
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Doubtnut_new_logo.png/1200px-Doubtnut_new_logo.png?20220819084201",
    alt: "doubtnut",
  },
  {
    id: 3,
    src: "https://physicswallah.peopleapps.in/Files/Company/107/127ec0c17deb4d648d50d9d72b48003b.png",
    alt: "Physicswallah",
  },
  {
    id: 4,
    src: "https://ggi.ac.in/wp-content/uploads/2024/08/logo.webp",
    alt: "ggi",
  },
  {
    id: 5,
    src: "https://pcte.edu.in/wp-content/uploads/2025/03/PCTE-Logo-Change-Size.png",
    alt: "pcte",
  },
  {
    id: 6,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNLwtH1_kONuZCYV7g4lu-ZU-dcuEIW5C-Cw&s",
    alt: "gna",
  },
];

const Featured = () => {
  return (
    <div className="pt-10 pb-6 font-poppins   ">
      <h2 className="md:text-4xl text-2xl mb-6 font-bold w-full md:text-center px-4">
        Our
        <span className="bg-gradient-to-r from-teal-800  to-teal-700 text-transparent bg-clip-text">
          {" "}
          Education Partners
        </span>
      </h2>

      {/* Infinite Horizontal Carousel */}
      <InfiniteMarquee>
        {demoData.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl hover:scale-110 transition-all duration-300 min-w-44 px-4 flex items-center justify-center md:h-16 h-14 overflow-hidden box-border drop-shadow-[0px_0px_8px_rgba(255,255,255,0.8)]"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="object-contain max-h-full"
            />
          </div>
        ))}
      </InfiniteMarquee>
    </div>
  );
};

export default Featured;
