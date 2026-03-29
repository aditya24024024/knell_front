import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { categories } from "../../utils/categories";

// Extended category list with icons and tags for filtering
const allCategories = [
  { name: "Stream Overlays", icon: "🎮", tag: "streaming", status: "Coming Soon" },
  { name: "Alert Packs", icon: "🔔", tag: "streaming", status: "Coming Soon" },
  { name: "Emotes & Badges", icon: "😄", tag: "streaming", status: "Coming Soon" },
  { name: "Video Editing", icon: "🎬", tag: "video", status: "Active", category: "editor" },
  { name: "Shorts / Reels", icon: "⚡", tag: "video", status: "Active", category: "editor" },
  { name: "VOD Highlights", icon: "🎞️", tag: "video", status: "Active", category: "editor" },
  { name: "Thumbnails", icon: "🖼️", tag: "design", status: "Active", category: "Freelancer" },
  { name: "Channel Art", icon: "🎨", tag: "design", status: "Active", category: "Freelancer" },
  { name: "Logo Design", icon: "✏️", tag: "design", status: "Active", category: "Freelancer" },
  { name: "Motion Graphics", icon: "🌀", tag: "design", status: "Active", category: "Freelancer" },
  { name: "Web Dev", icon: "🌐", tag: "development", status: "Active", category: "Freelancer" },
  { name: "Bots & Tools", icon: "🤖", tag: "development", status: "Active", category: "Freelancer" },
  { name: "Music & SFX", icon: "🎵", tag: "audio", status: "Active", category: "Musician" },
  { name: "Voiceover", icon: "🎙️", tag: "audio", status: "Active", category: "Freelancer" },
  { name: "Tutoring", icon: "📚", tag: "writing", status: "Active", category: "Tutor/Counselor" },
  { name: "Pet Companion", icon: "🐾", tag: "companions", status: "Active", category: "Pet Companion " },
  { name: "Shopper", icon: "🛍️", tag: "companions", status: "Active", category: "Shopper" },
  { name: "Photography", icon: "📸", tag: "design", status: "Active", category: "Photography" },
];

const FILTERS = ["All", "Streaming", "Video", "Design", "Development", "Audio", "Writing", "Companions"];

export default function BrowseCategories() {
  const router = useRouter();
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? allCategories
    : allCategories.filter((c) => c.tag === active.toLowerCase());

  const handleClick = (cat) => {
    if (cat.status !== "Active") return;
    const target = cat.category || cat.name;
    router.push(`/search?category=${encodeURIComponent(target)}`);
  };

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
      <div style={{
        display: "flex", gap: "0.5rem", flexWrap: "wrap",
        marginBottom: "2rem",
        overflowX: "auto",
      }}>
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
        {filtered.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleClick(cat)}
            style={{
              background: "#09090b",
              padding: "1.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
              cursor: cat.status === "Active" ? "pointer" : "default",
              transition: "background 0.2s",
              opacity: cat.status === "Active" ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (cat.status === "Active") e.currentTarget.style.background = "#15171c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#09090b";
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
            <div style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#dbd7ca",
              lineHeight: 1.4,
            }}>
              {cat.name}
            </div>
            <div style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.52rem",
              letterSpacing: "0.08em",
              color: cat.status === "Active" ? "#5dc94a" : "#6b7a62",
            }}>
              {cat.status}
            </div>
          </div>
        ))}

        {/* More coming soon cell */}
        <div style={{
          background: "#09090b",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          minHeight: 120,
        }}>
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#3d4438",
            textAlign: "center",
            lineHeight: 1.6,
          }}>
            + More Categories<br />Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}