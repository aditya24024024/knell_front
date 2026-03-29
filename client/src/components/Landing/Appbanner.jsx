import React from "react";

export default function AppBanner() {
  return (
    <div style={{
      background: "#3a8a2c",
      padding: "1.1rem 3rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "1rem",
      borderTop: "1px solid rgba(93,201,74,0.3)",
    }}>
      <div style={{
        fontFamily: "Bebas Neue, sans-serif",
        fontSize: "1.1rem",
        letterSpacing: "0.12em",
        color: "#ede9dc",
      }}>
        KNELL IS FREE ON IOS &amp; ANDROID — DOWNLOAD THE APP
      </div>
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <a
          href="https://apps.apple.com/app/id6761056969"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(0,0,0,0.22)",
            color: "#ede9dc",
            border: "1px solid rgba(237,233,220,0.25)",
            padding: "0.4rem 1rem",
            textDecoration: "none",
            transition: "background 0.2s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.38)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.22)")}
        >
          App Store
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.knell.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(0,0,0,0.22)",
            color: "#ede9dc",
            border: "1px solid rgba(237,233,220,0.25)",
            padding: "0.4rem 1rem",
            textDecoration: "none",
            transition: "background 0.2s",
            display: "inline-block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.38)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.22)")}
        >
          Google Play
        </a>
      </div>
    </div>
  );
}