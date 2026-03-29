import { useStateProvider } from '../../context/StateContext';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { FiClock } from 'react-icons/fi';
import { BiRightArrowAlt } from 'react-icons/bi';
import { CREATE_ORDER } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { reducerCases } from '../../context/constants';

const Pricing = () => {
  const [{ gigData, userInfo, showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const router = useRouter();
  const [requestSent, setRequestSent] = useState(false);

  const handleSignup = () => {
    if (showLoginModal) dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
  };

  const handleLogin = () => {
    if (showSignupModal) dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
  };

  const handleRequest = async () => {
    if (!userInfo?.isSocialLogin) {
      toast.error("⚠️ You are not verified! Please complete verification in your profile.");
      setTimeout(() => router.push("/profile"), 1500);
      return;
    }
    try {
      const { data } = await axios.post(CREATE_ORDER, { gigid: gigData.id }, { withCredentials: true });
      if (!window.Razorpay) { toast.error("Razorpay SDK not loaded"); return; }
      const options = {
        key: data.key, amount: data.amount, currency: data.currency,
        name: "Knell", description: "Paid Service Request", order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(CREATE_ORDER, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }, { withCredentials: true });
            toast.success("✅ Paid request sent successfully!");
            router.push("/buyer/orders");
          } catch (err) { toast.error("Payment verification failed"); }
        },
        prefill: { name: userInfo.fullName, email: userInfo.email },
        theme: { color: "#3a8a2c" },
        modal: { ondismiss: () => toast.info("Payment cancelled") },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Order creation failed. Please try again.");
    }
  };

  if (!gigData) return null;

  const currencySymbol = gigData.currency?.symbol || '₹';
  const isOwner = gigData.userId === userInfo?.id;

  return (
    <div style={{ position: "sticky", top: "6rem", marginBottom: "2.5rem", height: "fit-content" }}>
      <div style={{
        border: "1px solid rgba(93,201,74,0.15)",
        background: "#0f1014",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(93,201,74,0.1)", paddingBottom: "1rem" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", maxWidth: "60%", lineHeight: 1.5 }}>
            {gigData.shortDesc}
          </p>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#ede9dc", lineHeight: 1 }}>
              {currencySymbol}{gigData.price}
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7a62", fontSize: "0.82rem" }}>
          <FiClock style={{ color: "#5dc94a" }} />
          <span style={{ fontFamily: "Space Mono, monospace", letterSpacing: "0.08em" }}>
            {gigData.deliveryTime} Days Delivery
          </span>
        </div>

        {/* Features */}
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", listStyle: "none" }}>
          {(gigData.features || []).map((feature, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <BsCheckLg style={{ color: "#5dc94a", flexShrink: 0 }} />
              <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isOwner ? (
          <button
            onClick={() => router.push(`/seller/gigs/${gigData.id}`)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "#3a8a2c", color: "#ede9dc", border: "none",
              padding: "0.85rem", cursor: "pointer", fontFamily: "Space Mono, monospace",
              fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase",
              transition: "background 0.2s", width: "100%",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
          >
            Edit Gig <BiRightArrowAlt style={{ fontSize: "1.2rem", marginLeft: "0.5rem" }} />
          </button>
        ) : (
          <button
            onClick={handleRequest}
            disabled={requestSent}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              background: requestSent ? "#2a2d35" : "#3a8a2c",
              color: requestSent ? "#6b7a62" : "#ede9dc",
              border: "none", padding: "0.85rem", cursor: requestSent ? "not-allowed" : "pointer",
              fontFamily: "Space Mono, monospace", fontSize: "0.72rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              transition: "background 0.2s", width: "100%",
            }}
            onMouseEnter={(e) => { if (!requestSent) e.currentTarget.style.background = "#4ea83d"; }}
            onMouseLeave={(e) => { if (!requestSent) e.currentTarget.style.background = "#3a8a2c"; }}
          >
            {requestSent ? "Request Sent" : userInfo?.isSocialLogin ? "Request Service" : "Verify to Request"}
            <BiRightArrowAlt style={{ fontSize: "1.2rem", marginLeft: "0.5rem" }} />
          </button>
        )}

        {/* Not logged in nudge */}
        {!userInfo && (
          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#6b7a62" }}>
            <button onClick={handleLogin} style={{ color: "#5dc94a", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Log in</button>
            {" "}or{" "}
            <button onClick={handleSignup} style={{ color: "#5dc94a", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>sign up</button>
            {" "}to request this service
          </p>
        )}
      </div>
    </div>
  );
};

export default Pricing;