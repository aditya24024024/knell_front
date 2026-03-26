import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function HeroBanner() {
  const [image, setImage] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((prevImage) => (prevImage >= 6 ? 1 : prevImage + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[600px] md:h-[680px] bg-cover overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Image
            key={num}
            alt={`hero ${num}`}
            src={`/bg-hero${num}.webp`}
            fill
            priority={image === num}
            sizes="100vw"
            className={`transition-opacity duration-1000 ${
              image === num ? "opacity-100" : "opacity-0 pointer-events-none"
            }
              object-cover
              md:object-center
              object-[80%_center] md:scale-100 scale-[1.05]`}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full lg:w-[700px] flex flex-col justify-center h-full gap-5 px-6 md:ml-10 lg:ml-20 text-white">
        
        {/* Creator badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 w-fit">
          <span className="text-[#1DBF73] text-sm font-semibold">🎮 Built for Creators & Streamers</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl leading-snug font-bold"
          style={{ fontFamily: "Bobby Jones" }}
        >
          LEVEL UP YOUR <i><br />CONTENT GAME</i>
        </h1>

        <p className="text-white/80 text-base sm:text-lg max-w-md">
          Find editors, designers & developers who get the creator world. Hire in minutes, pay in ₹.
        </p>

     {/* Popular items */}
<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
  <span className="text-white/50 font-medium">Popular:</span>
  <ul className="flex flex-wrap gap-2">
    {[
      { label: "Video Editing", search: "edit" },
      { label: "Thumbnail Design", search: "thumbnail" },
      { label: "Freelancer", search: "freelancer" },
    ].map(({ label, search }) => (
      <li
        key={label}
        className="py-1 px-4 rounded-full text-sm cursor-pointer transition-all duration-200 text-white/80 hover:text-black hover:font-medium"
        style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "#1DBF73";
          e.currentTarget.style.borderColor = "#1DBF73";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
        onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
      >
        {label}
      </li>
    ))}
  </ul>
</div>
      </div>
    </div>
  );
}

export default HeroBanner;
