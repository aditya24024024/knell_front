import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import axios from "axios";
import { HOST } from "../utils/constants";
// ─── CONFIG ─────────────────────────────────────────────────
const PRICE = 450;
const TURNAROUND = "48HR";

// Drop your demo edits here. Use Cloudinary (or any public video host) URLs.
// thumb = poster image shown before play, video = direct mp4/webm url.
const DEMO_EDITS = [
  {
    id: 1,
    label: "Reel Edit",
    thumb: null, // e.g. "https://res.cloudinary.com/.../thumb1.jpg"
    video: null, // e.g. "https://res.cloudinary.com/.../edit1.mp4"
    accent: "#5dc94a",
  },
  {
    id: 2,
    label: "Highlight Cut",
    thumb: null,
    video: null,
    accent: "#f0c94a",
  },
  {
    id: 3,
    label: "Talking Head",
    thumb: null,
    video: null,
    accent: "#6b7aff",
  },
  {
    id: 4,
    label: "Story Edit",
    thumb: null,
    video: null,
    accent: "#ff6b6b",
  },
];

const SCOPE_ITEMS = [
  { label: "Length cap", value: "Up to 90 seconds", accent: "#5dc94a" },
  { label: "Turnaround", value: "48 hours from confirmation", accent: "#f0c94a" },
  { label: "Revisions", value: "1 round included", accent: "#6b7aff" },
  { label: "Formats", value: "9:16, 1:1, 16:9 export", accent: "#ff6b6b" },
  { label: "Includes", value: "Cuts, captions, basic color, music sync", accent: "#d94af0" },
  { label: "Not included", value: "VFX, motion graphics, multi-cam sync", accent: "#3d4438" },
];

const STEPS = [
  {
    n: "01",
    title: "Send your raw clip",
    body: "Drop a link to your raw footage and tell us what it's for.",
  },
  {
    n: "02",
    title: "We confirm scope",
    body: "We check it fits the ₹450 scope and send you a payment link.",
  },
  {
    n: "03",
    title: "Get it back, ready to post",
    body: "Pay, and your edit lands in your inbox within 48 hours.",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function EditPage() {
  const [hoveredDemo, setHoveredDemo] = useState(null);
  const [hoveredScope, setHoveredScope] = useState(null);
  const [form, setForm] = useState({ link: "", type: "", length: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${HOST}/api/otp/edit-request`, form, { withCredentials: true });
    setSubmitted(true);
  } catch (err) {
    console.error("Failed to submit edit request:", err);
  }
};

  return (
    <>
      <Head>
        <title>Knell Edit — ₹450 Flat. 48HR Turnaround.</title>
        <meta
          name="description"
          content="Get your next video edited. Flat price, fast turnaround, no browsing freelancers."
        />
      </Head>

      <Navbar />

      <main style={{ background: "#09090b", minHeight: "100vh", paddingTop: "20px" }}>
        {/* ── HERO ── */}
        <section
          style={{
            padding: "1.5rem 3rem 2rem",
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "start",
            gap: "2rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5dc94a",
                }}
              >
                Knell Edit
              </span>
            </div>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(3rem, 7vw, 6.5rem)",
                lineHeight: 0.9,
                color: "#ede9dc",
                letterSpacing: "0.02em",
              }}
            >
              SEND THE CLIP.
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: "2px #5dc94a" }}>
                GET IT BACK.
              </span>
            </h1>
          </div>
          <div
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.65rem",
              color: "#6b7a62",
              letterSpacing: "0.08em",
              lineHeight: 1.8,
              maxWidth: 280,
              paddingBottom: "0.5rem",
            }}
          >
            No browsing freelancers.
            <br />
            No back and forth.
            <br />
            One edit, one price, one deadline.
          </div>
        </section>

        {/* divider */}
        <div style={{ borderTop: "1px solid rgba(93,201,74,0.12)", margin: "0 3rem" }} />

        {/* ── TIMELINE / SCRUBBER SIGNATURE ELEMENT ── */}
        <section style={{ padding: "2.5rem 3rem", maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              position: "relative",
              background: "#0c0d10",
              border: "1px solid rgba(93,201,74,0.12)",
              padding: "2.5rem 2.5rem 2rem",
            }}
          >
            {/* track */}
            <div
              style={{
                position: "relative",
                height: 6,
                background: "rgba(237,233,220,0.07)",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "100%",
                  background: "linear-gradient(90deg, #5dc94a 0%, #5dc94a 100%)",
                  opacity: 0.18,
                }}
              />
              {/* cut markers */}
              {[18, 38, 62, 84].map((pos) => (
                <div
                  key={pos}
                  style={{
                    position: "absolute",
                    left: `${pos}%`,
                    top: -4,
                    width: 2,
                    height: 14,
                    background: "#5dc94a",
                  }}
                />
              ))}
              {/* playhead */}
              <div
                style={{
                  position: "absolute",
                  left: "84%",
                  top: -7,
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "8px solid #ede9dc",
                }}
              />
            </div>

            {/* timestamps row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.52rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#3d4438",
                    marginBottom: "0.4rem",
                  }}
                >
                  00:00 — Raw clip in
                </div>
                <div
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    color: "#6b7a62",
                  }}
                >
                  Cuts · Captions · Color · Sync
                </div>
              </div>

              <div style={{ display: "flex", gap: "2.5rem" }}>
                <div>
                  <div
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.5rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#3d4438",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "2.4rem",
                      letterSpacing: "0.03em",
                      color: "#5dc94a",
                      lineHeight: 1,
                    }}
                  >
                    ₹{PRICE}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.5rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#3d4438",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Turnaround
                  </div>
                  <div
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "2.4rem",
                      letterSpacing: "0.03em",
                      color: "#ede9dc",
                      lineHeight: 1,
                    }}
                  >
                    {TURNAROUND}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEMO WORK GRID ── */}
        <section style={{ padding: "0 3rem 2.5rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#5dc94a",
              }}
            >
              See What You're Buying
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "Space Mono, monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
                color: "#3d4438",
              }}
            >
              {DEMO_EDITS.length} examples
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1px",
              background: "rgba(93,201,74,0.08)",
              border: "1px solid rgba(93,201,74,0.08)",
            }}
          >
            {DEMO_EDITS.map((demo) => {
              const hovered = hoveredDemo === demo.id;
              const hasVideo = Boolean(demo.video);
              return (
                <div
                  key={demo.id}
                  onMouseEnter={() => setHoveredDemo(demo.id)}
                  onMouseLeave={() => setHoveredDemo(null)}
                  style={{
                    background: hovered ? "#0f1014" : "#09090b",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* top accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 2,
                      height: hovered ? "2px" : "0px",
                      background: demo.accent,
                      transition: "height 0.2s",
                    }}
                  />

                  {/* media area, 9:16-ish */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "9 / 12",
                      background: "#0c0d10",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {hasVideo ? (
                      <video
                        src={demo.video}
                        poster={demo.thumb || undefined}
                        controls
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            border: `1px solid ${demo.accent}55`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 0,
                              height: 0,
                              borderTop: "7px solid transparent",
                              borderBottom: "7px solid transparent",
                              borderLeft: `10px solid ${demo.accent}aa`,
                              marginLeft: "2px",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "Space Mono, monospace",
                            fontSize: "0.48rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#3d4438",
                            textAlign: "center",
                          }}
                        >
                          Demo coming soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* label */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1rem",
                        letterSpacing: "0.04em",
                        color: hovered ? "#ede9dc" : "#dbd7ca",
                        transition: "color 0.15s",
                      }}
                    >
                      {demo.label}
                    </span>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: demo.accent,
                        opacity: hovered ? 1 : 0.4,
                        transition: "opacity 0.2s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SCOPE GRID ── */}
        <section style={{ padding: "0 3rem 2.5rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 6, height: 6, background: "#f0c94a", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#f0c94a",
              }}
            >
              What's Included
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1px",
              background: "rgba(240,201,74,0.06)",
              border: "1px solid rgba(240,201,74,0.06)",
            }}
          >
            {SCOPE_ITEMS.map((item, i) => {
              const hov = hoveredScope === i;
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setHoveredScope(i)}
                  onMouseLeave={() => setHoveredScope(null)}
                  style={{
                    background: hov ? "#0f1014" : "#09090b",
                    padding: "1.5rem 1.75rem",
                    position: "relative",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: hov ? "3px" : "0px",
                      background: item.accent,
                      transition: "width 0.2s",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.5rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: item.accent,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "1.1rem",
                      letterSpacing: "0.02em",
                      color: hov ? "#ede9dc" : "#dbd7ca",
                      lineHeight: 1.2,
                      transition: "color 0.15s",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "0 3rem 2.5rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 6, height: 6, background: "#6b7aff", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#6b7aff",
              }}
            >
              How It Works
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2rem",
            }}
          >
            {STEPS.map((step) => (
              <div key={step.n}>
                <div
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "2.5rem",
                    color: "transparent",
                    WebkitTextStroke: "1.5px #3d4438",
                    marginBottom: "0.75rem",
                    lineHeight: 1,
                  }}
                >
                  {step.n}
                </div>
                <p
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.3rem",
                    letterSpacing: "0.03em",
                    color: "#ede9dc",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.58rem",
                    color: "#6b7a62",
                    letterSpacing: "0.05em",
                    lineHeight: 1.7,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── REQUEST FORM ── */}
        <section
          id="request"
          style={{
            borderTop: "1px solid rgba(93,201,74,0.12)",
            padding: "3.5rem 3rem 4rem",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#5dc94a",
              }}
            >
              Start Your Edit
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              lineHeight: 1,
              color: "#ede9dc",
              letterSpacing: "0.02em",
              marginBottom: "2rem",
            }}
          >
            SEND YOUR CLIP. WE'LL CONFIRM SCOPE AND SEND THE PAYMENT LINK.
          </h2>

          {submitted ? (
            <div
              style={{
                border: "1px solid rgba(93,201,74,0.3)",
                background: "rgba(93,201,74,0.06)",
                padding: "2rem",
                fontFamily: "Space Mono, monospace",
                fontSize: "0.65rem",
                color: "#5dc94a",
                letterSpacing: "0.05em",
                lineHeight: 1.8,
              }}
            >
              Got it. We'll check your clip against scope and send a Razorpay
              payment link to confirm. Usually within a few hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <FormField
                label="Raw clip link"
                placeholder="Google Drive / WeTransfer / Dropbox link"
                value={form.link}
                onChange={handleChange("link")}
                required
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <FormField
                  label="Project type"
                  placeholder="Reel, vlog, talking head..."
                  value={form.type}
                  onChange={handleChange("type")}
                  required
                />
                <FormField
                  label="Approx. length"
                  placeholder="e.g. 60 seconds"
                  value={form.length}
                  onChange={handleChange("length")}
                  required
                />
              </div>
              <FormField
                label="Contact (email or phone)"
                placeholder="So we can send the payment link"
                value={form.contact}
                onChange={handleChange("contact")}
                required
              />
              <button
                type="submit"
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  background: "#5dc94a",
                  color: "#09090b",
                  border: "none",
                  padding: "1rem 2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  width: "fit-content",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Submit for Scope Check →
              </button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}

// ─── FORM FIELD ─────────────────────────────────────────────
function FormField({ label, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <span
        style={{
          fontFamily: "Space Mono, monospace",
          fontSize: "0.52rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#6b7a62",
        }}
      >
        {label}
      </span>
      <input
        {...props}
        style={{
          background: "#0c0d10",
          border: "1px solid rgba(237,233,220,0.1)",
          color: "#ede9dc",
          padding: "0.85rem 1rem",
          fontFamily: "Space Mono, monospace",
          fontSize: "0.65rem",
          outline: "none",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(93,201,74,0.5)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(237,233,220,0.1)")}
      />
    </label>
  );
}