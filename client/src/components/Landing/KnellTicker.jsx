import React from "react";

const ITEMS = [
  "Video Editing", "Thumbnail Design", "Stream Overlays", "Channel Art",
  "Short-Form Edits", "VOD Highlights", "Motion Graphics", "Discord Servers",
  "Web Dev", "Logo Design", "Emote Packs", "Photography",
  "Video Editing", "Thumbnail Design", "Stream Overlays", "Channel Art",
  "Short-Form Edits", "VOD Highlights", "Motion Graphics", "Discord Servers",
  "Web Dev", "Logo Design", "Emote Packs", "Photography",
];

export default function KnellTicker() {
  return (
    <div style={{ background: "#3a8a2c", overflow: "hidden", whiteSpace: "nowrap", padding: "0.7rem 0" }}>
      <div
        style={{
          display: "inline-flex",
          gap: "2.5rem",
          animation: "knell-ticker 24s linear infinite",
        }}
      >
        {ITEMS.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "0.95rem",
              letterSpacing: "0.18em",
              color: "#ede9dc",
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {item}
            <span style={{ width: 3, height: 3, background: "rgba(237,233,220,0.4)", display: "inline-block" }} />
          </span>
        ))}
      </div>
      <style jsx global>{`
        @keyframes knell-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}