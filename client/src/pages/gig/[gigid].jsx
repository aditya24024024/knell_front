import Details from '../../components/Gigs/Details';
import Pricing from '../../components/Gigs/Pricing';
import { reducerCases } from '../../context/constants';
import { useStateProvider } from '../../context/StateContext';
import { CHECK_USER_ORDERED_GIG_ROUTE, GET_GIG_DATA } from '../../utils/constants';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Head from "next/head";

const Gig = () => {
  const router = useRouter();
  const { gigid } = router.query;
  const [{ gigData, userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    dispatch({ type: reducerCases.SET_GIG_DATA, gigData: undefined });
  }, [dispatch]);

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const response = await axios.get(`${GET_GIG_DATA}/${gigid}`);
        dispatch({ type: reducerCases.SET_GIG_DATA, gigData: response.data.gig });
      } catch (err) {}
    };
    if (gigid) fetchGigData();
  }, [gigid, dispatch]);

  useEffect(() => {
    const checkGigOrdered = async () => {
      try {
        const response = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigid}`, { withCredentials: true });
        dispatch({ type: reducerCases.HAS_USER_ORDERED_GIG, hasOrdered: response.data.hasUserOrderedGig });
      } catch (err) {}
    };
    if (userInfo && gigid) checkGigOrdered();
  }, [gigid, userInfo, dispatch]);

  return (
    <>
      <Head>
        <meta name="keywords" content={gigData?.features?.join(', ') || ''} />
      </Head>
      <div
        style={{
          background: "#09090b",
          minHeight: "100vh",
          paddingTop: "6rem",
          paddingBottom: "4rem",
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-3 mx-6 md:mx-16 lg:mx-32 gap-10 md:gap-16 lg:gap-20"
        >
          <Details />
          <Pricing />
        </div>
      </div>
    </>
  );
};

export default Gig;