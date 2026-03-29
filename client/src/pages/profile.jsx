import { reducerCases } from '../context/constants';
import { useStateProvider } from '../context/StateContext';
import { GET_USER_INFO, SET_USER_IMAGE, SET_USER_INFO } from '../utils/constants';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { optimizeImage } from "../utils/cloudinary";

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
  const [data, setData] = useState({ fullName: "", description: "" });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { user } } = await axios.post(GET_USER_INFO, {}, { withCredentials: true });
        dispatch({ type: reducerCases.SET_USER, userInfo: { ...user, image: user.image } });
        setData({ username: user?.username || "", description: user?.description || "", fullName: user?.fullName || "" });
        if (user?.image) setPreview(user.image);
        setIsLoaded(true);
      } catch (err) {}
    };
    fetchUserInfo();
  }, [dispatch]);

  const setProfile = async () => {
    try {
      const response = await axios.post(SET_USER_INFO, { ...data }, { withCredentials: true });
      if (response?.data?.emptyFieldError) { setErrorMessage("Please enter all the required fields"); return; }
      let imageName = "";
      if (image) {
        const formData = new FormData();
        formData.append("images", image);
        const { data: { img } } = await axios.post(SET_USER_IMAGE, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
        imageName = img;
      }
      dispatch({ type: reducerCases.SET_USER, userInfo: { ...userInfo, ...data, image: imageName || userInfo?.image || false } });
      toast.success("Profile set up successfully");
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
        <div style={{
          background: "#09090b", minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "8rem 1.5rem 4rem",
          gap: "1.5rem",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", border: "1px solid rgba(93,201,74,0.25)", padding: "0.35rem 0.9rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 6, height: 6, background: "#5dc94a", borderRadius: "50%" }} />
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#5dc94a" }}>
                Welcome to Knell
              </span>
            </div>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1, marginBottom: "0.5rem" }}>
              COMPLETE YOUR PROFILE
            </h2>
            <p style={{ color: "#6b7a62", fontSize: "0.85rem", fontWeight: 300 }}>
              Set up your profile to start hiring or selling on Knell
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
            <div style={{ color: "#ef4444", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%", maxWidth: 500 }}>

            {/* Profile picture */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62" }}>
                Profile Picture
              </span>
              <div
                style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(93,201,74,0.3)", cursor: "pointer" }}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              >
                {preview ? (
                  <img
                    src={preview?.includes("res.cloudinary.com") ? optimizeImage(preview, 'sm') : preview}
                    alt="profile"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  <div style={{ background: "#3a8a2c", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#ede9dc", fontSize: "2.5rem", fontWeight: 700 }}>
                      {userInfo?.email?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: imageHover ? 1 : 0, transition: "opacity 0.2s",
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32, color: "white", position: "absolute" }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <input type="file" onChange={handleFile} style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer" }} multiple={false} name="profileImage" />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div style={{ width: "100%" }}>
              <label style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.5rem" }}>
                Full Name
              </label>
              <input
                type="text" name="fullName" value={data.fullName}
                onChange={handleChange} placeholder="Your full name"
                style={{
                  width: "100%", padding: "0.85rem 1rem",
                  background: "#15171c", border: "1px solid rgba(93,201,74,0.2)",
                  color: "#dbd7ca", fontFamily: "Inter, sans-serif", fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ width: "100%" }}>
              <label style={{ display: "block", fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62", marginBottom: "0.5rem" }}>
                Description
              </label>
              <textarea
                name="description" value={data.description}
                onChange={handleChange} placeholder="Tell us about yourself"
                rows={4}
                style={{
                  width: "100%", padding: "0.85rem 1rem",
                  background: "#15171c", border: "1px solid rgba(93,201,74,0.2)",
                  color: "#dbd7ca", fontFamily: "Inter, sans-serif", fontSize: "0.9rem",
                  outline: "none", resize: "vertical",
                }}
              />
            </div>

            {/* Verification */}
            {!userInfo?.isSocialLogin && (
              <button
                onClick={() => setShowVerificationTab(!showVerificationTab)}
                style={{ color: "#5dc94a", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Mono, monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textDecoration: "underline" }}
              >
                I want to verify my account
              </button>
            )}

            {showVerificationTab && (
              <div style={{ width: "100%", padding: "1.25rem", border: "1px solid rgba(93,201,74,0.2)", background: "#0f1014" }}>
                <h3 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.2rem", color: "#5dc94a", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                  Account Verification
                </h3>
                <p style={{ color: "#9ca3af", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                  To verify your account, join our live verification session on Google Meet. Admins are available 24/7.
                </p>
                <a
                  href={MEET_LINK} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-block", background: "#3a8a2c", color: "#ede9dc",
                    padding: "0.6rem 1.25rem", textDecoration: "none",
                    fontFamily: "Space Mono, monospace", fontSize: "0.65rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}
                >
                  Join Verification Meet
                </a>
                <p style={{ color: "#6b7a62", fontSize: "0.75rem", marginTop: "0.75rem" }}>
                  You will be approved manually by an admin after the session.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={setProfile}
              style={{
                width: "100%", padding: "0.9rem",
                background: "#3a8a2c", color: "#ede9dc", border: "none",
                fontFamily: "Space Mono, monospace", fontSize: "0.72rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: "pointer", transition: "background 0.2s",
              }}
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