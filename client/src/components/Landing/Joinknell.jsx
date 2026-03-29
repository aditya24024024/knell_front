import React from "react";
import { reducerCases } from "../../context/constants";
import { useStateProvider } from "../../context/StateContext";
import AuthWrapper from "../AuthWrapper";

export default function Joinknell() {
  const [{ showSignupModal, userInfo }, dispatch] = useStateProvider();

  const handleSignup = () => {
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
  };

  return (
    <>
      {showSignupModal && <AuthWrapper type="signup" />}
      <div
        style={{
          background: "#0f1014",
          borderTop: "1px solid rgba(93,201,74,0.1)",
          padding: "8rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700, height: 400,
          background: "radial-gradient(ellipse, rgba(58,138,44,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "1.5rem",
          }}>
            <span style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#5dc94a",
            }}>
              Join the Platform
            </span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>

          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            color: "#ede9dc",
            marginBottom: "1.25rem",
          }}>
            MONETISE YOUR<br />
            <span style={{ color: "#5dc94a" }}>TIME.</span>
          </h2>

          <p style={{
            fontSize: "0.9rem",
            color: "#6b7a62",
            marginBottom: "2.5rem",
            fontWeight: 300,
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
          }}>
            Whether you&apos;re a streamer who needs an editor, or a designer ready
            to earn — Knell is where the Indian creator economy hires.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {!userInfo && (
              <button
                onClick={handleSignup}
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "#3a8a2c",
                  color: "#ede9dc",
                  border: "none",
                  padding: "0.9rem 2rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
              >
                Join Knell Free
              </button>
            )}
            <button
              onClick={() => window.open("https://www.instagram.com/knell.co.in/", "_blank")}
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "transparent",
                color: "#6b7a62",
                border: "1px solid rgba(93,201,74,0.2)",
                padding: "0.9rem 2rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#5dc94a";
                e.currentTarget.style.color = "#5dc94a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(93,201,74,0.2)";
                e.currentTarget.style.color = "#6b7a62";
              }}
            >
              Follow on Instagram
            </button>
          </div>
        </div>
      </div>
    </>
  );
}