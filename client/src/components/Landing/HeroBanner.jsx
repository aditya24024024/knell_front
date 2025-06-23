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

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full lg:w-[650px] flex flex-col justify-center h-full gap-4 px-6 md:ml-10 lg:ml-20 text-white">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl leading-snug font-bold"
          style={{ fontFamily: "Bobby Jones" }}
        >
          FIND THE PERFECT <i><br />PERSON FOR YOU</i>
        </h1>

        {/* Popular items */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
          <span className="font-semibold">Popular:</span>
          <ul className="flex flex-wrap gap-2 sm:gap-4">
            {["Social Companion", "Dance Companion", "Pet Companion"].map((item) => (
              <li
                key={item}
                className="text-sm py-1 px-3 border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                onClick={() =>
                  router.push(`/search?category=${(item || "default").toLowerCase()}`)
                }
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
