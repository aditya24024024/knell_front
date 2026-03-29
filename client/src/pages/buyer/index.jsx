import { useStateProvider } from "../../context/StateContext";
import { useRouter } from "next/router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GET_BUYER_ORDERS_ROUTE, GET_UNREAD_MESSAGES } from "../../utils/constants";

const DashboardCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "#0f1014",
      border: "1px solid rgba(93,201,74,0.12)",
      padding: "1.75rem",
      cursor: onClick ? "pointer" : "default",
      transition: "background 0.2s, border-color 0.2s",
      display: "flex", flexDirection: "column", gap: "0.5rem",
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.background = "#15171c";
        e.currentTarget.style.borderColor = "rgba(93,201,74,0.3)";
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#0f1014";
      e.currentTarget.style.borderColor = "rgba(93,201,74,0.12)";
    }}
  >
    <h2 style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62" }}>
      {label}
    </h2>
    <h3 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2.5rem", letterSpacing: "0.04em", color: "#5dc94a", lineHeight: 1 }}>
      {value ?? "—"}
    </h3>
  </div>
);

function BuyerDashboard() {
  const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const [ordersCount, setOrdersCount] = useState(null);
  const [unreadCount, setUnreadCount] = useState(null);

  useEffect(() => {
    if (!userInfo) return;
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, unreadRes] = await Promise.all([
          axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true }),
          axios.get(GET_UNREAD_MESSAGES, { withCredentials: true }),
        ]);
        setOrdersCount(ordersRes.data.orders?.length || 0);
        setUnreadCount(unreadRes.data.unreadCount || 0);
      } catch (err) {}
    };
    fetchDashboardData();
  }, [userInfo]);

  if (!userInfo) return null;

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", padding: "7rem 3rem 4rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a" }}>
              Buyer Dashboard
            </span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1 }}>
            Welcome back, <span style={{ color: "#5dc94a" }}>{userInfo.fullName || userInfo.username}</span>
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* Profile card */}
          <div style={{
            background: "#0f1014", border: "1px solid rgba(93,201,74,0.12)",
            padding: "2rem", minWidth: 280, width: 300, flexShrink: 0,
            display: "flex", flexDirection: "column", gap: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {userInfo?.imageName ? (
                <Image src={userInfo.imageName} alt="Profile" width={72} height={72} style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(93,201,74,0.3)" }} />
              ) : (
                <div style={{ background: "#3a8a2c", width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(93,201,74,0.3)", flexShrink: 0 }}>
                  <span style={{ color: "#ede9dc", fontSize: "1.75rem", fontWeight: 700 }}>{userInfo.email?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div>
                <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.68rem", letterSpacing: "0.1em", color: "#5dc94a", marginBottom: "0.2rem" }}>
                  @{userInfo.username}
                </div>
                <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", letterSpacing: "0.04em", color: "#ede9dc" }}>
                  {userInfo.fullName}
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(93,201,74,0.1)", paddingTop: "1rem", color: "#6b7a62", fontSize: "0.82rem", lineHeight: 1.7, fontWeight: 300 }}>
              {userInfo.description || "No description provided."}
            </div>
            <button
              onClick={() => router.push("/profile/" + userInfo.username)}
              style={{ background: "transparent", color: "#5dc94a", border: "1px solid rgba(93,201,74,0.25)", padding: "0.6rem", fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(93,201,74,0.08)"; e.currentTarget.style.borderColor = "#5dc94a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(93,201,74,0.25)"; }}
            >
              View Profile
            </button>
          </div>

          {/* Stats grid */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, background: "rgba(93,201,74,0.08)", border: "1px solid rgba(93,201,74,0.1)", alignContent: "start" }}>
            <DashboardCard label="Your Orders" value={ordersCount} onClick={() => router.push("/buyer/orders")} />
            <DashboardCard label="Unread Messages" value={unreadCount} onClick={() => router.push("/buyer/unread-messages")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;