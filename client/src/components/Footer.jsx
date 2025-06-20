import Link from "next/link";
import React from "react";
import {
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import Image from "next/image";
import img from './unnamed 1.svg'
import { categories } from "../utils/categories";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <FiGithub />, link: "https://www.github.com" },
    {
      name: "Youtube",
      icon: <FiYoutube />,
      link: "https://www.youtube.com/@Knell-b5l/",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      link: "https://www.linkedin.com/company/knelldotco/",
    },
    {
      name: "Instagram",
      icon: <FiInstagram />,
      link: "https://instagram.com/knell.co.in",
    },
    {
      name: "Twitter",
      icon: <FiTwitter />,
      link: "https://twitter.com/knell_co_in",
    },
  ];

 

  return (
    <footer className="w-full mx-auto px-6 md:px-16 lg:px-32 py-10 border-t border-gray-200 bg-gray-100">
      {/* Grid footer sections */}
      

      {/* Bottom row with logo and social */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Image
            src={img}
            className="rounded-full"
            alt="Knell"
            width={50}
            height={50}
          />
          <span className="font-semibold text-[#404145]">Knell</span>
        </div>
        <ul className="flex gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li
              key={name}
              className="text-xl text-[#404145] hover:text-[#1DBF73] transition-all"
            >
              <Link href={link} target="_blank" rel="noopener noreferrer">
                {icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
