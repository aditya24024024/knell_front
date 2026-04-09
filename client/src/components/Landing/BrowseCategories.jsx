import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { categories } from "../../utils/categories";

const tagMap = {
  "Social Companion ":   "companions",
  "Tutor/Counselor":     "education",
  "Gaming Companion ":   "companions",
  "Pet Companion ":      "companions",
  "Old Age Companion":   "companions",
  "Freelancer":          "design",
  "Travel Companion":    "companions",
  "Pub Crawler":         "companions",
  "Dance Companion":     "companions",
  "Videographer":         "design",
  "Shopper":             "companions",
  "Musician":            "audio",
  "editor":              "video",
  "Online Meet":         "companions",
};

const STREAMER_TAGS = ["video", "design", "audio"];
const FILTERS = ["Streamer", "Video", "Design", "Audio", "Education", "Companions", "All"];

export default function BrowseCategories() {
  const router = useRouter();
  const [active, setActive] = useState("Streamer");

  const filtered = categories.filter(({ name }) => {
    if (!name?.trim()) return false;
    const tag = tagMap[name] || "other";
    if (active === "All") return true;
    if (active === "Streamer") return STREAMER_TAGS.includes(tag);
    return tag === active.toLowerCase();
  });

  return (
    <div style={{
      background: "#09090b",
      padding: "6rem 3rem",
      borderTop: "1px solid rgba(93,201,74,0.1)",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
            letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a",
          }}>
            Browse by Category
          </span>
          <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
        </div>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 0.95, color: "#ede9dc", letterSpacing: "0.02em",
        }}>
          EVERY SERVICE A{" "}
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(237,233,220,0.22)" }}>
            CREATOR NEEDS
          </span>
        </h2>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.45rem 1rem",
              border: "1px solid",
              borderColor: active === f ? "#5dc94a" : "rgba(237,233,220,0.1)",
              background: active === f ? "rgba(93,201,74,0.12)" : "transparent",
              color: active === f ? "#5dc94a" : "#6b7a62",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
        gap: 1,
        background: "rgba(93,201,74,0.08)",
        border: "1px solid rgba(93,201,74,0.1)",
      }}>
        {filtered.map(({ name, logo }) => (
          <div
            key={name}
            onClick={() => router.push(`/search?category=${encodeURIComponent(name)}`)}
            style={{
              background: "#09090b",
              padding: "1.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.75rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#15171c";
              e.currentTarget.querySelector(".cat-name").style.color = "#5dc94a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#09090b";
              e.currentTarget.querySelector(".cat-name").style.color = "#dbd7ca";
            }}
          >
            <div style={{
              filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(80deg) opacity(0.75)",
            }}>
              <Image src={logo} alt={name} height={36} width={36} />
            </div>
            <span
              className="cat-name"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#dbd7ca",
                lineHeight: 1.4,
                transition: "color 0.2s",
              }}
            >
              {name.trim()}
            </span>
          </div>
        ))}

        {/* More coming soon */}
        <div style={{
          background: "#09090b",
          padding: "1.5rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 110,
        }}>
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#3d4438",
            textAlign: "center",
            lineHeight: 1.6,
          }}>
            + More<br />Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}