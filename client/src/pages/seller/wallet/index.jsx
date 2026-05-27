import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStateProvider } from "../../../context/StateContext";
import {
  GET_SELLER_WALLET_ROUTE,
  ADD_BANK_DETAILS_ROUTE,
  WITHDRAW_AMOUNT_ROUTE,
} from "../../../utils/constants";

function Wallet() {
  const [{ userInfo }] = useStateProvider();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // UPI modal
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiError, setUpiError] = useState("");

  // Withdraw modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    if (!userInfo) return;
    fetchWallet();
  }, [userInfo]);

  const fetchWallet = () => {
    setLoading(true);
    axios
      .get(GET_SELLER_WALLET_ROUTE, { withCredentials: true })
      .then((res) => setWallet(res.data.wallet))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAddUpi = async () => {
    if (!upiId || !upiId.includes("@")) {
      setUpiError("Enter a valid UPI ID (e.g. name@upi)");
      return;
    }
    setUpiLoading(true);
    setUpiError("");
    try {
      const res = await axios.post(
        ADD_BANK_DETAILS_ROUTE,
        { upiId },
        { withCredentials: true }
      );
      setWallet(res.data.wallet);
      setShowUpiModal(false);
      setUpiId("");
    } catch (e) {
      setUpiError(e?.response?.data?.error || "Failed to save UPI ID");
    } finally {
      setUpiLoading(false);
    }
  };

  const handleWithdraw = async () => {
    console.log("withdraw hit", withdrawAmount, wallet?.razorpayFundAccountId, wallet?.balance);
    const amount = parseInt(withdrawAmount);
    if (!amount || amount < 1) {
      setWithdrawError("Enter a valid amount");
      return;
    }
    if (amount > wallet?.balance) {
      setWithdrawError("Insufficient balance");
      return;
    }
    if (!wallet?.razorpayFundAccountId) {
      setWithdrawError("Please link your UPI ID first");
      return;
    }
    setWithdrawLoading(true);
    setWithdrawError("");
    try {
      await axios.post(
        WITHDRAW_AMOUNT_ROUTE,
        { amount },
        { withCredentials: true }
      );
      setWithdrawSuccess(true);
      setWithdrawAmount("");
      fetchWallet();
    } catch (e) {
      setWithdrawError(e?.response?.data?.error || "Withdrawal failed");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawSuccess(false);
    setWithdrawError("");
    setWithdrawAmount("");
  };

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

        {loading ? (
          <div style={{ color: "#5dc94a", fontFamily: "Space Mono, monospace", fontSize: "0.75rem" }}>Loading...</div>
        ) : (
          <>
            {/* Balance card */}
            <div style={{ background: "#0f1014", border: "1px solid rgba(93,201,74,0.15)", padding: "2.5rem" }}>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.75rem" }}>
                Available Balance
              </p>
              <p style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "3.5rem", letterSpacing: "0.04em", color: "#5dc94a", lineHeight: 1, margin: 0 }}>
                ₹{wallet?.balance || 0}
              </p>

              {/* Withdraw button */}
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={!wallet?.balance || wallet?.balance < 1}
                style={{
                  marginTop: "1.75rem",
                  background: wallet?.balance > 0 ? "#5dc94a" : "transparent",
                  border: wallet?.balance > 0 ? "none" : "1px solid #2a3a28",
                  color: wallet?.balance > 0 ? "#09090b" : "#3d4438",
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.65rem 1.75rem",
                  cursor: wallet?.balance > 0 ? "pointer" : "not-allowed",
                  transition: "opacity 0.15s",
                }}
              >
                Withdraw Funds
              </button>
            </div>

            {/* Total earned */}
            {wallet?.totalEarned > 0 && (
              <div style={{ background: "#0f1014", border: "1px solid rgba(93,201,74,0.1)", borderTop: "none", padding: "1.5rem 2.5rem" }}>
                <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.5rem" }}>
                  Total Earned
                </p>
                <p style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#ede9dc", lineHeight: 1, margin: 0 }}>
                  ₹{wallet?.totalEarned || 0}
                </p>
              </div>
            )}

            {/* UPI section */}
            <div style={{ marginTop: "1px", background: "#0f1014", border: "1px solid rgba(93,201,74,0.1)", padding: "1.5rem 2.5rem" }}>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "1rem" }}>
                UPI Details
              </p>
              {wallet?.razorpayFundAccountId ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "#5dc94a", fontSize: "0.9rem" }}>✓</span>
                    <div>
                      <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.72rem", color: "#5dc94a", margin: 0 }}>
                        UPI linked
                      </p>
                      <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", color: "#3d4438", margin: "2px 0 0" }}>
                        {wallet.razorpayFundAccountId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpiModal(true)}
                    style={{ background: "none", border: "none", color: "#5dc94a", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.7rem", color: "#6b7a62", margin: 0 }}>
                    No UPI ID linked
                  </p>
                  <button
                    onClick={() => setShowUpiModal(true)}
                    style={{ background: "#5dc94a", border: "none", color: "#09090b", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.4rem 1rem", cursor: "pointer" }}
                  >
                    Add UPI
                  </button>
                </div>
              )}
            </div>

            {/* 20% platform cut info */}
            <div style={{ marginTop: "1px", background: "#0f1014", border: "1px solid rgba(93,201,74,0.08)", borderLeft: "3px solid #5dc94a", padding: "1.25rem 2rem" }}>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5dc94a", marginBottom: "0.6rem" }}>
                Platform Fee
              </p>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.68rem", color: "#6b7a62", lineHeight: 1.7, margin: 0 }}>
                Knell takes a <span style={{ color: "#ede9dc" }}>20% platform fee</span> on every completed order.
                Your wallet balance already reflects your earnings after this deduction —
                so what you see is what you get.
              </p>
            </div>

            {/* How it works */}
            <div style={{ marginTop: "1px", background: "#0f1014", border: "1px solid rgba(93,201,74,0.08)", padding: "1.25rem 2rem" }}>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.6rem" }}>
                How Withdrawals Work
              </p>
              <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", color: "#3d4438", lineHeight: 1.8, margin: 0 }}>
                1. Link your UPI ID above<br />
                2. Request a withdrawal<br />
                3. We process it manually within 2–3 business days<br />
                4. Money lands directly in your UPI-linked account
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── UPI Modal ── */}
      {showUpiModal && (
        <div style={overlayStyle} onClick={() => setShowUpiModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <p style={modalTitleStyle}>Link UPI ID</p>
            <p style={modalSubStyle}>Enter your UPI ID to receive withdrawals directly.</p>
            <label style={labelStyle}>UPI ID</label>
            <input
              style={inputStyle}
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              autoCapitalize="none"
            />
            {upiError && <p style={errorStyle}>{upiError}</p>}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button style={cancelBtnStyle} onClick={() => { setShowUpiModal(false); setUpiError(""); setUpiId(""); }}>
                Cancel
              </button>
              <button style={confirmBtnStyle} onClick={handleAddUpi} disabled={upiLoading}>
                {upiLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Withdraw Modal ── */}
      {showWithdrawModal && (
        <div style={overlayStyle} onClick={closeWithdrawModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {withdrawSuccess ? (
              <>
                <p style={{ ...modalTitleStyle, color: "#5dc94a" }}>Request Received ✓</p>
                <p style={modalSubStyle}>
                  Your withdrawal request has been submitted. We'll process it within 2–3 business days and send the money to your linked UPI.
                </p>
                <button style={{ ...confirmBtnStyle, width: "100%", marginTop: "1rem" }} onClick={closeWithdrawModal}>
                  Done
                </button>
              </>
            ) : (
              <>
                <p style={modalTitleStyle}>Withdraw Funds</p>
                <p style={modalSubStyle}>Available: <span style={{ color: "#5dc94a" }}>₹{wallet?.balance || 0}</span></p>

                {/* 20% fee reminder in modal */}
                <div style={{ background: "rgba(93,201,74,0.06)", border: "1px solid rgba(93,201,74,0.15)", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
                  <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", color: "#6b7a62", margin: 0, lineHeight: 1.6 }}>
                    Your balance is already net of Knell's <span style={{ color: "#ede9dc" }}>20% platform fee</span>. This is your final payout amount.
                  </p>
                </div>

                <label style={labelStyle}>Amount (₹)</label>
                <input
                  style={inputStyle}
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  type="number"
                />
                {withdrawError && <p style={errorStyle}>{withdrawError}</p>}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                  <button style={cancelBtnStyle} onClick={closeWithdrawModal}>Cancel</button>
                  <button style={confirmBtnStyle} onClick={handleWithdraw} disabled={withdrawLoading}>
                    {withdrawLoading ? "Processing..." : "Withdraw"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared modal styles ──
const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
  display: "flex", alignItems: "flex-end", justifyContent: "center",
  zIndex: 1000,
};
const modalStyle = {
  background: "#0f1014", border: "1px solid rgba(93,201,74,0.15)",
  padding: "2rem", width: "100%", maxWidth: 600,
};
const modalTitleStyle = {
  fontFamily: "Bebas Neue, sans-serif", fontSize: "1.75rem",
  letterSpacing: "0.04em", color: "#ede9dc", margin: "0 0 0.25rem",
};
const modalSubStyle = {
  fontFamily: "Space Mono, monospace", fontSize: "0.65rem",
  color: "#6b7a62", marginBottom: "1.25rem", lineHeight: 1.6,
};
const labelStyle = {
  fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
  letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7a62",
  display: "block", marginBottom: "0.4rem",
};
const inputStyle = {
  width: "100%", background: "#09090b", border: "1px solid rgba(93,201,74,0.2)",
  color: "#ede9dc", fontFamily: "Space Mono, monospace", fontSize: "0.8rem",
  padding: "0.75rem 1rem", boxSizing: "border-box", outline: "none",
};
const errorStyle = {
  fontFamily: "Space Mono, monospace", fontSize: "0.62rem",
  color: "#e05c5c", marginTop: "0.5rem",
};
const cancelBtnStyle = {
  flex: 1, background: "transparent", border: "1px solid #2a3a28",
  color: "#6b7a62", fontFamily: "Space Mono, monospace", fontSize: "0.65rem",
  letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem",
  cursor: "pointer",
};
const confirmBtnStyle = {
  flex: 1, background: "#5dc94a", border: "none",
  color: "#09090b", fontFamily: "Space Mono, monospace", fontSize: "0.65rem",
  letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.65rem",
  cursor: "pointer", fontWeight: "700",
};

export default Wallet;