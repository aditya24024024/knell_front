import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FEATURED_GIGS_ROUTE } from "../../utils/constants";
import { optimizeImage } from "../../utils/cloudinary";

export default function PopularServices() {
  const router = useRouter();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data } = await axios.get(FEATURED_GIGS_ROUTE);
        setGigs(data.gigs || []);
      } catch (err) {
        console.error("Failed to fetch featured gigs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const getAvgRating = (reviews) => {
    if (!reviews?.length) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  const getInitials = (gig) => {
    const name = gig.createdBy?.fullName || gig.createdBy?.username || "?";
    return name.slice(0, 2).toUpperCase();
  };

  const getSellerHandle = (gig) => {
    return gig.createdBy?.username || "seller";
  };

  return (
    <div style={{ background: "#09090b", padding: "5rem 3rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
              letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a",
            }}>
              Featured Gigs
            </span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>
          <h2 style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 0.95, color: "#ede9dc", letterSpacing: "0.02em",
          }}>
            BROWSE WHAT SELLERS{" "}
            <span style={{ color: "#5dc94a" }}>OFFER</span>
          </h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
background: "transparent",
border: "none",
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: "#0f1014", padding: "1rem" }}>
                <div style={{ width: "100%", aspectRatio: "16/9", background: "#15171c", marginBottom: "1rem" }} />
                <div style={{ height: 12, background: "#15171c", marginBottom: "0.5rem", width: "60%" }} />
                <div style={{ height: 10, background: "#15171c", width: "90%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Gig grid */}
        {!loading && gigs.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.5rem",
background: "transparent",
border: "none",
          }}>
            {gigs.map((gig) => {
              const rating = getAvgRating(gig.reviews);
             const image = gig.images?.[0] ? optimizeImage(gig.images[0], 'md') : null;
              return (
                <div
                  key={gig.id}
                  onClick={() => router.push(`/gig/${gig.id}`)}
                  style={{
                    background: "#0f1014",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#15171c")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0f1014")}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: "100%", aspectRatio: "16/9",
                    background: "#1c1f27", position: "relative", overflow: "hidden",
                  }}>
                    {image ? (
                      <Image
                        src={image}
                        alt={gig.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div style={{
                        width: "100%", height: "100%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "2rem", opacity: 0.3,
                      }}>
                        🎬
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "1rem 1.1rem 1.25rem" }}>
                    {/* Seller row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                      <div style={{
                        width: 24, height: 24, background: "#3a8a2c", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Bebas Neue, sans-serif", fontSize: "0.65rem", color: "#ede9dc",
                      }}>
                        {getInitials(gig)}
                      </div>
                      <span style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.58rem",
                        letterSpacing: "0.1em", color: "#6b7a62",
                      }}>
                        @{getSellerHandle(gig)}
                      </span>
                      <div style={{
                        width: 8, height: 8, background: "#5dc94a",
                        borderRadius: "50%", marginLeft: "auto",
                      }} />
                    </div>

                    {/* Title */}
                    <p style={{
                      fontSize: "0.82rem", color: "#dbd7ca",
                      lineHeight: 1.5, marginBottom: "0.75rem",
                      fontWeight: 400,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {gig.title}
                    </p>

                    {/* Footer */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderTop: "1px solid rgba(237,233,220,0.07)", paddingTop: "0.75rem",
                    }}>
                      <div style={{
                        fontFamily: "Space Mono, monospace", fontSize: "0.58rem",
                        color: "#6b7a62", display: "flex", alignItems: "center", gap: "0.3rem",
                      }}>
                        {rating ? (
                          <>
                            <span style={{ color: "#e8b84b" }}>★</span>
                            {rating} ({gig.reviews.length})
                          </>
                        ) : (
                          <span style={{ color: "#3d4438" }}>New</span>
                        )}
                      </div>
                      <div style={{
                        fontFamily: "Bebas Neue, sans-serif", fontSize: "1.1rem",
                        letterSpacing: "0.05em", color: "#ede9dc",
                      }}>
                        <span style={{
                          fontFamily: "Space Mono, monospace", fontSize: "0.55rem",
                          color: "#6b7a62", verticalAlign: "middle", marginRight: 2,
                        }}>
                          from ₹
                        </span>
                        {gig.price}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && gigs.length === 0 && (
          <div style={{
            border: "1px solid rgba(93,201,74,0.1)",
            padding: "4rem",
            textAlign: "center",
            color: "#3d4438",
            fontFamily: "Space Mono, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          }}>
            No gigs yet — be the first to list one.
          </div>
        )}

        {/* View all */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "2.5rem" }}>
          <button
            onClick={() => router.push("/search?q=a")}
            style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.68rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              border: "1px solid rgba(93,201,74,0.2)", color: "#6b7a62",
              padding: "0.8rem 2rem", background: "none", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5dc94a"; e.currentTarget.style.color = "#5dc94a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.2)"; e.currentTarget.style.color = "#6b7a62"; }}
          >
            View All Gigs →
          </button>
        </div>
      </div>
    </div>
  );
}