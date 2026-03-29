import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { categories } from "../../utils/categories";

export default function Services() {
  const router = useRouter();

  return (
    <div
      style={{
        background: "#09090b",
        padding: "6rem 3rem",
        borderTop: "1px solid rgba(93,201,74,0.1)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          marginBottom: "0.75rem",
        }}>
          <span style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#5dc94a",
          }}>
            Browse Categories
          </span>
          <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
        </div>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 0.95,
          color: "#ede9dc",
          letterSpacing: "0.02em",
        }}>
          YOU NEED IT,{" "}
          <span style={{ color: "#5dc94a" }}>WE&apos;VE GOT IT</span>
        </h2>
      </div>

      {/* Categories grid */}
      <ul style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 1,
        background: "rgba(93,201,74,0.08)",
        border: "1px solid rgba(93,201,74,0.1)",
      }}>
        {categories.map(({ name, logo }) => {
          if (!name?.trim()) return null;
          return (
            <li
              key={name}
              onClick={() => router.push(`/search?category=${name}`)}
              style={{
                background: "#09090b",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                padding: "1.5rem 1rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#15171c";
                e.currentTarget.querySelector("span").style.color = "#5dc94a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#09090b";
                e.currentTarget.querySelector("span").style.color = "#6b7a62";
              }}
            >
              <div style={{
                filter: "brightness(0) invert(0.5) sepia(1) saturate(2) hue-rotate(80deg)",
                opacity: 0.7,
              }}>
                <Image src={logo} alt={name} height={40} width={40} />
              </div>
              <span style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6b7a62",
                textAlign: "center",
                lineHeight: 1.4,
                transition: "color 0.2s",
              }}>
                {name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}