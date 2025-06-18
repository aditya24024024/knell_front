import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import axios from "axios";
import { SEARCH_GIGS_ROUTE } from '../utils/constants';
import SearchGridItem from '../components/search/SearchGridItem';

const Search = () => {
  const router = useRouter();
  const { category, q } = router.query;
  const [gigs, setGigs] = useState(undefined);

  useEffect(() => {
    const selectedCategory = category || q;
    const getData = async () => {
      try {
        const {
          data: { gigs },
        } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?searchTerm=${q}&category=${selectedCategory}`
        );
        setGigs(gigs);
      } catch (err) {
        console.error(err);
      }
    };
    if (category || q) getData();
  }, [category, q]);

  return (
    <>
      {gigs && (
        <div className="px-4 sm:px-6 md:px-10 lg:px-24 py-6 sm:py-10">
          {q && (
            <h3 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-10">
              Results for <strong>{q}</strong>
            </h3>
          )}

          {/* Filter Buttons */}
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
        </div>
      )}
    </>
  );
};

export default Search;
