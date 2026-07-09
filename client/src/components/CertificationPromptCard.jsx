import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// context: "create" | "edit" | "view" — lets you tweak copy/analytics per screen if needed later
const CertificationPromptCard = ({ context = "create", dismissKey = "knell_cert_prompt_dismissed" }) => {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(true); // default true to avoid flash before localStorage check

  useEffect(() => {
    const isDismissed = localStorage.getItem(dismissKey) === "true";
    setDismissed(isDismissed);
  }, [dismissKey]);

  const handleClick = () => {
    // fire and forget analytics — replace with your actual tracking call
    try {
      if (window?.analytics?.track) {
        window.analytics.track("certification_banner_clicked", { context });
      }
    } catch (e) {
      // analytics failing should never block navigation
    }
    router.push('/learn');
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    localStorage.setItem(dismissKey, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        border: "1px solid rgba(93,201,74,0.3)",
        background: "linear-gradient(90deg, rgba(93,201,74,0.08), rgba(93,201,74,0.02))",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(93,201,74,0.55)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(93,201,74,0.3)")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <span style={{ fontSize: "1.4rem" }}>🎓</span>
        <div>
          <p style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.68rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#5dc94a", marginBottom: "0.25rem",
          }}>
            Get Certified
          </p>
          <p style={{ color: "#9ca3af", fontSize: "0.82rem", lineHeight: 1.5 }}>
            Certified sellers stand out and get hired more often. Browse courses on Knell Learn.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
        <span style={{
          background: "#3a8a2c", color: "#ede9dc", border: "none",
          padding: "0.6rem 1.1rem", fontFamily: "Space Mono, monospace",
          fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          Explore Courses
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            color: "#6b7a62", background: "none", border: "none",
            cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.25rem",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CertificationPromptCard;