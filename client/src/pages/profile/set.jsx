import { reducerCases } from '../../context/constants';
import { useStateProvider } from '../../context/StateContext';
import { GET_USER_INFO, SET_USER_IMAGE, SET_USER_INFO } from '../../utils/constants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const inputStyle = {
  display: "block", width: "100%", padding: "0.85rem 1rem",
  background: "#15171c", border: "1px solid rgba(93,201,74,0.2)",
  color: "#dbd7ca", fontFamily: "Inter, sans-serif", fontSize: "0.88rem",
  outline: "none",
};

const labelStyle = {
  display: "block", marginBottom: "0.5rem",
  fontFamily: "Space Mono, monospace", fontSize: "0.62rem",
  letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62",
};

const MEET_LINK = "https://meet.google.com/xiy-zezv-hhw";

const Profile = () => {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showVerificationTab, setShowVerificationTab] = useState(false);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [data, setData] = useState({
    username: "", fullName: "", description: "", mobile: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await axios.post(GET_USER_INFO, {}, { withCredentials: true });
        dispatch({ type: reducerCases.SET_USER, userInfo: { ...user, image: user.image } });
        setData({
          username: user?.username || "",
          description: user?.description || "",
          fullName: user?.fullName || "",
          mobile: user?.mobile || "",
        });
        if (user?.image) setPreview(user.image);
        if (user?.links?.length) setLinks(user.links);
        setIsLoaded(true);
      } catch (err) {}
    };
    fetchUserInfo();
  }, [dispatch]);

  const addLink = () => {
    const trimmed = newLink.trim();
    if (!trimmed) return;
    if (links.length >= 5) { toast.warn("You can add up to 5 links."); return; }
    const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    setLinks([...links, url]);
    setNewLink("");
  };

  const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

  const getLinkLabel = (url) => {
    try { return new URL(url).hostname.replace('www.', ''); }
    catch { return url; }
  };

  const setProfile = async () => {
    try {
      if (!data.fullName?.trim()) { setErrorMessage("Full name is required"); return; }
      if (!data.username?.trim()) { setErrorMessage("Username is required"); return; }
      if (!data.mobile || data.mobile.trim().length < 10) { setErrorMessage("Please enter a valid 10-digit mobile number"); return; }
      if (!data.description?.trim()) { setErrorMessage("Please add a description"); return; }
      setErrorMessage("");

      const response = await axios.post(SET_USER_INFO, { ...data, links }, { withCredentials: true });
      if (response?.data?.usernameError) { setErrorMessage("Enter a unique username"); return; }
      if (response?.data?.emptyFieldError) { setErrorMessage("Please enter all required fields"); return; }

      let imageName = "";
      if (image) {
        const formData = new FormData();
        formData.append("images", image);
        const { data: { img } } = await axios.post(SET_USER_IMAGE, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
        imageName = img;
      }

      dispatch({ type: reducerCases.SET_USER, userInfo: { ...userInfo, ...data, links, image: imageName || userInfo?.image || false } });
      toast.success("Profile updated successfully");
      setTimeout(() => { router.push("/"); setTimeout(() => window.location.reload(), 1000); }, 1000);
    } catch (err) {
      toast.error("Some error occurred");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (file && validImageTypes.includes(file.type)) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <>
      {isLoaded && (
        <div style={{ background: "#09090b", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "8rem 1.5rem 4rem", gap: "1.5rem" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", border: "1px solid rgba(93,201,74,0.25)", padding: "0.35rem 0.9rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5dc94a" }}>
                Your Profile
              </span>
            </div>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1, marginBottom: "0.5rem" }}>
              SET UP YOUR PROFILE
            </h2>
            <p style={{ color: "#6b7a62", fontSize: "0.85rem", fontWeight: 300 }}>
              Complete your profile to start hiring or selling on Knell
            </p>
          </div>

          {/* Verification status */}
          {userInfo?.isSocialLogin ? (
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#5dc94a", border: "1px solid rgba(93,201,74,0.25)", padding: "0.4rem 1rem" }}>
              ✓ Verified Account
            </div>
          ) : (
            <div style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#e8b84b", border: "1px solid rgba(232,184,75,0.25)", padding: "0.4rem 1rem" }}>
              ⚠ Account not yet verified
            </div>
          )}

          {errorMessage && (
            <div style={{ color: "#ef4444", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", border: "1px solid rgba(239,68,68,0.25)", padding: "0.4rem 1rem" }}>
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%", maxWidth: 520 }}>

            {/* Profile picture */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <span style={labelStyle}>Profile Picture</span>
              <div
                style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(93,201,74,0.3)", cursor: "pointer" }}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              >
                {preview ? (
                  <Image src={preview} alt="profile" fill style={{ objectFit: "cover", borderRadius: "50%" }} />
                ) : (
                  <div style={{ background: "#3a8a2c", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#ede9dc", fontSize: "2.5rem", fontWeight: 700 }}>{userInfo?.email?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", opacity: imageHover ? 1 : 0, transition: "opacity 0.2s" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, color: "white", position: "absolute" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <input type="file" onChange={handleFile} style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer" }} multiple={false} name="profileImage" />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="text" name="fullName" value={data.fullName} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
            </div>

            {/* Username */}
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Username <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="text" name="username" value={data.username} onChange={handleChange} placeholder="Choose a unique username" style={inputStyle} />
            </div>

            {/* Mobile */}
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Mobile Number <span style={{ color: "#ef4444" }}>*</span></label>
              <input type="tel" name="mobile" value={data.mobile} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} style={inputStyle} />
            </div>

            {/* Description */}
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>Description <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea name="description" value={data.description} onChange={handleChange} placeholder="Tell us about yourself" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {/* Links */}
            <div style={{ width: "100%" }}>
              <label style={labelStyle}>
                Portfolio & Social Links{" "}
                <span style={{ color: "#3d4438", textTransform: "none", letterSpacing: 0 }}>(optional, max 5)</span>
              </label>
              <p style={{ color: "#6b7a62", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
                Add your Instagram, portfolio, or any website
              </p>

              {links.map((link, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", background: "#15171c", border: "1px solid rgba(93,201,74,0.15)", padding: "0.6rem 1rem" }}>
                  <span style={{ flex: 1, fontSize: "0.78rem", color: "#5dc94a", fontFamily: "Space Mono, monospace", letterSpacing: "0.08em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {getLinkLabel(link)}
                  </span>
                  <button type="button" onClick={() => removeLink(i)} style={{ color: "#6b7a62", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: 0 }}>×</button>
                </div>
              ))}

              {links.length < 5 && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="url" placeholder="instagram.com/yourhandle" value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button type="button" onClick={addLink}
                    style={{ background: "#3a8a2c", color: "#ede9dc", border: "none", padding: "0 1.25rem", fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Verification */}
            {!userInfo?.isSocialLogin && (
              <button onClick={() => setShowVerificationTab(!showVerificationTab)}
                style={{ color: "#5dc94a", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textDecoration: "underline" }}>
                I want to verify my account
              </button>
            )}

            {showVerificationTab && (
              <div style={{ width: "100%", padding: "1.25rem", border: "1px solid rgba(93,201,74,0.2)", background: "#0f1014" }}>
                <h3 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#5dc94a", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                  Account Verification
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                  Join our live verification session on Google Meet. Admins are available 24/7.
                </p>
                <a href={MEET_LINK} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", background: "#3a8a2c", color: "#ede9dc", padding: "0.6rem 1.25rem", textDecoration: "none", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Join Verification Meet
                </a>
                <p style={{ color: "#6b7a62", fontSize: "0.75rem", marginTop: "0.75rem" }}>
                  You will be approved manually by an admin after the session.
                </p>
              </div>
            )}

            {/* Submit */}
            <button onClick={setProfile} type="button"
              style={{ width: "100%", padding: "0.9rem", background: "#3a8a2c", color: "#ede9dc", border: "none", fontFamily: "Space Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
            >
              Save Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;