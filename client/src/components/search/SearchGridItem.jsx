import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { optimizeImage } from '../../utils/cloudinary';

const optimizeAvatar = (url) => optimizeImage(url, 'sm');

const SearchGridItem = ({ gig }) => {
  const router = useRouter();

  const calculateRatings = () => {
    const { reviews } = gig;
    if (!reviews?.length) return null;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const rating = calculateRatings();
  const currencySymbol = gig.currency?.symbol || '₹';

  return (
    <div
      onClick={() => router.push(`/gig/${gig.id}`)}
      style={{
        background: "#0f1014",
        border: "1px solid rgba(93,201,74,0.1)",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#15171c";
        e.currentTarget.style.borderColor = "rgba(93,201,74,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#0f1014";
        e.currentTarget.style.borderColor = "rgba(93,201,74,0.1)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#1c1f27", overflow: "hidden" }}>
        <Image
          src={optimizeImage(gig.images[0], 'md')}
          alt="Gig Image"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div style={{ padding: "0.85rem 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        {/* Seller */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {gig.createdBy.profileImage ? (
            <Image src={optimizeAvatar(gig.createdBy.profileImage)} alt="Profile" height={24} width={24} style={{ borderRadius: "50%", objectFit: "cover" }} loading="lazy" />
          ) : (
            <div style={{ background: "#3a8a2c", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#ede9dc", fontSize: "0.65rem", fontWeight: 700 }}>
  {(gig.createdBy.fullName || gig.createdBy.username || "?")[0]?.toUpperCase()}
</span>
            </div>
          )}
          <span
            onClick={(e) => { e.stopPropagation(); router.push(`/profile/${gig.createdBy.username}`); }}
            style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#5dc94a", cursor: "pointer" }}
          >
            @{gig.createdBy.username}
          </span>
        </div>

        {/* Title */}
        <p style={{
          color: "#dbd7ca", fontSize: "0.82rem", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          flex: 1,
        }}>
          {gig.title}
        </p>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(237,233,220,0.07)", paddingTop: "0.6rem", marginTop: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem" }}>
            {rating ? (
              <>
                <FaStar style={{ color: "#e8b84b", fontSize: "0.7rem" }} />
                <strong style={{ color: "#e8b84b" }}>{rating}</strong>
                <span style={{ color: "#6b7a62" }}>({gig.reviews?.length || 0})</span>
              </>
            ) : (
              <span style={{ color: "#3d4438", fontFamily: "Space Mono, monospace", fontSize: "0.58rem" }}>New</span>
            )}
          </div>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1rem", letterSpacing: "0.05em", color: "#ede9dc" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.52rem", color: "#6b7a62", verticalAlign: "middle", marginRight: 2 }}>from {currencySymbol}</span>
            {gig.price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchGridItem;