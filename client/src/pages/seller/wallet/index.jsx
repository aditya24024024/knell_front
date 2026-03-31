import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_WALLET_ROUTE } from "../../../utils/constants";

function Wallet() {
  const [{ userInfo }] = useStateProvider();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (!userInfo) return;
    axios
      .get(GET_SELLER_WALLET_ROUTE, { withCredentials: true })
      .then((res) => setWallet(res.data.wallet))
      .catch(console.error);
  }, [userInfo]);

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", padding: "7rem 3rem 4rem" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a" }}>
              Seller
            </span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1 }}>
            Wallet
          </h1>
        </div>

        {/* Balance card */}
        <div style={{ background: "#0f1014", border: "1px solid rgba(93,201,74,0.15)", padding: "2.5rem" }}>
          <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.75rem" }}>
            Available Balance
          </p>
          <p style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "3.5rem", letterSpacing: "0.04em", color: "#5dc94a", lineHeight: 1 }}>
            ₹{wallet?.balance || 0}
          </p>
          <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.1em", color: "#3d4438", marginTop: "1.5rem" }}>
            To withdraw your earnings, please use the Knell mobile app.
          </p>
        </div>

        {/* Total earned */}
        {wallet?.totalEarned > 0 && (
          <div style={{ background: "#0f1014", border: "1px solid rgba(93,201,74,0.1)", padding: "1.5rem 2.5rem", marginTop: 1 }}>
            <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.5rem" }}>
              Total Earned
            </p>
            <p style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#ede9dc", lineHeight: 1 }}>
              ₹{wallet?.totalEarned || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;