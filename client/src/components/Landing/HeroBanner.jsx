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
    <div className="relative w-full aspect-[9/13] sm:aspect-[16/9] md:h-[680px] overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Image
            key={num}
            alt={`hero ${num}`}
            src={`/bg-hero${num}.webp`}
            fill
            sizes="100vw"
            priority={image === num}
            className={`transition-opacity duration-1000 ${
              image === num ? "opacity-100" : "opacity-0 pointer-events-none"
            } object-contain sm:object-cover object-top`}
          />
        ))}
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Text Content */}
      <div className="relative z-10 w-full max-w-[650px] flex flex-col justify-center h-full gap-4 px-4 sm:px-6 lg:ml-20 text-white">
        <h1
          className="text-2xl sm:text-4xl md:text-5xl leading-snug font-bold"
          style={{ fontFamily: "Bobby Jones" }}
        >
          FIND THE PERFECT <i><br />PERSON FOR YOU</i>
        </h1>

        {/* Popular items */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
          <span className="font-semibold">Popular:</span>
          <ul className="flex flex-wrap gap-2 sm:gap-4">
            {["Social Companion", "Dance Companion", "Pet Companion"].map(
              (item) => (
                <li
                  key={item}
                  className="py-1 px-3 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                  onClick={() =>
                    router.push(`/search?category=${(item || "default").toLowerCase()}`)
                  }
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
