import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Video Editing", value: "editing" },
  { label: "Thumbnail Design", value: "design" },
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
    category: "editing",
    tag: "Bestseller",
    affiliateUrl: "https://www.udemy.com/course/video-editing/?ref=YOUR_AFFILIATE_ID",
    emoji: "🎬",
  },
  {
    id: 2,
    title: "DaVinci Resolve – Complete Video Editing Course",
    instructor: "Darren Mostyn",
    rating: 4.8,
    reviews: 14200,
    price: 449,
    category: "editing",
    tag: "Top Rated",
    affiliateUrl: "https://www.udemy.com/course/davinci-resolve-video-editing/?ref=YOUR_AFFILIATE_ID",
    emoji: "🎞️",
  },
  {
    id: 3,
    title: "Graphic Design Bootcamp – Photoshop, Illustrator",
    instructor: "Derrick Mitchell",
    rating: 4.6,
    reviews: 19800,
    price: 549,
    category: "design",
    tag: "Bestseller",
    affiliateUrl: "https://www.udemy.com/course/graphic-design-bootcamp/?ref=YOUR_AFFILIATE_ID",
    emoji: "🎨",
  },
  {
    id: 4,
    title: "Canva Pro – Thumbnail Design for Creators",
    instructor: "Lindsay Marsh",
    rating: 4.5,
    reviews: 9200,
    price: 399,
    category: "design",
    tag: null,
    affiliateUrl: "https://www.udemy.com/course/canva-graphic-design/?ref=YOUR_AFFILIATE_ID",
    emoji: "✏️",
  },
  {
    id: 5,
    title: "Freelancing on Fiverr & Upwork – Full Guide",
    instructor: "Alex Genadinik",
    rating: 4.7,
    reviews: 32000,
    price: 499,
    category: "freelancing",
    tag: "Bestseller",
    affiliateUrl: "https://www.udemy.com/course/entrepreneurs-guide-to-fiverr-success/?ref=YOUR_AFFILIATE_ID",
    emoji: "💼",
  },
  {
    id: 6,
    title: "Build a Freelance Business from Scratch",
    instructor: "Brad Hussey",
    rating: 4.6,
    reviews: 11500,
    price: 449,
    category: "freelancing",
    tag: "Top Rated",
    affiliateUrl: "https://www.udemy.com/course/freelance-business/?ref=YOUR_AFFILIATE_ID",
    emoji: "🚀",
  },
  {
    id: 7,
    title: "Instagram Marketing 2024 – Grow to 10K Followers",
    instructor: "Evan Kimbrell",
    rating: 4.5,
    reviews: 17600,
    price: 549,
    category: "marketing",
    tag: null,
    affiliateUrl: "https://www.udemy.com/course/instagram-marketing/?ref=YOUR_AFFILIATE_ID",
    emoji: "📱",
  },
  {
    id: 8,
    title: "YouTube Mastery – Grow Your Channel Fast",
    instructor: "Sunny Lenarduzzi",
    rating: 4.6,
    reviews: 22100,
    price: 499,
    category: "marketing",
    tag: "Bestseller",
    affiliateUrl: "https://www.udemy.com/course/youtube-channel-growth/?ref=YOUR_AFFILIATE_ID",
    emoji: "▶️",
  },
  {
    id: 9,
    title: "After Effects Motion Graphics – Zero to Hero",
    instructor: "Daniel Walter Scott",
    rating: 4.8,
    reviews: 16300,
    price: 599,
    category: "motion",
    tag: "Top Rated",
    affiliateUrl: "https://www.udemy.com/course/after-effects-motion-graphics/?ref=YOUR_AFFILIATE_ID",
    emoji: "⚡",
  },
  {
    id: 10,
    title: "Blender 3D – Complete Beginner to Advanced",
    instructor: "Grant Abbitt",
    rating: 4.7,
    reviews: 24800,
    price: 549,
    category: "motion",
    tag: "Bestseller",
    affiliateUrl: "https://www.udemy.com/course/blender-3d-from-zero-to-hero/?ref=YOUR_AFFILIATE_ID",
    emoji: "🧊",
  },
  {
    id: 11,
    title: "Short Form Video Editing – Reels & TikTok",
    instructor: "Ryan Serhant",
    rating: 4.5,
    reviews: 8900,
    price: 399,
    category: "editing",
    tag: null,
    affiliateUrl: "https://www.udemy.com/course/short-form-video/?ref=YOUR_AFFILIATE_ID",
    emoji: "📹",
  },
  {
    id: 12,
    title: "SEO & Digital Marketing Complete Bootcamp",
    instructor: "Brad Hussey",
    rating: 4.6,
    reviews: 13200,
    price: 499,
    category: "marketing",
    tag: null,
    affiliateUrl: "https://www.udemy.com/course/digital-marketing-seo/?ref=YOUR_AFFILIATE_ID",
    emoji: "📈",
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
        <meta name="description" content="Curated courses for Indian creators and freelancers. Learn video editing, design, marketing and more." />
      </Head>

      <Navbar />

      <main style={{ background: "#09090b", minHeight: "100vh", paddingTop: "80px" }}>

        {/* Hero */}
        <section style={{
          padding: "5rem 3rem 4rem",
          maxWidth: 1280,
          margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#5dc94a",
            }}>
              Knell Learn
            </span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>

          <h1 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 0.95,
            color: "#ede9dc",
            letterSpacing: "0.02em",
            marginBottom: "1.5rem",
          }}>
            LEVEL UP YOUR SKILLS.{" "}
            <span style={{ color: "#5dc94a" }}>EARN MORE.</span>
          </h1>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            color: "#6b7a62",
            maxWidth: 540,
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}>
            Curated courses for Indian creators and freelancers. Learn from world-class instructors, get better at your craft, and land more gigs on Knell.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {[
              { value: "12+", label: "Curated Courses" },
              { value: "16K+", label: "Knell Freelancers" },
              { value: "100K+", label: "Students Enrolled" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "2.2rem",
                  color: "#5dc94a",
                  lineHeight: 1,
                }}>{value}</div>
                <div style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#6b7a62",
                  marginTop: "0.25rem",
                }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(93,201,74,0.1)", margin: "0 3rem" }} />

        {/* Category filter */}
        <section style={{ padding: "2.5rem 3rem 0", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {CATEGORIES.map(({ label, value }) => {
              const active = activeCategory === value;
              return (
                <button
                  key={value}
                  onClick={() => setActiveCategory(value)}
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.62rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.45rem 1.1rem",
                    border: `1px solid ${active ? "#5dc94a" : "rgba(93,201,74,0.2)"}`,
                    background: active ? "#5dc94a" : "transparent",
                    color: active ? "#09090b" : "#6b7a62",
                    cursor: "pointer",
                    fontWeight: active ? 700 : 400,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = "#5dc94a";
                      e.currentTarget.style.color = "#5dc94a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = "rgba(93,201,74,0.2)";
                      e.currentTarget.style.color = "#6b7a62";
                    }
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Course grid */}
        <section style={{ padding: "2.5rem 3rem 6rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {filtered.map((course) => (
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
                  background: hoveredCard === course.id ? "#15171c" : "#0f1014",
                  border: "1px solid rgba(93,201,74,0.08)",
                  transition: "all 0.2s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderColor: hoveredCard === course.id ? "rgba(93,201,74,0.25)" : "rgba(93,201,74,0.08)",
                }}>

                  {/* Thumbnail placeholder */}
                  <div style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    background: "#15171c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    position: "relative",
                    borderBottom: "1px solid rgba(93,201,74,0.08)",
                  }}>
                    {course.emoji}
                    {course.tag && (
                      <div style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        background: course.tag === "Bestseller" ? "#5dc94a" : "#3a8a2c",
                        color: "#09090b",
                        fontFamily: "Space Mono, monospace",
                        fontSize: "0.5rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                      }}>
                        {course.tag}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "1rem 1.1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>

                    {/* Instructor */}
                    <div style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      color: "#6b7a62",
                      textTransform: "uppercase",
                      marginBottom: "0.5rem",
                    }}>
                      {course.instructor}
                    </div>

                    {/* Title */}
                    <p style={{
                      fontSize: "0.85rem",
                      color: "#dbd7ca",
                      lineHeight: 1.5,
                      fontWeight: 400,
                      flex: 1,
                      marginBottom: "0.75rem",
                    }}>
                      {course.title}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid rgba(237,233,220,0.07)",
                      paddingTop: "0.75rem",
                    }}>
                      <div style={{
                        fontFamily: "Space Mono, monospace",
                        fontSize: "0.58rem",
                        color: "#6b7a62",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}>
                        <span style={{ color: "#e8b84b" }}>★</span>
                        {course.rating} ({(course.reviews / 1000).toFixed(1)}K)
                      </div>

                      <div style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "1.15rem",
                        letterSpacing: "0.05em",
                        color: "#ede9dc",
                      }}>
                        <span style={{
                          fontFamily: "Space Mono, monospace",
                          fontSize: "0.55rem",
                          color: "#6b7a62",
                          verticalAlign: "middle",
                          marginRight: 2,
                        }}>
                          ₹
                        </span>
                        {course.price}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{
                      marginTop: "0.75rem",
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: hoveredCard === course.id ? "#5dc94a" : "#3a8a2c",
                      transition: "color 0.2s",
                    }}>
                      Enroll on Udemy →
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Bottom banner */}
        <section style={{
          background: "#0f1014",
          borderTop: "1px solid rgba(93,201,74,0.1)",
          borderBottom: "1px solid rgba(93,201,74,0.1)",
          padding: "4rem 3rem",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#5dc94a",
              marginBottom: "1rem",
            }}>
              Powered by Udemy
            </div>
            <h2 style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#ede9dc",
              lineHeight: 1,
              letterSpacing: "0.02em",
              marginBottom: "1rem",
            }}>
              LEARN THE SKILL. LIST THE GIG.{" "}
              <span style={{ color: "#5dc94a" }}>GET PAID.</span>
            </h2>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.88rem",
              color: "#6b7a62",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}>
              Every course above is handpicked for Indian creators on Knell. Complete a course, add it to your profile, and start landing better gigs.
            </p>
            <a
              href="https://www.knell.co.in/search?q=a"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "1px solid #5dc94a",
                color: "#5dc94a",
                padding: "0.8rem 2rem",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#5dc94a"; e.currentTarget.style.color = "#09090b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5dc94a"; }}
            >
              Browse Gigs on Knell →
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
