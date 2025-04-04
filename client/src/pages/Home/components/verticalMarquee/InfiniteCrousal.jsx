import React from "react";
import VerticalMarquee from "./VerticalMarquee";

export default function InfiniteCarousel() {
  return (
    <div className="relative min-w-sm hidden pb-10 lg:grid grid-cols-2 gap-7 lg:min-w-md xl:min-w-lg h-full">
      <div className="absolute top-0 left-0 w-full h-34 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
      <div className="absolute bottom-10 left-0 w-full h-34 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

      {/* Left Vertical Marquee */}
      <VerticalMarquee speed="30s">
        {[
          "https://ichef.bbci.co.uk/ace/standard/1920/cpsprodpb/da05/live/12c27b70-33d9-11ef-adcc-774fd4a5094b.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa13by1d3qNuwNlvs_W1RVyEEV-LQUtMI71jt7es9jK0AiKE-l5biNx3a9xLRHYLEHHF0&usqp=CAU",
          "https://www.expatrio.com/hubfs/Expatrio%20Hatch%20Child%20-%20Theme_2024Migration/Blog%20Graphics/Studying%20in%20Germany/studying-germany-artificial-intelligence.webp",
          "https://www.eschoolnews.com/files/2024/04/digital-tools-AI-social-studies.jpeg",
          "https://learn.microsoft.com/en-us/training/media/educator-center/topics/teacher-students-classroom-table.png",
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center rounded-2xl overflow-clip justify-center"
          >
            <img
              src={item}
              alt="temple-img"
              width={300}
              height={180}
              className="object-cover"
            />
          </div>
        ))}
      </VerticalMarquee>

      {/* Right Vertical Marquee (Reverse Direction) */}
      <VerticalMarquee speed="30s" reverse>
        {[
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK9CRlJEpcOv5w4rITukb8TioQkB6JtAHvoizEurIPBXdf7F-TX8x1XK8pWr0YzvEBWQM&usqp=CAU",
          "https://media.licdn.com/dms/image/v2/D5622AQGtLlSdgKYGkg/feedshare-shrink_800/feedshare-shrink_800/0/1727136557151?e=2147483647&v=beta&t=wmrJf-DaVqj0bmrKWagumcfbEcpgQylOFuxsoqnHJVk",
          "https://i.ytimg.com/vi/ZkH6I5XEB9I/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDogsPgoqh1D7d3kdm0BbSXVrNHGA",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHUHyML3SBqRjYI1dPVPjpU4F14F8L4YzHnA&s"
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center rounded-2xl overflow-clip justify-center"
          >
            <img
              src={item}
              alt="temple-img"
              width={300}
              height={200}
              className="object-cover"
            />
          </div>
        ))}
      </VerticalMarquee>
    </div>
  );
}
