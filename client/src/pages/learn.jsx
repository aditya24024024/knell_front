import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";

const UDEMY_GENERAL_LINK = "https://trk.udemy.com/vDVzky";

// ─── COURSES ────────────────────────────────────────────────
// Drop thumbnails in /public/thumbnails/ matching the image filenames below
const COURSES = [
  {
    id: 1,
    title: "CapCut Pro – Complete Video Editing for Creators",
    instructor: "Video School",
    rating: 4.6,
    reviews: 11200,
    price: 399,
    originalPrice: 2999,
    tag: "Trending",
    level: "Beginner",
    hours: "8",
    affiliateUrl: "https://trk.udemy.com/yZkgKb",
    image: "/thumbnails/capcut.png",
    accent: "#4af0d0",
    letter: "C",
  },
  {
    id: 2,
    title: "Video Editing Masterclass – Pro Techniques",
    instructor: "Phil Ebiner",
    rating: 4.7,
    reviews: 31500,
    price: 499,
    originalPrice: 3499,
    tag: "Bestseller",
    level: "All Levels",
    hours: "18",
    affiliateUrl: "https://trk.udemy.com/m4GRKa",
    image: "/thumbnails/video-editing-masterclass.png",
    accent: "#5dc94a",
    letter: "V",
  },
  {
    id: 3,
    title: "Adobe Premiere Pro – Complete Masterclass",
    instructor: "Darren Mostyn",
    rating: 4.8,
    reviews: 22400,
    price: 449,
    originalPrice: 3499,
    tag: "Top Rated",
    level: "Beginner",
    hours: "22",
    affiliateUrl: "https://trk.udemy.com/L02aLL",
    image: "/thumbnails/premiere-pro.jpg",
    accent: "#6b7aff",
    letter: "P",
  },
  {
    id: 4,
    title: "Deep Video Editing – Advanced Color & Sound",
    instructor: "Casey Faris",
    rating: 4.7,
    reviews: 8900,
    price: 549,
    originalPrice: 3999,
    tag: null,
    level: "Advanced",
    hours: "14",
    affiliateUrl: "https://trk.udemy.com/enNv0D",
    image: "/thumbnails/deep-editing.jpg",
    accent: "#ff6b6b",
    letter: "D",
  },
  {
    id: 5,
    title: "Color Grading Masterclass – Cinematic Look",
    instructor: "Jordy Vandeput",
    rating: 4.7,
    reviews: 14300,
    price: 499,
    originalPrice: 3499,
    tag: "Top Rated",
    level: "Intermediate",
    hours: "12",
    affiliateUrl: "https://trk.udemy.com/enN4GZ",
    image: "/thumbnails/color-grading.png",
    accent: "#f0c94a",
    letter: "C",
  },
  {
    id: 6,
    title: "Motion Graphics – After Effects Zero to Hero",
    instructor: "Daniel Walter Scott",
    rating: 4.8,
    reviews: 16300,
    price: 599,
    originalPrice: 4999,
    tag: "Bestseller",
    level: "Beginner",
    hours: "28",
    affiliateUrl: "https://trk.udemy.com/9VEW3Y",
    image: "/thumbnails/motion-graphics.png",
    accent: "#d94af0",
    letter: "M",
  },
  {
    id: 7,
    title: "Freelancing Masterclass – Build a Business from Scratch",
    instructor: "Brad Hussey",
    rating: 4.6,
    reviews: 21800,
    price: 499,
    originalPrice: 3999,
    tag: "Bestseller",
    level: "All Levels",
    hours: "16",
    affiliateUrl: "https://trk.udemy.com/6kEb9E",
    image: "/thumbnails/freelancing.png",
    accent: "#5dc94a",
    letter: "F",
  },
];

// ─── CERTIFICATIONS ─────────────────────────────────────────
// free: true = show "Free" badge, no price. free: false = paid Udemy course
const CERTIFICATIONS = [
  {
    id: "cert-1",
    title: "PMP Certification Prep – Project Management",
    issuer: "PMI Recognized",
    description: "Industry-standard project management cert. Recognized globally — great for freelancers managing client projects on Knell.",
    affiliateUrl: "https://trk.udemy.com/3kEANX",
    image: "/thumbnails/pmp-cert.jpg",
    accent: "#f0c94a",
    icon: "📋",
    free: false,
    price: "₹799",
  },
  {
    id: "cert-2",
    title: "Microsoft Azure Fundamentals (AZ-900)",
    issuer: "Microsoft Certified",
    description: "Official Azure cert prep. Adds serious credibility for tech freelancers and developers on Knell.",
    affiliateUrl: "https://trk.udemy.com/enNvWD",
    image: "/thumbnails/azure-cert.jpg",
    accent: "#4a9af0",
    icon: "☁️",
    free: false,
    price: "₹499",
  },
  {
    id: "cert-3",
    title: "Google Digital Marketing & E-commerce",
    issuer: "Google",
    description: "Google's own certificate covering SEO, ads, analytics and e-commerce. Huge name recognition for marketing freelancers.",
    affiliateUrl: "https://grow.google/certificates/digital-marketing-ecommerce/",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    accent: "#4af0d0",
    icon: null,
    free: true,
    price: null,
  },
  {
    id: "cert-4",
    title: "HubSpot Content Marketing Certification",
    issuer: "HubSpot Academy",
    description: "One of the most recognized free certs in marketing. Proves content strategy skills — perfect for creator-marketers on Knell.",
    affiliateUrl: "https://academy.hubspot.com/courses/content-marketing",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
    accent: "#ff6b6b",
    icon: null,
    free: true,
    price: null,
  },
  {
    id: "cert-5",
    title: "Meta Social Media Marketing Certificate",
    issuer: "Meta",
    description: "Covers Instagram, Facebook ads, and analytics — directly relevant to creators and brand managers on Knell.",
    affiliateUrl: "https://www.coursera.org/professional-certificates/facebook-social-media-marketing",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    accent: "#6b7aff",
    icon: null,
    free: true,
    price: null,
  },
  {
    id: "cert-6",
    title: "Canva Design Certification",
    issuer: "Canva",
    description: "Official Canva cert. Instantly recognizable for thumbnail designers, social media creators and graphic freelancers.",
    affiliateUrl: "https://www.canva.com/designschool/certification/",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    accent: "#4af0d0",
    icon: null,
    free: true,
    price: null,
  },
  {
    id: "cert-7",
    title: "YouTube Creator Academy",
    issuer: "YouTube / Google",
    description: "YouTube's official learning program for creators. Perfect for streamers and video creators building their channel strategy.",
    affiliateUrl: "https://creatoracademy.youtube.com/",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    accent: "#ff6b6b",
    icon: null,
    free: true,
    price: null,
  },
];

// ─── COMPONENT ───────────────────────────────────────────────
export default function LearnPage() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredCert, setHoveredCert] = useState(null);

  return (
    <>
      <Head>
        <title>Knell Learn — Level Up Your Skills</title>
        <meta name="description" content="Curated courses and certifications for Indian creators and freelancers." />
      </Head>

      <Navbar />

      <main style={{ background: "#09090b", minHeight: "100vh", paddingTop: "20px" }}>

        {/* ── HERO ── */}
       <section style={{
  padding: "1.5rem 3rem 2rem",
  maxWidth: 1280,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "start",
  gap: "2rem",
}}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
              <span style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#5dc94a",
              }}>
                Knell Learn · Powered by Udemy
              </span>
            </div>
            <h1 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              lineHeight: 0.9,
              color: "#ede9dc",
              letterSpacing: "0.02em",
            }}>
              GET BETTER.<br />
              <span style={{ color: "transparent", WebkitTextStroke: "2px #5dc94a" }}>
                GET PAID.
              </span>
            </h1>
          </div>
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.65rem",
            color: "#6b7a62",
            letterSpacing: "0.08em",
            lineHeight: 1.8,
            maxWidth: 280,
            paddingBottom: "0.5rem",
          }}>
            Handpicked courses for Indian<br />
            creators and freelancers.<br />
            Learn the skill. List the gig.
          </div>
        </section>

        {/* divider */}
        <div style={{ borderTop: "1px solid rgba(93,201,74,0.12)", margin: "0 3rem" }} />

        {/* ── UDEMY AFFILIATE BANNER ── */}
        <section style={{ padding: "2.5rem 3rem", maxWidth: 1280, margin: "0 auto" }}>
          <a href={UDEMY_GENERAL_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #1c1f16 0%, #111410 50%, #0f1209 100%)",
                border: "1px solid rgba(93,201,74,0.25)",
                padding: "2.5rem 3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "2rem",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.25)"; }}
            >
              <div style={{
                position: "absolute", top: "-60px", right: "-60px",
                width: 280, height: 280,
                background: "radial-gradient(circle, rgba(93,201,74,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{
                  background: "#a435f0", padding: "0.6rem 1.4rem",
                  display: "flex", alignItems: "center", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "white", letterSpacing: "0.1em" }}>UDEMY</span>
                </div>
                <div>
                  <p style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                    color: "#ede9dc", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "0.4rem",
                  }}>
                    EXPLORE ALL COURSES ON UDEMY
                  </p>
                  <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.58rem", color: "#6b7a62", letterSpacing: "0.1em" }}>
                    210,000+ courses · Learn anything · Lifetime access
                  </p>
                </div>
              </div>
              <div style={{
                fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.15em",
                textTransform: "uppercase", background: "#5dc94a", color: "#09090b",
                padding: "0.9rem 2.25rem", fontWeight: 700, flexShrink: 0,
              }}>
                Browse Udemy →
              </div>
            </div>
          </a>
        </section>

        {/* ── COURSE GRID ── */}
        <section style={{ padding: "0 3rem 2rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.55rem",
              letterSpacing: "0.3em", textTransform: "uppercase", color: "#5dc94a",
            }}>
              Featured Courses
            </span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "Space Mono, monospace", fontSize: "0.5rem",
              letterSpacing: "0.1em", color: "#3d4438",
            }}>
              {COURSES.length} courses
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1px",
            background: "rgba(93,201,74,0.08)",
            border: "1px solid rgba(93,201,74,0.08)",
          }}>
            {COURSES.map((course) => {
              const hovered = hoveredCard === course.id;
              return (
                <a
                  key={course.id}
                  href={course.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  onMouseEnter={() => setHoveredCard(course.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{
                    background: hovered ? "#0f1014" : "#09090b",
                    height: "100%", display: "flex", flexDirection: "column",
                    transition: "background 0.15s", position: "relative",
                    overflow: "hidden", boxSizing: "border-box",
                  }}>
                    {/* top accent bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
                      height: hovered ? "2px" : "0px",
                      background: course.accent, transition: "height 0.2s",
                    }} />

                    {/* IMAGE */}
                    <div style={{ width: "100%", height: 170, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                      <img
                        src={course.image}
                        alt={course.title}
                        style={{
                          width: "100%", height: "100%", objectFit: "cover", display: "block",
                          transition: "transform 0.35s",
                          transform: hovered ? "scale(1.05)" : "scale(1)",
                        }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: hovered ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)",
                        transition: "background 0.2s",
                      }} />
                      <div style={{
                        position: "absolute", top: "0.6rem", right: "0.6rem",
                        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem",
                      }}>
                        {course.tag && (
                          <span style={{
                            fontFamily: "Space Mono, monospace", fontSize: "0.45rem",
                            letterSpacing: "0.15em", textTransform: "uppercase",
                            padding: "0.2rem 0.5rem", fontWeight: 700,
                            background: course.tag === "Bestseller" ? "#5dc94a" : "rgba(9,9,11,0.85)",
                            border: course.tag === "Bestseller" ? "none" : `1px solid ${course.accent}88`,
                            color: course.tag === "Bestseller" ? "#09090b" : course.accent,
                          }}>
                            {course.tag}
                          </span>
                        )}
                        <span style={{
                          fontFamily: "Space Mono, monospace", fontSize: "0.45rem",
                          letterSpacing: "0.12em", textTransform: "uppercase",
                          color: "#ede9dc", background: "rgba(9,9,11,0.75)",
                          border: "1px solid rgba(237,233,220,0.1)", padding: "0.2rem 0.5rem",
                        }}>
                          {course.level}
                        </span>
                      </div>
                    </div>

                    {/* card body */}
                    <div style={{ padding: "1.25rem 1.5rem 1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem",
                          letterSpacing: "0.04em", lineHeight: 1.15, marginBottom: "0.35rem",
                          color: hovered ? "#ede9dc" : "#dbd7ca", transition: "color 0.15s",
                        }}>
                          {course.title}
                        </p>
                        <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.52rem", letterSpacing: "0.08em", color: "#6b7a62" }}>
                          {course.instructor}
                        </p>
                      </div>

                      <div style={{
                        display: "flex", alignItems: "center",
                        paddingTop: "0.75rem", borderTop: "1px solid rgba(237,233,220,0.06)", gap: "0.75rem",
                      }}>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.52rem", color: "#6b7a62", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <span style={{ color: "#e8b84b" }}>★</span>
                          {course.rating}
                          <span style={{ color: "#3d4438" }}>({(course.reviews / 1000).toFixed(0)}K)</span>
                        </span>
                        <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.52rem", color: "#3d4438" }}>
                          {course.hours}h
                        </span>
                        <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.48rem", color: "#3d4438", textDecoration: "line-through" }}>
                            ₹{course.originalPrice}
                          </span>
                          <span style={{
                            fontFamily: "Bebas Neue, sans-serif", fontSize: "1.15rem", letterSpacing: "0.05em",
                            color: hovered ? course.accent : "#ede9dc", transition: "color 0.15s",
                          }}>
                            ₹{course.price}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.52rem",
                        letterSpacing: "0.15em", textTransform: "uppercase", color: course.accent,
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateY(0)" : "translateY(4px)",
                        transition: "all 0.2s",
                      }}>
                        Enroll on Udemy →
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── GET CERTIFIED SECTION ── */}
        <section style={{ padding: "3rem 3rem 5rem", maxWidth: 1280, margin: "0 auto" }}>

          {/* section header */}
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem", marginBottom: "2rem",
            paddingTop: "2rem", borderTop: "1px solid rgba(240,201,74,0.1)",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 6, height: 6, background: "#f0c94a", borderRadius: "50%" }} />
                <span style={{
                  fontFamily: "Space Mono, monospace", fontSize: "0.55rem",
                  letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0c94a",
                }}>
                  Industry Certifications
                </span>
              </div>
              <h2 style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 0.95, color: "#ede9dc", letterSpacing: "0.02em",
              }}>
                GET CERTIFIED.<br />
                <span style={{ color: "transparent", WebkitTextStroke: "2px #f0c94a" }}>STAND OUT.</span>
              </h2>
            </div>
            <p style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.58rem", color: "#6b7a62",
              letterSpacing: "0.08em", lineHeight: 1.8, maxWidth: 300, paddingBottom: "0.25rem",
            }}>
              Add globally recognized certs to your Knell profile.<br />
              Clients trust freelancers who can prove their skills.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(240,201,74,0.06)", border: "1px solid rgba(240,201,74,0.06)" }}>
            {CERTIFICATIONS.map((cert) => {
              const hov = hoveredCert === cert.id;
              return (
                <a
                  key={cert.id}
                  href={cert.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                  onMouseEnter={() => setHoveredCert(cert.id)}
                  onMouseLeave={() => setHoveredCert(null)}
                >
                  <div style={{
                    background: hov ? "#0f1014" : "#09090b",
                    display: "flex", alignItems: "stretch",
                    transition: "background 0.15s", position: "relative",
                    overflow: "hidden", minHeight: 130,
                  }}>
                    {/* left accent bar */}
                    <div style={{
                      width: hov ? "4px" : "0px",
                      background: cert.accent,
                      transition: "width 0.2s", flexShrink: 0,
                    }} />

                    {/* thumbnail */}
                    <div style={{ width: 180, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                      {cert.free ? (
                        <div style={{
                          width: "100%", height: "100%",
                          background: `${cert.accent}15`,
                          borderRight: `1px solid ${cert.accent}20`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: "1.5rem", boxSizing: "border-box",
                        }}>
                          <img
                            src={cert.image}
                            alt={cert.issuer}
                            style={{
                              maxWidth: "100%", maxHeight: 55,
                              objectFit: "contain",
                              filter: "brightness(0) invert(1)",
                              opacity: hov ? 1 : 0.65,
                              transition: "opacity 0.2s",
                            }}
                          />
                        </div>
                      ) : (
                        <img
                          src={cert.image}
                          alt={cert.title}
                          style={{
                            width: "100%", height: "100%", objectFit: "cover", display: "block",
                            transition: "transform 0.35s",
                            transform: hov ? "scale(1.05)" : "scale(1)",
                            filter: hov ? "brightness(0.8)" : "brightness(0.55)",
                          }}
                        />
                      )}
                    </div>

                    {/* text */}
                    <div style={{ flex: 1, padding: "1.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.4rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <p style={{
                          fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem",
                          letterSpacing: "0.04em", color: hov ? "#ede9dc" : "#dbd7ca",
                          lineHeight: 1, transition: "color 0.15s",
                        }}>
                          {cert.title}
                        </p>
                        <span style={{
                          fontFamily: "Space Mono, monospace", fontSize: "0.45rem",
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          padding: "0.2rem 0.6rem",
                          border: `1px solid ${cert.accent}55`,
                          color: cert.accent,
                        }}>
                          {cert.issuer}
                        </span>
                        {/* FREE badge */}
                        {cert.free && (
                          <span style={{
                            fontFamily: "Space Mono, monospace", fontSize: "0.45rem",
                            letterSpacing: "0.15em", textTransform: "uppercase",
                            padding: "0.2rem 0.6rem",
                            background: "#5dc94a",
                            color: "#09090b",
                            fontWeight: 700,
                          }}>
                            Free
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.54rem",
                        color: "#6b7a62", letterSpacing: "0.06em", lineHeight: 1.7, maxWidth: 500,
                      }}>
                        {cert.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div style={{ display: "flex", alignItems: "center", padding: "0 2rem", flexShrink: 0 }}>
                      <div style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.58rem",
                        letterSpacing: "0.15em", textTransform: "uppercase",
                        padding: "0.7rem 1.5rem", fontWeight: 700,
                        border: `1px solid ${cert.free ? "#5dc94a" : cert.accent}`,
                        color: hov ? "#09090b" : (cert.free ? "#5dc94a" : cert.accent),
                        background: hov ? (cert.free ? "#5dc94a" : cert.accent) : "transparent",
                        transition: "all 0.2s", whiteSpace: "nowrap",
                      }}>
                        {cert.free ? "Get for Free →" : "Get Certified →"}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{
          borderTop: "1px solid rgba(93,201,74,0.1)",
          padding: "4rem 3rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "2rem", maxWidth: 1280, margin: "0 auto",
        }}>
          <div>
            <h2 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#ede9dc", letterSpacing: "0.04em", marginBottom: "0.5rem",
            }}>
              LEARN THE SKILL.{" "}
              <span style={{ color: "#5dc94a" }}>LIST THE GIG.</span>
            </h2>
            <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.58rem", color: "#6b7a62", letterSpacing: "0.08em" }}>
              Complete a course · Add it to your Knell profile · Start landing better gigs
            </p>
          </div>
          <a
            href="/search?q=a"
            style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.15em",
              textTransform: "uppercase", border: "1px solid #5dc94a", color: "#5dc94a",
              padding: "0.9rem 2.25rem", textDecoration: "none", flexShrink: 0,
              transition: "all 0.2s", display: "inline-block",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#5dc94a"; e.currentTarget.style.color = "#09090b"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5dc94a"; }}
          >
            Browse Gigs →
          </a>
        </section>

      </main>
    </>
  );
}