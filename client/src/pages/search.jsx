import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from "next/router";
import axios from "axios";
import { SEARCH_GIGS_ROUTE } from '../utils/constants';
import SearchGridItem from '../components/search/SearchGridItem';
// import dynamic from 'next/dynamic';

const Search = () => {
  const router = useRouter();
  const { category, q } = router.query;
  const [gigs, setGigs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  // Reset when search/category changes
  useEffect(() => {
    setGigs([]);
    setPage(1);
    setHasMore(true);
  }, [category, q]);

  // Fetch gigs when page or search changes
  useEffect(() => {
    const selectedCategory = category || q;
    if (!selectedCategory) return;

    const getData = async () => {
      setLoading(true);
      try {
        const {
          data: { gigs: newGigs },
        } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?searchTerm=${q || ''}&category=${selectedCategory}&page=${page}&limit=10`
        );
        if (page === 1) {
          setGigs(newGigs);
        } else {
          setGigs(prev => [...prev, ...newGigs]);
        }
        setHasMore(newGigs.length === 10);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [category, q, page]);

  // Infinite scroll — triggers next page when loader div is visible
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const option = { threshold: 0.5 };
    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  //   const HeavyComponent = dynamic(() => SearchGridItem, {
  //   ssr: false,
  //   loading: () => <p>Loading...</p>,
  // });

  return (
    <>
      {(gigs.length > 0 || loading) && (
        <div className="px-4 sm:px-6 md:px-10 lg:px-24 py-6 sm:py-10">
          {q && (
            <h3 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-10">
              Results for <strong>{q}</strong>
            </h3>
          )}
          <div className="flex flex-wrap gap-3 mb-6">
            <button className="py-2 px-4 border border-gray-400 rounded-lg font-medium text-sm sm:text-base">
              Category
            </button>
            <button className="py-2 px-4 border border-gray-400 rounded-lg font-medium text-sm sm:text-base">
              Budget
            </button>
            <button className="py-2 px-4 border border-gray-400 rounded-lg font-medium text-sm sm:text-base">
              Delivery Time
            </button>
          </div>

          {/* Gigs Count */}
          <div className="mb-4">
            <span className="text-gray-600 font-medium">
              {gigs.length} services available
            </span>
          </div>

          {/* Gig Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gigs.map((gig) => (
              <SearchGridItem gig={gig} key={gig.id} />
            ))}
          </div>

          {/* Invisible loader div — triggers infinite scroll */}
          <div ref={loaderRef} className="h-10 mt-6" />

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin" />
            </div>
          )}

          {/* End of results */}
          {!hasMore && gigs.length > 0 && (
            <p className="text-center text-gray-500 py-6">
              All {gigs.length} services loaded
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default Search;