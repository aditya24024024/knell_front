import Details from '../../components/Gigs/Details';
import Pricing from '../../components/Gigs/Pricing';
import { reducerCases } from '../../context/constants';
import { useStateProvider } from '../../context/StateContext';
import { CHECK_USER_ORDERED_GIG_ROUTE, GET_GIG_DATA } from '../../utils/constants';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const Gig = () => {
    const router = useRouter();
    const {gigid}=router.query
    // {console.log({gigid})}
    const [{  gigData,userInfo }, dispatch] = useStateProvider();
    useEffect(() => {
      dispatch({ type: reducerCases.SET_GIG_DATA, gigData: undefined });
    }, [dispatch]);
    useEffect(() => {
      const fetchGigData = async () => {
        try {
          const {
            data: { gig },
          } = await axios.get(`${GET_GIG_DATA}/${gigid}`);
          dispatch({ type: reducerCases.SET_GIG_DATA, gigData: gig });
          // console.log({gig})
          // console.log("edrtfgyhujikl")
        } catch (err) {
          console.log(err);
        }
      };
      if (gigid) {
        fetchGigData();}
    }, [gigid, dispatch]);
  
    useEffect(() => {
      const checkGigOrdered = async () => {
        const {
          data: { hasUserOrderedGig },
        } = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigid}`, {
          withCredentials: true,
        });
        dispatch({
          type: reducerCases.HAS_USER_ORDERED_GIG,
          hasOrdered: hasUserOrderedGig,
        });
      };
      if (userInfo) {
        checkGigOrdered();
      }
    }, [dispatch, gigid, userInfo]);
  
    return (
      <div className="grid grid-cols-3 mx-32 gap-20">
        <Details />
        <Pricing />
      </div>
    );
}

export default Gig