import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";

function Everything() {
  const everythingData = [
    {
      title: "Affordable & Reliable Services",
      subtitle:
        "Get quality services at student-friendly prices, provided by skilled students.",
    },
    {
      title: "Verified Student Professionals",
      subtitle: "Every service provider is vetted to ensure trust and quality.",
    },
    {
      title: "Flexible Scheduling",
      subtitle:
        "Book services at your convenience with easy scheduling and real-time updates.",
    },
  ];

  return (
    <div className="bg-[#f1fdf7] flex flex-col lg:flex-row items-center gap-10 py-16 px-6 md:px-12 lg:px-24">
      {/* Text Content */}
      <div className="w-full lg:w-1/2">
        <h3 className="text-[#1DBF73] text-sm font-semibold mb-4">WHY CHOOSE US?</h3>
        <ul className="flex flex-col gap-10">
          {everythingData.map(({ title, subtitle }) => (
            <li key={title}>
              <div className="flex gap-2 items-center text-xl font-medium text-[#333]">
                <BsCheckCircle className="text-[#1DBF73]" />
                <h4>{title}</h4>
              </div>
              <p className="text-[#62646a] mt-1">{subtitle}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Image Content */}
      <div className="relative w-full lg:w-1/2 h-64 md:h-80 lg:h-96">
        <Image
          src="/best_part.webp"
          fill
          alt="Why choose Knell"
          className="object-contain rounded-md"
        />
      </div>
    </div>
  );
}

export default Everything;
