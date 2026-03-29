"use client";

import ImageUpload from '../../../components/ImageUpload';
import { categories } from '../../../utils/categories';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { ADD_GIG_ROUTE } from '../../../utils/constants';
import { useRouter } from 'next/router';
import { useStateProvider } from '../../../context/StateContext';

const inputStyle = {
  display: "block", width: "100%", padding: "0.85rem 1rem",
  background: "#15171c", border: "1px solid rgba(93,201,74,0.2)",
  color: "#dbd7ca", fontFamily: "Inter, sans-serif", fontSize: "0.88rem",
  outline: "none", transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block", marginBottom: "0.5rem",
  fontFamily: "Space Mono, monospace", fontSize: "0.62rem",
  letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7a62",
};

const CreateGig = () => {
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies();
  const router = useRouter();
  const [{ userInfo }] = useStateProvider();
  const [files, setFile] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: '', category: '', description: '',
    time: 0, feature: '', price: 0, shortDesc: '', video: '',
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const addFeature = () => {
    if (data.feature.trim()) {
      setFeatures([...features, data.feature.trim()]);
      setData({ ...data, feature: '' });
    }
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const addGig = async () => {
    if (loading) return;
    if (!userInfo?.isSocialLogin) {
      alert("⚠️ You must be a verified user to create a gig.");
      return;
    }
    const { title, description, category, price, time, shortDesc, video } = data;
    if (title && category && description && features.length && files.length && price > 0 && time > 0 && shortDesc) {
      try {
        setLoading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        const gigData = { title, description, category, features, price, time, shortDesc, ...(video.trim() ? { video: video.trim() } : {}) };
        const res = await axios.post(ADD_GIG_ROUTE, formData, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${cookies.jwt}` },
          params: gigData,
        });
        if (res.status === 201) {
          alert("✅ Gig created successfully!");
          router.replace("/seller/gigs");
        }
      } catch (err) {
        alert("Failed to create gig");
        setLoading(false);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Unverified user block
  if (userInfo && !userInfo.isSocialLogin) {
    return (
      <div style={{ background: "#09090b", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ border: "1px solid rgba(232,184,75,0.3)", background: "#0f1014", padding: "3rem 2rem", maxWidth: 440, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "2rem", color: "#e8b84b", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
            Verification Required
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            You need to verify your account before you can create a gig.
          </p>
          <button
            onClick={() => router.push('/profile/set')}
            style={{ background: "#3a8a2c", color: "#ede9dc", border: "none", padding: "0.8rem 2rem", fontFamily: "Space Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Get Verified
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", paddingTop: "7rem", paddingBottom: "5rem", padding: "7rem 3rem 5rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a" }}>
              Seller Dashboard
            </span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1, marginBottom: "0.5rem" }}>
            Create a New Gig
          </h1>
          <p style={{ color: "#6b7a62", fontSize: "0.85rem", fontWeight: 300 }}>
            Fill in the details below to publish your gig on Knell
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Title + Category */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Gig Title</label>
              <input name="title" type="text" placeholder="e.g. I will edit your gaming YouTube video" value={data.title} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={data.category} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option disabled value="">Choose a category</option>
                {categories.map(({ name }) => (
                  <option key={name} value={name} style={{ background: "#15171c", color: "#dbd7ca" }}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Gig Description</label>
            <textarea name="description" rows={5} placeholder="Describe what your gig offers in detail..." value={data.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Short desc + Price + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Short Description</label>
              <input name="shortDesc" type="text" placeholder="Catchy one-liner for your gig" value={data.shortDesc} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input name="price" type="number" placeholder="e.g. 500" value={data.price} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Delivery Time (days)</label>
              <input name="time" type="number" placeholder="e.g. 3" value={data.time} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Features */}
          <div>
            <label style={labelStyle}>Features / What&apos;s Included</label>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <input name="feature" type="text" placeholder="e.g. Color grading, transitions, thumbnail" value={data.feature} onChange={handleChange} style={{ ...inputStyle, flex: 1 }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature} style={{ background: "#3a8a2c", color: "#ede9dc", border: "none", padding: "0 1.25rem", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
              >
                Add
              </button>
            </div>
            {features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {features.map((feature, i) => (
                  <div key={`${feature}-${i}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(93,201,74,0.25)", padding: "0.3rem 0.75rem", background: "rgba(93,201,74,0.08)" }}>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", color: "#5dc94a", letterSpacing: "0.08em" }}>{feature}</span>
                    <button type="button" onClick={() => removeFeature(i)} style={{ color: "#6b7a62", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label style={labelStyle}>Upload Images</label>
            <div style={{ border: "1px solid rgba(93,201,74,0.2)", padding: "1rem", background: "#0f1014" }}>
              <ImageUpload files={files} setFile={setFile} />
            </div>
          </div>

          {/* Video link */}
          <div>
            <label style={labelStyle}>
              Video Link{" "}
              <span style={{ color: "#3d4438", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
            </label>
            <p style={{ color: "#6b7a62", fontSize: "0.78rem", marginBottom: "0.5rem" }}>
              Paste a YouTube or Google Drive link to showcase your work
            </p>
            <input name="video" type="url" placeholder="https://youtube.com/watch?v=..." value={data.video} onChange={handleChange} style={inputStyle} />
          </div>

          {/* Submit */}
          <div style={{ paddingTop: "1rem" }}>
            <button
              type="button" onClick={addGig} disabled={loading}
              style={{
                background: loading ? "#2a2d35" : "#3a8a2c",
                color: loading ? "#6b7a62" : "#ede9dc",
                border: "none", padding: "0.9rem 2.5rem",
                fontFamily: "Space Mono, monospace", fontSize: "0.72rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#4ea83d"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#3a8a2c"; }}
            >
              {loading ? "Creating Gig..." : "Publish Gig"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;