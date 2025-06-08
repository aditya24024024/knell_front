import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function HeroBanner() {
    const router = useRouter();
    const [image, setImage] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setImage((prevImage) => (prevImage >= 6 ? 1 : prevImage + 1));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-[680px] relative bg-cover">
            <div className="absolute top-0 right-0 w-full h-full transition-opacity z-0">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Image
                        key={num}
                        alt={`hero ${num}`}
                        src={`/bg-hero${num}.webp`}
                        layout="fill"
                        className={`${
                            image === num ? "opacity-100" : "opacity-0"
                        } transition-all duration-1000`}
                    />
                ))}
            </div>
            <div className="z-1 relative w-[650px] flex justify-center flex-col h-full gap-5 ml-20">
                <h1 className="text-white text-5xl leading-snug" style={{ fontFamily: 'Bobby Jones' ,fontWeight: 'bold'}} >
                FIND THE PERFECT <i><br />PERSON  FOR YOU</i>
                </h1>

                {/* <div className="flex align-middle">
                    <div className="relative">
                        <input
                            type="text"
                            className="h-14 w-[450px] pl-10 rounded-md rounded-r-none"
                            placeholder={'Try "building mobile app"'}
                        />
                    </div>
                    <button className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md">
                        Search
                    </button>
                </div> */}
                <div className="text-white flex gap-4">
                    Popular:{" "}
                    <ul className="flex gap-5">
                        <li className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                            Social Companion
                        </li>
                        <li className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                            Dance Companinon
                        </li>
                        <li className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                            Dog Walker
                        </li>
                        <li className="text-sm py-1 px-3 border rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                            All Services
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HeroBanner;
