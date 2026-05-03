import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";


const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Video Editing", value: "editing" },
  { label: "Design", value: "design" },
  { label: "Freelancing", value: "freelancing" },
  { label: "Marketing", value: "marketing" },
  { label: "Motion Graphics", value: "motion" },
];

const COURSES = [
  {
    id: 1,
    title: "Complete Video Editing in Premiere Pro",
    instructor: "Phil Ebiner",
    rating: 4.7,
    reviews: 28400,
    price: 499,
    originalPrice: 3499,
    category: "editing",
    tag: "Bestseller",
    level: "Beginner",
    hours: "14.5",
    affiliateUrl: "https://www.udemy.com/course/video-editing/?ref=YOUR_AFFILIATE_ID",
    color: "#1a2a1a",
    accent: "#5dc94a",
    letter: "P",
  },
  {
    id: 2,
    title: "DaVinci Resolve – Complete Video Editing",
    instructor: "Darren Mostyn",
    rating: 4.8,
    reviews: 14200,
    price: 449,
    originalPrice: 3499,
    category: "editing",
    tag: "Top Rated",
    level: "All Levels",
    hours: "22",
    affiliateUrl: "https://www.udemy.com/course/davinci-resolve-video-editing/?ref=YOUR_AFFILIATE_ID",
    color: "#1a1a2a",
    accent: "#6b7aff",
    letter: "D",
  },
  {
    id: 3,
    title: "Graphic Design Bootcamp – Photoshop & Illustrator",
    instructor: "Derrick Mitchell",
    rating: 4.6,
    reviews: 19800,
    price: 549,
    originalPrice: 4499,
    category: "design",
    tag: "Bestseller",
    level: "Beginner",
    hours: "19",
    affiliateUrl: "https://www.udemy.com/course/graphic-design-bootcamp/?ref=YOUR_AFFILIATE_ID",
    color: "#2a1a1a",
    accent: "#ff6b6b",
    letter: "G",
  },
  {
    id: 4,
    title: "Canva Pro – Thumbnail Design for Creators",
    instructor: "Lindsay Marsh",
    rating: 4.5,
    reviews: 9200,
    price: 399,
    originalPrice: 2999,
    category: "design",
    tag: null,
    level: "Beginner",
    hours: "8",
    affiliateUrl: "https://www.udemy.com/course/canva-graphic-design/?ref=YOUR_AFFILIATE_ID",
    color: "#1a2a2a",
    accent: "#4af0d0",
    letter: "C",
  },
  {
    id: 5,
    title: "Freelancing on Fiverr & Upwork – Full Guide",
    instructor: "Alex Genadinik",
    rating: 4.7,
    reviews: 32000,
    price: 499,
    originalPrice: 3499,
    category: "freelancing",
    tag: "Bestseller",
    level: "All Levels",
    hours: "11",
    affiliateUrl: "https://www.udemy.com/course/entrepreneurs-guide-to-fiverr-success/?ref=YOUR_AFFILIATE_ID",
    color: "#2a2a1a",
    accent: "#f0c94a",
    letter: "F",
  },
  {
    id: 6,
    title: "Build a Freelance Business from Scratch",
    instructor: "Brad Hussey",
    rating: 4.6,
    reviews: 11500,
    price: 449,
    originalPrice: 2999,
    category: "freelancing",
    tag: "Top Rated",
    level: "Beginner",
    hours: "9.5",
    affiliateUrl: "https://www.udemy.com/course/freelance-business/?ref=YOUR_AFFILIATE_ID",
    color: "#1a1a1a",
    accent: "#5dc94a",
    letter: "B",
  },
  {
    id: 7,
    title: "Instagram Marketing – Grow to 10K Followers",
    instructor: "Evan Kimbrell",
    rating: 4.5,
    reviews: 17600,
    price: 549,
    originalPrice: 3999,
    category: "marketing",
    tag: null,
    level: "Intermediate",
    hours: "12",
    affiliateUrl: "https://www.udemy.com/course/instagram-marketing/?ref=YOUR_AFFILIATE_ID",
    color: "#2a1a2a",
    accent: "#d94af0",
    letter: "I",
  },
  {
    id: 8,
    title: "YouTube Mastery – Grow Your Channel Fast",
    instructor: "Sunny Lenarduzzi",
    rating: 4.6,
    reviews: 22100,
    price: 499,
    originalPrice: 3499,
    category: "marketing",
    tag: "Bestseller",
    level: "All Levels",
    hours: "16",
    affiliateUrl: "https://www.udemy.com/course/youtube-channel-growth/?ref=YOUR_AFFILIATE_ID",
    color: "#2a1a1a",
    accent: "#ff6b6b",
    letter: "Y",
  },
  {
    id: 9,
    title: "After Effects Motion Graphics – Zero to Hero",
    instructor: "Daniel Walter Scott",
    rating: 4.8,
    reviews: 16300,
    price: 599,
    originalPrice: 4999,
    category: "motion",
    tag: "Top Rated",
    level: "Beginner",
    hours: "28",
    affiliateUrl: "https://www.udemy.com/course/after-effects-motion-graphics/?ref=YOUR_AFFILIATE_ID",
    color: "#1a2a1a",
    accent: "#5dc94a",
    letter: "A",
  },
  {
    id: 10,
    title: "Blender 3D – Complete Beginner to Advanced",
    instructor: "Grant Abbitt",
    rating: 4.7,
    reviews: 24800,
    price: 549,
    originalPrice: 3999,
    category: "motion",
    tag: "Bestseller",
    level: "Beginner",
    hours: "20",
    affiliateUrl: "https://www.udemy.com/course/blender-3d-from-zero-to-hero/?ref=YOUR_AFFILIATE_ID",
    color: "#1a1a2a",
    accent: "#6b7aff",
    letter: "B",
  },
  {
    id: 11,
    title: "Short Form Video Editing – Reels & TikTok",
    instructor: "Ryan Serhant",
    rating: 4.5,
    reviews: 8900,
    price: 399,
    originalPrice: 2999,
    category: "editing",
    tag: null,
    level: "Beginner",
    hours: "6",
    affiliateUrl: "https://www.udemy.com/course/short-form-video/?ref=YOUR_AFFILIATE_ID",
    color: "#1a2a2a",
    accent: "#4af0d0",
    letter: "S",
  },
  {
    id: 12,
    title: "SEO & Digital Marketing Complete Bootcamp",
    instructor: "Brad Hussey",
    rating: 4.6,
    reviews: 13200,
    price: 499,
    originalPrice: 3999,
    category: "marketing",
    tag: null,
    level: "All Levels",
    hours: "23",
    affiliateUrl: "https://www.udemy.com/course/digital-marketing-seo/?ref=YOUR_AFFILIATE_ID",
    color: "#2a2a1a",
    accent: "#f0c94a",
    letter: "S",
  },
];

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered = activeCategory === "all"
    ? COURSES
    : COURSES.filter((c) => c.category === activeCategory);

  return (
    <>
      <Head>
        <title>Knell Learn — Level Up Your Skills</title>
        <meta name="description" content="Curated courses for Indian creators and freelancers." />
      </Head>

      <Navbar />

      <main style={{ background: "#09090b", minHeight: "100vh", paddingTop: "72px" }}>

        {/* Hero */}
        <section style={{
          padding: "4rem 3rem 3rem",
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
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
              <span style={{
                color: "transparent",
                WebkitTextStroke: "2px #5dc94a",
              }}>
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

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(93,201,74,0.12)", margin: "0 3rem" }} />

        {/* Category filter */}
        <section style={{
          padding: "2rem 3rem",
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}>
          <span style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#3d4438",
            marginRight: "0.5rem",
          }}>Filter</span>
          {CATEGORIES.map(({ label, value }) => {
            const active = activeCategory === value;
            return (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.4rem 1rem",
                  border: `1px solid ${active ? "#5dc94a" : "rgba(93,201,74,0.15)"}`,
                  background: active ? "#5dc94a" : "transparent",
                  color: active ? "#09090b" : "#6b7a62",
                  cursor: "pointer",
                  fontWeight: active ? 700 : 400,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "#5dc94a";
                    e.currentTarget.style.color = "#5dc94a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "rgba(93,201,74,0.15)";
                    e.currentTarget.style.color = "#6b7a62";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
          <span style={{
            marginLeft: "auto",
            fontFamily: "Space Mono, monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            color: "#3d4438",
          }}>
            {filtered.length} courses
          </span>
        </section>

        {/* Course grid — tight bordered layout */}
        <section style={{ padding: "0 3rem 5rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1px",
            background: "rgba(93,201,74,0.08)",
            border: "1px solid rgba(93,201,74,0.08)",
          }}>
            {filtered.map((course) => {
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
                    padding: "1.75rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    transition: "background 0.15s",
                    position: "relative",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    minHeight: 220,
                  }}>

                    {/* Top accent bar on hover */}
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: hovered ? "2px" : "0px",
                      background: course.accent,
                      transition: "height 0.2s",
                    }} />

                    {/* Letter avatar + badges */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        background: course.color,
                        border: `1px solid ${course.accent}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.6rem",
                        color: course.accent,
                        flexShrink: 0,
                      }}>
                        {course.letter}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                        {course.tag && (
                          <span style={{
                            fontFamily: "Space Mono, monospace",
                            fontSize: "0.45rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.5rem",
                            background: course.tag === "Bestseller" ? "#5dc94a" : "transparent",
                            border: course.tag === "Bestseller" ? "none" : "1px solid rgba(93,201,74,0.3)",
                            color: course.tag === "Bestseller" ? "#09090b" : "#5dc94a",
                            fontWeight: 700,
                          }}>
                            {course.tag}
                          </span>
                        )}
                        <span style={{
                          fontFamily: "Space Mono, monospace",
                          fontSize: "0.45rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#3d4438",
                          border: "1px solid rgba(93,201,74,0.08)",
                          padding: "0.2rem 0.5rem",
                        }}>
                          {course.level}
                        </span>
                      </div>
                    </div>

                    {/* Title + instructor */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.2rem",
                        letterSpacing: "0.04em",
                        color: hovered ? "#ede9dc" : "#dbd7ca",
                        lineHeight: 1.15,
                        marginBottom: "0.4rem",
                        transition: "color 0.15s",
                      }}>
                        {course.title}
                      </p>
                      <p style={{
                        fontFamily: "Space Mono, monospace",
                        fontSize: "0.52rem",
                        letterSpacing: "0.08em",
                        color: "#6b7a62",
                      }}>
                        {course.instructor}
                      </p>
                    </div>

                    {/* Bottom row */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid rgba(237,233,220,0.06)",
                      gap: "0.75rem",
                    }}>
                      {/* Rating */}
                      <span style={{
                        fontFamily: "Space Mono, monospace",
                        fontSize: "0.52rem",
                        color: "#6b7a62",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}>
                        <span style={{ color: "#e8b84b" }}>★</span>
                        {course.rating}
                        <span style={{ color: "#3d4438" }}>({(course.reviews / 1000).toFixed(0)}K)</span>
                      </span>

                      {/* Hours */}
                      <span style={{
                        fontFamily: "Space Mono, monospace",
                        fontSize: "0.52rem",
                        color: "#3d4438",
                      }}>
                        {course.hours}h
                      </span>

                      {/* Price */}
                      <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                        <span style={{
                          fontFamily: "Space Mono, monospace",
                          fontSize: "0.48rem",
                          color: "#3d4438",
                          textDecoration: "line-through",
                        }}>
                          ₹{course.originalPrice}
                        </span>
                        <span style={{
                          fontFamily: "Bebas Neue, sans-serif",
                          fontSize: "1.15rem",
                          letterSpacing: "0.05em",
                          color: hovered ? course.accent : "#ede9dc",
                          transition: "color 0.15s",
                        }}>
                          ₹{course.price}
                        </span>
                      </div>
                    </div>

                    {/* Hover CTA */}
                    <div style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.52rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: course.accent,
                      opacity: hovered ? 1 : 0,
                      transform: hovered ? "translateY(0)" : "translateY(4px)",
                      transition: "all 0.2s",
                    }}>
                      Enroll on Udemy →
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA strip */}
        <section style={{
          borderTop: "1px solid rgba(93,201,74,0.1)",
          padding: "4rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2rem",
          maxWidth: 1280,
          margin: "0 auto",
        }}>
          <div>
            <h2 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#ede9dc",
              letterSpacing: "0.04em",
              marginBottom: "0.5rem",
            }}>
              LEARN THE SKILL.{" "}
              <span style={{ color: "#5dc94a" }}>LIST THE GIG.</span>
            </h2>
            <p style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.58rem",
              color: "#6b7a62",
              letterSpacing: "0.08em",
            }}>
              Complete a course · Add it to your Knell profile · Start landing better gigs
            </p>
          </div>
          <a
            href="/search?q=a"
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "1px solid #5dc94a",
              color: "#5dc94a",
              padding: "0.9rem 2.25rem",
              textDecoration: "none",
              flexShrink: 0,
              transition: "all 0.2s",
              display: "inline-block",
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
