import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from "next/router";
import axios from "axios";
import { SEARCH_GIGS_ROUTE } from '../utils/constants';
import SearchGridItem from '../components/search/SearchGridItem';

const CATEGORIES = [
  "All Categories",
  "Dance Companion",
  "Editor",
  "Freelancer",
  "Gaming Companion",
  "Musician",
  "Old Age Companion",
  "Online Meet",
  "Pet Companion",
  "Photography",
  "Pub Crawler",
  "Shopper",
  "Social Companion",
  "Travel Companion",
  "Tutor/Counselor",
  "Videographer",
];

const BUDGET_OPTIONS = [
  { label: "Any Budget", min: null, max: null },
  { label: "Under ₹500", min: null, max: 500 },
  { label: "₹500 – ₹2000", min: 500, max: 2000 },
  { label: "₹2000+", min: 2000, max: null },
];

const DELIVERY_OPTIONS = [
  { label: "Any Time", value: null },
  { label: "24 Hours", value: 1 },
  { label: "3 Days", value: 3 },
  { label: "7 Days", value: 7 },
];

const dropdownStyle = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  background: "#111113",
  border: "1px solid rgba(93,201,74,0.25)",
  minWidth: 180,
  zIndex: 100,
  padding: "0.35rem 0",
};

const dropdownItemStyle = (active) => ({
  fontFamily: "Space Mono, monospace",
  fontSize: "0.62rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "0.55rem 1rem",
  color: active ? "#5dc94a" : "#ede9dc",
  background: active ? "rgba(93,201,74,0.08)" : "transparent",
  cursor: "pointer",
  display: "block",
  width: "100%",
  border: "none",
  textAlign: "left",
});

const FilterButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: "Space Mono, monospace",
      fontSize: "0.62rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      padding: "0.45rem 1rem",
      border: `1px solid ${isActive ? "#5dc94a" : "rgba(93,201,74,0.2)"}`,
      background: isActive ? "rgba(93,201,74,0.08)" : "transparent",
      color: isActive ? "#5dc94a" : "#6b7a62",
      cursor: "pointer",
    }}
  >
    {label} {isActive ? "▲" : "▼"}
  </button>
);

const Search = () => {
  const router = useRouter();
  const { category, q } = router.query;

  const [gigs, setGigs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_OPTIONS[0]);
  const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);

  // Dropdown open state
  const [openDropdown, setOpenDropdown] = useState(null); // "category" | "budget" | "delivery" | null

  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset on query change
  useEffect(() => {
    setGigs([]);
    setPage(1);
    setHasMore(true);
    setSelectedCategory("All Categories");
    setSelectedBudget(BUDGET_OPTIONS[0]);
    setSelectedDelivery(DELIVERY_OPTIONS[0]);
  }, [category, q]);

  // Reset pagination when filters change
  useEffect(() => {
    setGigs([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory, selectedBudget, selectedDelivery]);

  // Fetch gigs
  useEffect(() => {
    const term = q || category;
    if (!term) return;

    const getData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("searchTerm", q || "");
        params.set("category", selectedCategory !== "All Categories" ? selectedCategory : (category || q || ""));
        params.set("page", page);
        params.set("limit", 10);
        if (selectedBudget.min != null) params.set("minPrice", selectedBudget.min);
        if (selectedBudget.max != null) params.set("maxPrice", selectedBudget.max);
        if (selectedDelivery.value != null) params.set("deliveryTime", selectedDelivery.value);

        const { data: { gigs: newGigs } } = await axios.get(`${SEARCH_GIGS_ROUTE}?${params.toString()}`);
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
  }, [category, q, page, selectedCategory, selectedBudget, selectedDelivery]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) setPage(prev => prev + 1);
  }, [hasMore, loading]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.5 });
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [handleObserver]);

  const activeFilterCount = [
    selectedCategory !== "All Categories",
    selectedBudget.label !== "Any Budget",
    selectedDelivery.label !== "Any Time",
  ].filter(Boolean).length;

  return (
    <div style={{ background: "#09090b", minHeight: "100vh", paddingTop: "6rem" }}>
      {(gigs.length > 0 || loading || activeFilterCount > 0) && (
        <div style={{ padding: "2rem 3rem" }}>

          {/* Heading */}
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
          <div ref={dropdownRef} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap", position: "relative" }}>

            {/* Category */}
            <div style={{ position: "relative" }}>
              <FilterButton
                label={selectedCategory === "All Categories" ? "Category" : selectedCategory}
                isActive={openDropdown === "category"}
                onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              />
              {openDropdown === "category" && (
                <div style={dropdownStyle}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      style={dropdownItemStyle(selectedCategory === cat)}
                      onClick={() => { setSelectedCategory(cat); setOpenDropdown(null); }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Budget */}
            <div style={{ position: "relative" }}>
              <FilterButton
                label={selectedBudget.label === "Any Budget" ? "Budget" : selectedBudget.label}
                isActive={openDropdown === "budget"}
                onClick={() => setOpenDropdown(openDropdown === "budget" ? null : "budget")}
              />
              {openDropdown === "budget" && (
                <div style={dropdownStyle}>
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      style={dropdownItemStyle(selectedBudget.label === opt.label)}
                      onClick={() => { setSelectedBudget(opt); setOpenDropdown(null); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Time */}
            <div style={{ position: "relative" }}>
              <FilterButton
                label={selectedDelivery.label === "Any Time" ? "Delivery Time" : selectedDelivery.label}
                isActive={openDropdown === "delivery"}
                onClick={() => setOpenDropdown(openDropdown === "delivery" ? null : "delivery")}
              />
              {openDropdown === "delivery" && (
                <div style={dropdownStyle}>
                  {DELIVERY_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      style={dropdownItemStyle(selectedDelivery.label === opt.label)}
                      onClick={() => { setSelectedDelivery(opt); setOpenDropdown(null); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedBudget(BUDGET_OPTIONS[0]);
                  setSelectedDelivery(DELIVERY_OPTIONS[0]);
                }}
                style={{
                  fontFamily: "Space Mono, monospace", fontSize: "0.62rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "0.45rem 1rem", border: "1px solid rgba(255,80,80,0.3)",
                  background: "transparent", color: "#ff6b6b", cursor: "pointer",
                }}
              >
                Clear ({activeFilterCount})
              </button>
            )}
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

          <div ref={loaderRef} style={{ height: 40 }} />

          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
              <div style={{
                width: 32, height: 32,
                border: "3px solid rgba(93,201,74,0.2)",
                borderTop: "3px solid #5dc94a",
                borderRadius: "50%",
                animation: "knell-spin 0.8s linear infinite",
              }} />
              <style jsx global>{`@keyframes knell-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

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