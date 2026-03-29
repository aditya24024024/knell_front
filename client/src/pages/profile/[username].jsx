import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { GET_USER_PUBLIC_PROFILE } from "../../utils/constants";
import SearchGridItem from "../../components/search/SearchGridItem";
import { useStateProvider } from "../../context/StateContext";
import { optimizeImage } from "../../utils/cloudinary";

const getLinkIcon = (url) => {
  if (url.includes('instagram')) return '📸';
  if (url.includes('twitter') || url.includes('x.com')) return '🐦';
  if (url.includes('linkedin')) return '💼';
  if (url.includes('github')) return '💻';
  if (url.includes('youtube')) return '▶️';
  return '🔗';
};

const getLinkLabel = (url) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
};

const PublicProfile = () => {
  const router = useRouter();
  const { username } = router.query;
  const [{ userInfo }] = useStateProvider();
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    if (!username) return;
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${GET_USER_PUBLIC_PROFILE}/${username}`);
        setUser(data.user);
        setGigs(data.gigs);
      } catch (err) {}
    };
    fetchUserProfile();
  }, [username]);

  if (!user) return (
    <div style={{ background: "#09090b", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 32, height: 32,
        border: "3px solid rgba(93,201,74,0.2)",
        borderTop: "3px solid #5dc94a",
        borderRadius: "50%",
        animation: "knell-spin 0.8s linear infinite",
      }} />
      <style jsx global>{`@keyframes knell-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const isOwnProfile = userInfo?.id === user?.id;

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 3rem" }}>

        {/* Profile header */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", marginBottom: "4rem",
          padding: "3rem 2rem",
          border: "1px solid rgba(93,201,74,0.12)",
          background: "#0f1014",
          position: "relative",
        }}>
          {/* Avatar */}
          <div style={{ marginBottom: "1.25rem" }}>
            {user.profileImage ? (
              <Image
                src={optimizeImage(user.profileImage, 'sm')}
                width={100} height={100}
                style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(93,201,74,0.3)" }}
                alt="Profile"
              />
            ) : (
              <div style={{
                background: "#3a8a2c", width: 100, height: 100,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(93,201,74,0.3)",
              }}>
                <span style={{ color: "#ede9dc", fontSize: "2.5rem", fontWeight: 700 }}>
                  {user.email[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name & username */}
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#ede9dc", letterSpacing: "0.04em", marginBottom: "0.25rem" }}>
            {user.fullName}
          </h2>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#5dc94a", marginBottom: "1rem" }}>
            @{user.username}
          </span>

          {/* Verified badge */}
          {user.isSocialLogin && (
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#5dc94a", border: "1px solid rgba(93,201,74,0.25)", padding: "0.25rem 0.75rem", marginBottom: "1rem" }}>
              ✓ Verified Seller
            </div>
          )}

          {/* Description */}
          {user.description && (
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 500, marginBottom: "1.25rem", fontWeight: 300 }}>
              {user.description}
            </p>
          )}

          {/* Social links */}
          {user.links?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {user.links.map((link, i) => (
                <a
                  key={i} href={link} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.35rem 0.85rem",
                    border: "1px solid rgba(93,201,74,0.2)",
                    color: "#6b7a62", textDecoration: "none", fontSize: "0.75rem",
                    fontFamily: "Space Mono, monospace", letterSpacing: "0.08em",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5dc94a"; e.currentTarget.style.color = "#5dc94a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.2)"; e.currentTarget.style.color = "#6b7a62"; }}
                >
                  <span>{getLinkIcon(link)}</span>
                  <span>{getLinkLabel(link)}</span>
                </a>
              ))}
            </div>
          )}

          {/* Own profile actions */}
          {isOwnProfile && (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => router.push("/profile/set")}
                style={{
                  fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", background: "#3a8a2c", color: "#ede9dc",
                  border: "none", padding: "0.65rem 1.5rem", cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push("/logout")}
                style={{
                  fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", background: "transparent", color: "#5dc94a",
                  border: "1px solid rgba(93,201,74,0.3)", padding: "0.65rem 1.5rem",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5dc94a"; e.currentTarget.style.background = "rgba(93,201,74,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.3)"; e.currentTarget.style.background = "transparent"; }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Gigs section */}
        {gigs.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a" }}>
                Gigs by {user.username}
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(93,201,74,0.15)" }} />
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.5rem",
background: "transparent",
border: "none",
            }}>
              {gigs.map((gig) => (
                <SearchGridItem key={gig.id} gig={gig} />
              ))}
            </div>
          </div>
        )}

        {gigs.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", border: "1px solid rgba(93,201,74,0.1)", color: "#3d4438", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
            No gigs listed yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;