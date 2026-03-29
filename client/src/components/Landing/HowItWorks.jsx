import React from "react";

const steps = [
  {
    n: "01",
    title: "Browse Gigs",
    desc: "Search by category, keyword, or price. Every gig is created by a verified seller. No bidding — just browse and buy.",
    side: "buyer",
  },
  {
    n: "02",
    title: "Message the Seller",
    desc: "Chat before you commit. Discuss your brief, timelines, and revisions directly in the app.",
    side: "buyer",
  },
  {
    n: "03",
    title: "Pay & Receive",
    desc: "Pay securely in ₹. Your money is held until you approve the delivery. No risk, full control.",
    side: "buyer",
  },
];

const sellerSteps = [
  {
    n: "01",
    title: "Create Your Gig",
    desc: "List your service — set your price, describe your offer, upload samples. Your gig is your storefront.",
    side: "seller",
  },
  {
    n: "02",
    title: "Get Orders",
    desc: "Buyers discover your gig through search and categories. Knell handles payments and orders for you.",
    side: "seller",
  },
  {
    n: "03",
    title: "Deliver & Earn",
    desc: "Complete the order, get reviewed, and withdraw your earnings. Build your reputation over time.",
    side: "seller",
  },
];

export default function HowItWorks() {
  return (
    <div style={{
      background: "#0f1014",
      borderTop: "1px solid rgba(93,201,74,0.1)",
      borderBottom: "1px solid rgba(93,201,74,0.1)",
      padding: "6rem 3rem",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
            letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a",
          }}>
            How It Works
          </span>
          <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
        </div>
        <h2 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(2.2rem, 4vw, 4rem)",
          lineHeight: 0.95, color: "#ede9dc", letterSpacing: "0.02em",
        }}>
          TWO SIDES.{" "}
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(237,233,220,0.22)" }}>
            ONE MARKETPLACE.
          </span>
        </h2>
      </div>

      {/* Two columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "4rem",
      }}>
        {/* Buyers */}
        <div>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
            letterSpacing: "0.2em", textTransform: "uppercase", color: "#5dc94a",
            borderLeft: "2px solid #3a8a2c", paddingLeft: "0.75rem",
            marginBottom: "2rem",
          }}>
            For Buyers (Streamers &amp; Creators)
          </div>
          {steps.map((step) => (
            <div key={step.n} style={{
              display: "flex", gap: "1.5rem",
              padding: "1.75rem 0",
              borderBottom: "1px solid rgba(237,233,220,0.07)",
            }}>
              <div style={{
                fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem",
                lineHeight: 1, color: "#3a8a2c", opacity: 0.4,
                flexShrink: 0, width: "2.5rem", textAlign: "center",
              }}>
                {step.n}
              </div>
              <div>
                <div style={{
                  fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem",
                  letterSpacing: "0.04em", color: "#ede9dc", marginBottom: "0.4rem",
                }}>
                  {step.title}
                </div>
                <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "#6b7a62", fontWeight: 300 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sellers */}
        <div>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
            letterSpacing: "0.2em", textTransform: "uppercase", color: "#5dc94a",
            borderLeft: "2px solid #3a8a2c", paddingLeft: "0.75rem",
            marginBottom: "2rem",
          }}>
            For Sellers (Freelancers &amp; Creators)
          </div>
          {sellerSteps.map((step) => (
            <div key={step.n} style={{
              display: "flex", gap: "1.5rem",
              padding: "1.75rem 0",
              borderBottom: "1px solid rgba(237,233,220,0.07)",
            }}>
              <div style={{
                fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem",
                lineHeight: 1, color: "#3a8a2c", opacity: 0.4,
                flexShrink: 0, width: "2.5rem", textAlign: "center",
              }}>
                {step.n}
              </div>
              <div>
                <div style={{
                  fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem",
                  letterSpacing: "0.04em", color: "#ede9dc", marginBottom: "0.4rem",
                }}>
                  {step.title}
                </div>
                <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "#6b7a62", fontWeight: 300 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}