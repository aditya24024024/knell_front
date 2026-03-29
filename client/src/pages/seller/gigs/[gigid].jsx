import ImageUpload from '../../../components/ImageUpload';
import { categories } from '../../../utils/categories';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { EDIT_GIG_DATA, GET_GIG_DATA } from '../../../utils/constants';
import { useRouter } from 'next/router';
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

const Editgig = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const { gigid } = router.query;
  const [files, setFiles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: '', category: '', description: '',
    time: 0, feature: '', price: 0, shortDesc: '', video: '',
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const addFeature = () => {
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: '' });
    }
  };

  const removeFeature = (index) => {
    const updated = [...features];
    updated.splice(index, 1);
    setFeatures(updated);
  };

  const editGig = async () => {
    const { category, description, price, time, title, shortDesc, video } = data;
    if (category && description && title && features.length && files.length && price > 0 && shortDesc && time > 0) {
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        const gigData = { title, description, category, features, price, time, shortDesc, video: video.trim() || '' };
        const response = await axios.put(`${EDIT_GIG_DATA}/${gigid}`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cookies.jwt}` },
          params: gigData,
        });
        if (response.status === 201) {
          toast.success('Gig updated successfully!');
          router.push('/seller/gigs');
        }
      } catch (err) {
        toast.error('Something went wrong while updating the gig.');
      }
    } else {
      toast.warn('Please fill in all required fields.');
    }
  };

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const { data: { gig } } = await axios.get(`${GET_GIG_DATA}/${gigid}`);
        setData({
          title: gig.title, category: gig.category, description: gig.description,
          time: gig.deliveryTime, shortDesc: gig.shortDesc, price: gig.price,
          feature: '', video: gig.video || '',
        });
        setFeatures(gig.features || []);
        gig.images.forEach((image) => {
          fetch(image).then(async (response) => {
            const contentType = response.headers.get('content-type');
            const blob = await response.blob();
            const file = new File([blob], image, { type: contentType });
            setFiles((prev) => [...prev, file]);
          });
        });
      } catch (err) {}
    };
    if (gigid) fetchGigData();
  }, [gigid]);

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", padding: "7rem 3rem 5rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a" }}>Seller Dashboard</span>
            <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
          </div>
          <h1 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1, marginBottom: "0.5rem" }}>Edit Gig</h1>
          <p style={{ color: "#6b7a62", fontSize: "0.85rem", fontWeight: 300 }}>Update your gig information below</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Title + Category */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Gig Title</label>
              <input name="title" value={data.title} onChange={handleChange} type="text" style={inputStyle} placeholder="e.g. I will edit your gaming YouTube video" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" onChange={handleChange} value={data.category} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="" disabled>Select a category</option>
                {categories.map(({ name }) => (
                  <option key={name} value={name} style={{ background: "#15171c", color: "#dbd7ca" }}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Gig Description</label>
            <textarea name="description" rows={5} value={data.description} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe your gig..." />
          </div>

          {/* Short desc + Price + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            <div>
              <label style={labelStyle}>Short Description</label>
              <input type="text" name="shortDesc" value={data.shortDesc} onChange={handleChange} style={inputStyle} placeholder="A quick summary" />
            </div>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input type="number" name="price" value={data.price} onChange={handleChange} style={inputStyle} placeholder="e.g. 500" />
            </div>
            <div>
              <label style={labelStyle}>Delivery Time (days)</label>
              <input type="number" name="time" value={data.time} onChange={handleChange} style={inputStyle} placeholder="e.g. 3" />
            </div>
          </div>

          {/* Features */}
          <div>
            <label style={labelStyle}>Features</label>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <input type="text" name="feature" value={data.feature} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} placeholder="Enter a feature"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
              <button type="button" onClick={addFeature}
                style={{ background: "#3a8a2c", color: "#ede9dc", border: "none", padding: "0 1.25rem", fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
              >Add</button>
            </div>
            {features.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {features.map((feature, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(93,201,74,0.25)", padding: "0.3rem 0.75rem", background: "rgba(93,201,74,0.08)" }}>
                    <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", color: "#5dc94a" }}>{feature}</span>
                    <span style={{ color: "#6b7a62", cursor: "pointer", fontSize: "1rem" }} onClick={() => removeFeature(index)}>&times;</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label style={labelStyle}>Gig Images</label>
            <div style={{ border: "1px solid rgba(93,201,74,0.2)", padding: "1rem", background: "#0f1014" }}>
              <ImageUpload files={files} setFile={setFiles} />
            </div>
          </div>

          {/* Video */}
          <div>
            <label style={labelStyle}>Video Link <span style={{ color: "#3d4438", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <p style={{ color: "#6b7a62", fontSize: "0.78rem", marginBottom: "0.5rem" }}>Paste a YouTube or Google Drive link</p>
            <input type="url" name="video" value={data.video} onChange={handleChange} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
            <button type="button" onClick={editGig}
              style={{ background: "#3a8a2c", color: "#ede9dc", border: "none", padding: "0.9rem 2.5rem", fontFamily: "Space Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4ea83d")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3a8a2c")}
            >Update Gig</button>
            <button type="button" onClick={() => router.back()}
              style={{ background: "transparent", color: "#6b7a62", border: "1px solid rgba(93,201,74,0.2)", padding: "0.9rem 2rem", fontFamily: "Space Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5dc94a"; e.currentTarget.style.color = "#5dc94a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.2)"; e.currentTarget.style.color = "#6b7a62"; }}
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editgig;