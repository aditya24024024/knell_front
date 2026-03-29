import { useStateProvider } from '../../context/StateContext';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Reviews from './Reviews';
import AddReview from './AddReview';
import { useRouter } from 'next/router';
import { optimizeImage } from '../../utils/cloudinary';

const optimizeAvatar = (url) => optimizeImage(url, 'sm');

const getEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytShortsMatch) return `https://www.youtube.com/embed/${ytShortsMatch[1]}`;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return null;
};

const S = {
  page: { background: "#09090b", minHeight: "100vh" },
  heading: { fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "0.02em", color: "#ede9dc", lineHeight: 1.1 },
  sectionTitle: { fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", letterSpacing: "0.04em", color: "#ede9dc", marginBottom: "1rem", marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" },
  sectionTitleLine: { flex: 1, height: 1, background: "rgba(93,201,74,0.15)" },
  text: { color: "#9ca3af", lineHeight: 1.8, fontSize: "0.9rem" },
  username: { fontFamily: "Space Mono, monospace", fontSize: "0.72rem", letterSpacing: "0.1em", color: "#5dc94a", cursor: "pointer" },
  fullName: { fontWeight: 600, color: "#dbd7ca", fontSize: "0.95rem" },
  border: "1px solid rgba(93,201,74,0.12)",
};

const Details = () => {
  const [{ gigData, hasOrdered }] = useStateProvider();
  const [currentImage, setCurrentImage] = useState('');
  const [averageRatings, setAverageRatings] = useState('0');
  const router = useRouter();

  useEffect(() => {
    if (gigData) setCurrentImage(gigData.images[0]);
  }, [gigData]);

  useEffect(() => {
    if (gigData?.reviews?.length) {
      const total = gigData.reviews.reduce((acc, { rating }) => acc + rating, 0);
      setAverageRatings((total / gigData.reviews.length).toFixed(1));
    }
  }, [gigData]);

  if (!gigData || !currentImage) return null;

  const embedUrl = gigData.video ? getEmbedUrl(gigData.video) : null;

  return (
    <div className="col-span-2 flex flex-col gap-6" style={{ color: "#dbd7ca" }}>

      {/* Title */}
      <h2 style={S.heading}>{gigData.title}</h2>

      {/* Seller row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.75rem", border: S.border, background: "#0f1014" }}
        onClick={() => router.push(`/profile/${gigData.createdBy.username}`)}
      >
        {gigData.createdBy.profileImage ? (
          <Image src={optimizeAvatar(gigData.createdBy.profileImage)} alt="profile" height={40} width={40} className="rounded-full" />
        ) : (
          <div style={{ background: "#3a8a2c", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#ede9dc", fontWeight: 700, fontSize: "1rem" }}>{gigData.createdBy.email[0].toUpperCase()}</span>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={S.fullName}>{gigData.createdBy.fullName}</span>
          <span style={S.username}>@{gigData.createdBy.username}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto" }}>
          {[1,2,3,4,5].map((star) => (
            <FaStar key={star} style={{ color: Math.ceil(averageRatings) >= star ? "#e8b84b" : "#2a2d35" }} />
          ))}
          <span style={{ color: "#e8b84b", marginLeft: "0.25rem", fontSize: "0.85rem" }}>{averageRatings}</span>
          <span style={{ color: "#6b7a62", fontSize: "0.8rem" }}>({gigData.reviews.length})</span>
        </div>
      </div>

      {/* Images */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ width: "100%", maxWidth: 800, overflow: "hidden", border: S.border }}>
          <Image
            src={optimizeImage(currentImage, 'lg')} alt="Gig" height={800} width={800}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {gigData.images.map((img) => (
            <div
              key={img}
              onClick={() => setCurrentImage(img)}
              style={{
                border: currentImage === img ? "2px solid #5dc94a" : "2px solid transparent",
                cursor: "pointer", overflow: "hidden",
                opacity: currentImage === img ? 1 : 0.55,
                transition: "all 0.2s",
              }}
            >
              <Image src={optimizeImage(img, 'md')} alt="Thumbnail" height={80} width={80} style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Video */}
      {gigData.video && (
        <div>
          <div style={S.sectionTitle}>
            Video <div style={S.sectionTitleLine} />
          </div>
          {embedUrl ? (
            <div style={{ width: "100%", maxWidth: 800, aspectRatio: "16/9", overflow: "hidden", border: S.border }}>
              <iframe src={embedUrl} style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <a href={gigData.video} target="_blank" rel="noopener noreferrer" style={{ color: "#5dc94a", textDecoration: "none", fontWeight: 500 }}>
              ▶ Watch Video
            </a>
          )}
        </div>
      )}

      {/* About gig */}
      <div>
        <div style={S.sectionTitle}>About this Gig <div style={S.sectionTitleLine} /></div>
        <p style={S.text}>{gigData.description}</p>
      </div>

      {/* About seller */}
      <div
        style={{ cursor: "pointer", padding: "1.25rem", border: S.border, background: "#0f1014" }}
        onClick={() => router.push(`/profile/${gigData.createdBy.username}`)}
      >
        <div style={S.sectionTitle}>About the Seller <div style={S.sectionTitleLine} /></div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {gigData.createdBy.profileImage ? (
            <Image src={optimizeAvatar(gigData.createdBy.profileImage)} alt="profile" height={80} width={80} className="rounded-full" />
          ) : (
            <div style={{ background: "#3a8a2c", width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#ede9dc", fontSize: "1.5rem", fontWeight: 700 }}>{gigData.createdBy.email[0].toUpperCase()}</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={S.fullName}>{gigData.createdBy.fullName}</span>
              <span style={S.username}>@{gigData.createdBy.username}</span>
            </div>
            <p style={S.text}>{gigData.createdBy.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
              {[1,2,3,4,5].map((star) => (
                <FaStar key={star} style={{ color: Math.ceil(gigData.averageRating || 0) >= star ? "#e8b84b" : "#2a2d35" }} />
              ))}
              <span style={{ color: "#6b7a62", fontSize: "0.8rem", marginLeft: "0.25rem" }}>({gigData.totalReviews})</span>
            </div>
          </div>
        </div>
      </div>

      <Reviews />
      {hasOrdered && <AddReview />}
    </div>
  );
};

export default Details;