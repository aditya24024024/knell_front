import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from "next/router";
import axios from "axios";
import { SEARCH_GIGS_ROUTE } from '../utils/constants';
import SearchGridItem from '../components/search/SearchGridItem';

const Search = () => {
  const router = useRouter();
  const { category, q } = router.query;
  const [gigs, setGigs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    setGigs([]);
    setPage(1);
    setHasMore(true);
  }, [category, q]);

  useEffect(() => {
    const selectedCategory = category || q;
    if (!selectedCategory) return;
    const getData = async () => {
      setLoading(true);
      try {
        const { data: { gigs: newGigs } } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?searchTerm=${q || ''}&category=${selectedCategory}&page=${page}&limit=10`
        );
        if (page === 1) setGigs(newGigs);
        else setGigs(prev => [...prev, ...newGigs]);
        setHasMore(newGigs.length === 10);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [category, q, page]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) setPage(prev => prev + 1);
  }, [hasMore, loading]);

  useEffect(() => {
    const option = { threshold: 0.5 };
    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [handleObserver]);

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", paddingTop: "6rem" }}>
      {(gigs.length > 0 || loading) && (
        <div style={{ padding: "2rem 3rem" }}>

          {/* Search heading */}
          {q && (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#5dc94a" }}>
                  Search Results
                </span>
                <div style={{ width: 40, height: 1, background: "#3a8a2c" }} />
              </div>
              <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ede9dc", letterSpacing: "0.02em", lineHeight: 1 }}>
                Results for <span style={{ color: "#5dc94a" }}>{q}</span>
              </h2>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {["Category", "Budget", "Delivery Time"].map((f) => (
              <button
                key={f}
                style={{
                  fontFamily: "Space Mono, monospace", fontSize: "0.62rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "0.45rem 1rem",
                  border: "1px solid rgba(93,201,74,0.2)",
                  background: "transparent", color: "#6b7a62", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5dc94a"; e.currentTarget.style.color = "#5dc94a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(93,201,74,0.2)"; e.currentTarget.style.color = "#6b7a62"; }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Count */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#6b7a62" }}>
              {gigs.length} services available
            </span>
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
background: "transparent",
border: "none",
            marginBottom: "2rem",
          }}>
            {gigs.map((gig) => (
              <SearchGridItem gig={gig} key={gig.id} />
            ))}
          </div>

          {/* Infinite scroll loader */}
          <div ref={loaderRef} style={{ height: 40 }} />

          {/* Spinner */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
              <div style={{
                width: 32, height: 32,
                border: "3px solid rgba(93,201,74,0.2)",
                borderTop: "3px solid #5dc94a",
                borderRadius: "50%",
                animation: "knell-spin 0.8s linear infinite",
              }} />
              <style jsx global>{`
                @keyframes knell-spin { to { transform: rotate(360deg); } }
              `}</style>
            </div>
          )}

          {/* End */}
          {!hasMore && gigs.length > 0 && (
            <p style={{ textAlign: "center", color: "#3d4438", fontFamily: "Space Mono, monospace", fontSize: "0.6rem", letterSpacing: "0.15em", padding: "2rem 0" }}>
              All {gigs.length} services loaded
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && gigs.length === 0 && (q || category) && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "3rem", color: "#1c1f27", letterSpacing: "0.05em" }}>NO RESULTS</div>
          <p style={{ fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#3d4438", textTransform: "uppercase" }}>
            No gigs found for &quot;{q || category}&quot;
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.65rem", letterSpacing: "0.12em",
              textTransform: "uppercase", border: "1px solid rgba(93,201,74,0.2)",
              color: "#5dc94a", padding: "0.6rem 1.5rem", background: "none", cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;