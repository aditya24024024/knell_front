import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function PopularServices() {
    const router = useRouter();
    const popularServicesData = [
        {
            name: "Social Companion",
            label: "Accompanies You",
            image: "/aditya.png",
        },
        {
            name: "Study Companion",
            label: "Academic Come-Back",
            image: "/eshan.png",
        },
        {
            name: "Pet Companion",
            label: "woof!! woof!!",
            image: "/aryan.png",
        },
        {
            name: "Gaming Companion",
            label: "Two of Us!!!",
            image: "/ded.png",
        },
        {
            name: "Freelancer",
            label: "Do professional work.",
            image: "/yasir.png",
        },
        {
            name: "Music Companion",
            label: "Lets Jam!!!!!",
            image: "/music.png",
        },
        {
            name: "Shopping Companion",
            label: "Get someone along to bargain with you",
            image: "/tamanna.jpeg",
        },
        {
            name: "Dance Companion",
            label: "Lets Dance",
            image: "/shreya.png",
        },
    ];

    return (
        <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-20 my-10">
            <h2 className="text-4xl mb-10 text-[#404145] font-bold">
                Popular Services
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                {popularServicesData.map(({ name, label, image }) => (
                    <li
                        key={name}
                        className="relative cursor-pointer"
                        onClick={() =>
                            router.push(`/search?category=${(name || "default").toLowerCase()}`)
                        }
                    >
                        <div className="absolute z-10 text-white left-5 top-4">
                            <span>{label}</span>
                            <h6 className="font-extrabold text-2xl">{name}</h6>
                        </div>
                        <div className="h-64 w-full relative sm:w-64 md:h-72 lg:h-80">
                            <Image src={image} fill alt="service" className="object-cover" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PopularServices;
