import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function HeroBanner() {
  const [image, setImage] = React.useState(3);
  const router=useRouter();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setImage((prevImage) => (prevImage >= 6 ? 1 : prevImage + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[600px] md:h-[680px] bg-cover">
      <div className="absolute inset-0 z-0">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Image
            key={num}
            alt={`hero ${num}`}
            src={`/bg-hero${num}.webp`}
            fill
            style={{ objectFit: "cover" }}
            className={`transition-opacity duration-1000 ${
              image === num ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            priority={image === num}
            sizes="100vw"
          />
        ))}
      </div>
      <div className="relative z-10 w-full lg:w-[650px] flex flex-col justify-center h-full gap-4 px-6 md:ml-10 lg:ml-20 text-white">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl leading-snug font-bold"
          style={{ fontFamily: "Bobby Jones" }}
        >
          FIND THE PERFECT <i><br />PERSON FOR YOU</i>
        </h1>

        {/* Popular items */}
        <div className="flex gap-4">
          Popular:{" "}
          <ul className="flex flex-wrap gap-3 sm:gap-5">
            {["Social Companion", "Dance Companion", "Pet Companion"].map(
              (item) => (
                <li
                  key={item}
                  className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
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
