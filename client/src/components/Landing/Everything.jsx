import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";
function Everything() {
    const everythingData = [
        {
            title: "Affordable & Reliable Services",
            subtitle:
            "Get quality services at student-friendly prices, provided by skilled students."
        },
        {
            title: "Verified Student Professionals",
            subtitle: "Every service provider is vetted to ensure trust and quality.",
        },
        {
            title: "Flexible Scheduling",
            subtitle: "Book services at your convenience with easy scheduling and real-time updates.",
        },
    ];
    return (
        <div className="bg-[#f1fdf7] flex py-20 justify-between px-24">
            <div>
                <h2 className="text-4xl mb 5 text-[#404145] font-bold">
                    <i>WHY CHOOSE US?</i>
                </h2>
                <ul className="flex flex-col gap-10">
                    {everythingData.map(({ title, subtitle}) => {
                        return (
                            <li key={title}>
                                <div className="flex gap-2 items-center text-xl">
                                    <BsCheckCircle className="text-[#62646a]"/>
                                    <h4>{title}</h4>
                                </div>
                                <p className="text-[#62646a]">{subtitle}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="relative h-96 w-2/4">
                <Image src="/best_part.webp" fill alt="evrything"/>
            </div>
        </div>
    );
}

export default Everything;