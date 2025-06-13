import Image from "next/image";
import React from "react";

function Joinknell(){
    return (
        <div className="mx-4 sm:mx-12 md:mx-20 lg:mx-32 my-16 relative">
            <div className="absolute z-10 top-1/4 sm:top-1/3 left-4 sm:left-10 w-[90%] sm:w-auto">
                <h4 className="text-white text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10">
                    suddenly it&apos;s all so <i>doable.</i>
                </h4>
                <button
                    className="border text-base font-medium px-5 py-2 border-{#1DBF73} bg-{#1DBF73} text-white rounded-md"
                    type="button">
                        Join Knell
                </button>
            </div>
            <div cclassName="w-full h-64 sm:h-80 md:h-96 relative">
                <Image src="/bg-signup.webp" fill alt="signup" className="rounded-sn"/>
            </div>
        </div>
    );
}

export default Joinknell;