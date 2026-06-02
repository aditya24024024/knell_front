import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useStateProvider } from "../../context/StateContext";
import { ADD_MESSAGE, GET_MESSAGES, GET_OR_CREATE_INQUIRY, HOST } from "../../utils/constants";
import { FiSend, FiX, FiMinus, FiMaximize2, FiMessageCircle } from "react-icons/fi";
import Image from "next/image";
import { optimizeImage } from "../../utils/cloudinary";

let socket;

const S = {
  bubble: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    zIndex: 1000,
  },
  openBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    background: "#3a8a2c",
    color: "#ede9dc",
    border: "none",
    padding: "0.75rem 1.25rem",
    cursor: "pointer",
    fontFamily: "Space Mono, monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "background 0.2s",
    width: "100%",
    marginTop: "0.75rem",
    justifyContent: "center",
  },
};

const formatTime = (ts) => {
  const d = new Date(ts);
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m < 10 ? "0" + m : m} ${ampm}`;
};

const ChatWidget = ({ gigData }) => {
  const [{ userInfo }] = useStateProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const messagesEndRef = useRef(null);
  const lastSentRef = useRef(0);
  const seller = gigData?.createdBy;

  // Socket setup
  useEffect(() => {
    if (!userInfo?.id) return;
    socket = io(HOST, { withCredentials: true });
    socket.emit("join", userInfo.id);
    return () => socket?.disconnect();
  }, [userInfo]);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !orderId) return;
    const handler = (msg) => {
      if (msg.orderId === orderId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [orderId]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  const openChat = async () => {
    if (!userInfo) return;
    if (orderId) { setIsOpen(true); setIsMinimized(false); return; }
    setLoading(true);
    try {
      const { data } = await axios.get(`${GET_OR_CREATE_INQUIRY}/${gigData.id}`, { withCredentials: true });
      setOrderId(data.orderId);
      setRecipientId(data.sellerId);

      const msgRes = await axios.get(`${GET_MESSAGES}/${data.orderId}`, { withCredentials: true });
      setMessages(msgRes.data.messages);
      setIsPending(msgRes.data.isPending);
      setIsOpen(true);
      setIsMinimized(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || !orderId || !recipientId) return;
    const now = Date.now();
    if (now - lastSentRef.current < 2000) return;
    lastSentRef.current = now;
    try {
      const { data, status } = await axios.post(
        `${ADD_MESSAGE}/${orderId}`,
        { message: trimmed, recipentId: recipientId },
        { withCredentials: true }
      );
      if (status === 201) {
        setMessages((prev) => [...prev, data.message]);
        setText("");
      }
    } catch (err) {
      if (err.response?.data?.error === "MESSAGE_LIMIT_REACHED") {
        alert("Message limit reached for this inquiry. Place an order to continue chatting.");
      }
      lastSentRef.current = 0;
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Not logged in
  if (!userInfo) return null;

  // Owner can't message themselves
  if (gigData?.userId === userInfo?.id) return null;

  const initials = seller?.fullName?.[0]?.toUpperCase() || seller?.email?.[0]?.toUpperCase() || "S";

  return (
    <>
      {/* Trigger button — lives inside Pricing card, rendered separately */}
      <button
        onClick={openChat}
        disabled={loading}
        style={{
          ...S.openBtn,
          background: loading ? "#2a2d35" : "#1a3a28",
          color: loading ? "#6b7a62" : "#5dc94a",
          border: "1px solid rgba(93,201,74,0.25)",
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#243d2e"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1a3a28"; }}
      >
        <FiMessageCircle style={{ fontSize: "1rem" }} />
        {loading ? "Opening..." : `Message ${seller?.fullName?.split(" ")[0] || "Seller"}`}
      </button>

      {/* Floating widget */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: 340,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(93,201,74,0.2)",
          background: "#0f1014",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(93,201,74,0.1)",
            background: "#0a0c0f",
          }}>
            {seller?.profileImage ? (
              <img
                src={optimizeImage(seller.profileImage, "sm")}
                alt={seller.fullName}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#3a8a2c", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "0.8rem", color: "#ede9dc", fontWeight: 700,
              }}>{initials}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ede9dc", fontFamily: "Space Mono, monospace", letterSpacing: "0.05em" }}>
                {seller?.fullName}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#5dc94a", fontFamily: "Space Mono, monospace", letterSpacing: "0.08em" }}>
                ● ONLINE
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={() => setIsMinimized((p) => !p)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a62", padding: "4px", display: "flex", alignItems: "center" }}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <FiMaximize2 size={14} /> : <FiMinus size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a62", padding: "4px", display: "flex", alignItems: "center" }}
                title="Close"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Inquiry notice */}
              <div style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.65rem",
                fontFamily: "Space Mono, monospace",
                color: "#6b7a62",
                borderBottom: "1px solid rgba(93,201,74,0.06)",
                background: "#0a0c0f",
                letterSpacing: "0.06em",
              }}>
                PRE-ORDER INQUIRY · {gigData.title}
              </div>

              {/* Messages */}
              <div style={{
                height: 280,
                overflowY: "auto",
                padding: "0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                background: "#09090b",
              }}>
                {messages.length === 0 && (
                  <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: "#6b7a62", fontSize: "0.75rem",
                    fontFamily: "Space Mono, monospace", letterSpacing: "0.08em",
                    textAlign: "center", gap: "0.5rem", paddingTop: "2rem",
                  }}>
                    <FiMessageCircle size={24} style={{ color: "#3a8a2c" }} />
                    <span>Ask {seller?.fullName?.split(" ")[0]} anything<br />about this gig</span>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMine = msg.senderId === userInfo.id;
                  return (
                    <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "75%",
                        padding: "0.5rem 0.75rem",
                        background: isMine ? "#3a8a2c" : "#1a1d24",
                        color: isMine ? "#ede9dc" : "#9ca3af",
                        fontSize: "0.8rem",
                        lineHeight: 1.5,
                        borderRadius: isMine ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        border: isMine ? "none" : "1px solid rgba(93,201,74,0.08)",
                      }}>
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <div style={{ fontSize: "0.6rem", color: isMine ? "rgba(237,233,220,0.5)" : "#4b5563", marginTop: "0.25rem", textAlign: "right" }}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 0.75rem",
                borderTop: "1px solid rgba(93,201,74,0.1)",
                background: "#0a0c0f",
              }}>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    background: "#13161c",
                    border: "1px solid rgba(93,201,74,0.12)",
                    color: "#ede9dc",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.78rem",
                    outline: "none",
                    borderRadius: 0,
                    fontFamily: "inherit",
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    background: "#3a8a2c",
                    border: "none",
                    color: "#ede9dc",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#4ea83d"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#3a8a2c"}
                >
                  <FiSend size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;