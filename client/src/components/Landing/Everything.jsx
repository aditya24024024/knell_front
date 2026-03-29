import Image from "next/image";
import React from "react";

const everythingData = [
  {
    title: "Affordable & Reliable Services",
    subtitle: "Get quality services at creator-friendly prices, provided by skilled professionals who understand the content world.",
  },
  {
    title: "Verified Professionals",
    subtitle: "Every seller is vetted before they can list gigs. You get real quality, not random freelancers.",
  },
  {
    title: "Fast Turnaround",
    subtitle: "Browse gigs, message sellers, and get your content delivered — without the back-and-forth.",
  },
];

export default function Everything() {
  return (
    <div
      style={{
        background: "#0f1014",
        borderTop: "1px solid rgba(93,201,74,0.1)",
        borderBottom: "1px solid rgba(93,201,74,0.1)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "4rem",
        padding: "6rem 3rem",
        flexWrap: "wrap",
      }}
    >
      {/* Text */}
      <div style={{ flex: "1 1 340px" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#5dc94a",
          }}>
            Why Knell
          </span>
          <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
        </div>

        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 0.95,
          color: "#ede9dc",
          letterSpacing: "0.02em",
          marginBottom: "3rem",
        }}>
          BUILT FOR THE<br />
          <span style={{ color: "#5dc94a" }}>CREATOR ECONOMY</span>
        </h2>

        <ul style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {everythingData.map(({ title, subtitle }) => (
            <li key={title} style={{ display: "flex", gap: "1rem" }}>
              <div style={{
                width: 6, height: 6, background: "#5dc94a",
                flexShrink: 0, marginTop: "0.45rem",
              }} />
              <div>
                <h4 style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "1.2rem",
                  letterSpacing: "0.04em",
                  color: "#ede9dc",
                  marginBottom: "0.35rem",
                }}>
                  {title}
                </h4>
                <p style={{
                  fontSize: "0.82rem",
                  color: "#6b7a62",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}>
                  {subtitle}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Image */}
      <div style={{
        flex: "1 1 340px",
        position: "relative",
        height: 380,
        border: "1px solid rgba(93,201,74,0.12)",
        overflow: "hidden",
      }}>
        <Image
          src="/best_part.webp"
          fill
          alt="Why choose Knell"
          style={{ objectFit: "cover", filter: "brightness(0.85) saturate(0.9)" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(15,16,20,0.4) 0%, transparent 60%)",
        }} />
      </div>
    </div>
  );
}