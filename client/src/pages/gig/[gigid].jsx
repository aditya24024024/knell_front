import Details from '../../components/Gigs/Details';
import Pricing from '../../components/Gigs/Pricing';
import { reducerCases } from '../../context/constants';
import { useStateProvider } from '../../context/StateContext';
import { CHECK_USER_ORDERED_GIG_ROUTE, GET_GIG_DATA } from '../../utils/constants';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Gig = () => {
  const router = useRouter();
  const { gigid } = router.query;
  const [{ gigData, userInfo }, dispatch] = useStateProvider();

  // Clear gig data on initial render
  useEffect(() => {
    dispatch({ type: reducerCases.SET_GIG_DATA, gigData: undefined });
  }, [dispatch]);

  // Fetch gig data when gigid is available
  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const response = await axios.get(`${GET_GIG_DATA}/${gigid}`);
        dispatch({ type: reducerCases.SET_GIG_DATA, gigData: response.data.gig });
      } catch (err) {
        console.error("Failed to fetch gig data:", err);
      }
    };
    if (gigid) fetchGigData();
  }, [gigid, dispatch]);

  // Check if the current user has already ordered this gig
  useEffect(() => {
    const checkGigOrdered = async () => {
      try {
        const response = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigid}`, {
          withCredentials: true,
        });
        dispatch({
          type: reducerCases.HAS_USER_ORDERED_GIG,
          hasOrdered: response.data.hasUserOrderedGig,
        });
      } catch (err) {
        console.error("Failed to check gig order status:", err);
      }
    };
    if (userInfo && gigid) checkGigOrdered();
  }, [gigid, userInfo, dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mx-6 md:mx-16 lg:mx-32 gap-10 md:gap-16 lg:gap-20">
      <Details />
      <Pricing />
    </div>
  );
};

export default Gig;
