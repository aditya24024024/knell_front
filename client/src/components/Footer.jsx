import Link from "next/link";
import React from "react";
import { FiGithub, FiInstagram, FiYoutube, FiLinkedin, FiTwitter } from "react-icons/fi";
import Image from "next/image";
import img from "./unnamed 1.svg";

const socialLinks = [
  { name: "Github", icon: <FiGithub />, link: "https://www.github.com" },
  { name: "Youtube", icon: <FiYoutube />, link: "https://www.youtube.com/@Knell-b5l/" },
  { name: "LinkedIn", icon: <FiLinkedin />, link: "https://www.linkedin.com/company/knelldotco/" },
  { name: "Instagram", icon: <FiInstagram />, link: "https://instagram.com/knell.co.in" },
  { name: "Twitter", icon: <FiTwitter />, link: "https://twitter.com/knell_co_in" },
];

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Support", href: "mailto:support@knell.co.in" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{
      background: "#09090b",
      borderTop: "1px solid rgba(93,201,74,0.12)",
      padding: "1.75rem 3rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Image src={img} alt="Knell" width={36} height={36} className="rounded-full" />
        <span style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "1.3rem",
          letterSpacing: "0.15em",
          color: "#5dc94a",
        }}>
          KNELL
        </span>
      </div>

      {/* Footer links */}
      <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none", flexWrap: "wrap" }}>
        {footerLinks.map(({ label, href }) => (
          <li key={label}>
            <Link href={href} style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6b7a62",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#5dc94a")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7a62")}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Social icons */}
      <ul style={{ display: "flex", gap: "1.25rem", listStyle: "none" }}>
        {socialLinks.map(({ icon, link, name }) => (
          <li key={name}>
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "1.1rem",
                color: "#6b7a62",
                transition: "color 0.2s",
                display: "block",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5dc94a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7a62")}
            >
              {icon}
            </Link>
          </li>
        ))}
      </ul>

      {/* Copyright */}
      <div style={{
        width: "100%",
        borderTop: "1px solid rgba(93,201,74,0.08)",
        paddingTop: "1rem",
        fontFamily: "Space Mono, monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.08em",
        color: "#3d4438",
        textAlign: "center",
      }}>
        © 2026 Knell Digital Pvt. Ltd. · Made in India for Creators
      </div>
    </footer>
  );
}