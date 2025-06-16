import { useStateProvider } from '../../context/StateContext';
import { useRouter } from 'next/router';
import React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { FiClock, FiRefreshCcw } from 'react-icons/fi';
import { BiRightArrowAlt } from "react-icons/bi";
import { CREATE_ORDER } from '../../utils/constants';
import axios from 'axios';
import {toast} from "react-toastify";
import { reducerCases } from '../../context/constants';

const Pricing = () => {
  const [{ gigData, userInfo, showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const router = useRouter();
  const { gigid } = router.query;

  const handleSignup=()=>{
    if (showLoginModal) {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  }

  const handleLogin=()=>{
    if (showSignupModal) {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
  }
  
  const handlerequest = async () => {
    // console.log(data);
    try {
      const { data } = await axios.post(
        CREATE_ORDER,
        { gigid },
        { withCredentials: true }
      );
      toast.success("Your order request has bee sent! Please wait for your 'Friend' to accept");
      router.push('/buyer/orders/');
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        toast.error("Please login again.");
        handleLogin();
      }
      else if (status === 410) {
        toast.error("You must log in first before ordering.");
        handleSignup();
        // window.location.href = 'http://localhost:3000';
      }
      else if (status === 411) {
        // window.location.href = 'http://localhost:3000';
        toast.error("Your session expired. Please login again");
        handleLogin();
      } else {
        toast.error("Order creation failed please try again later.");
        // console.error("Order creation failed:", err);
      }
    }
  }

  return (
    <>
      {/* {console.log(gigData)} */}
      {gigData && (
        <div className="sticky top-36 mb-10 h-max w-96">
          <div className="border p-10 flex flex-col gap-5">
            <div className="flex justify-between">
              <h4 className="text-md font-normal text-[#74767e]">
                {gigData.shortDesc}
              </h4>
              <h6 className="font-medium text-lg">₹{gigData.price}</h6>
            </div>
            <div>
              <div className="text-[#62646a] font-semibold text-sm flex gap-6">
                <div className="flex items-center gap-2">
                  <FiClock className="text-xl" />
                  <span>{gigData.deliveryTime} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiRefreshCcw className="text-xl" />
                  {/* <span>{gigData.revisions} Revisions</span> */}
                </div>
              </div>
              <ul></ul>
            </div>
            <ul className="flex gap-1 flex-col">
              {gigData.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <BsCheckLg className="text-[#1DBF73] text-lg" />
                  <span className="text-[#4f5156]">{feature}</span>
                </li>
              ))}
            </ul>
            {gigData.userId === userInfo?.id ? (
              <button
                className="flex items-center bg-[#1DBF73] text-white py-2 justify-center font-bold text-lg relative rounded"
                onClick={() => router.push(`/seller/gigs/${gigData.id}`)}
              >
                <span>Edit</span>
                <BiRightArrowAlt className="text-2xl absolute right-4" />
              </button>
            ) : (
              <button
                className="flex items-center bg-[#1DBF73] text-white py-2 justify-center font-bold text-lg relative rounded"
                onClick={handlerequest}
              >
                <span>Request For Service</span>
                <BiRightArrowAlt className="text-2xl absolute right-4" />
              </button>
            )}
          </div>
          {gigData.userId !== userInfo?.id && (
            <div className="flex items-center justify-center mt-5">
              <button onClick={()=>toast.info("Place an order first")} className=" w-5/6 hover:bg-[#74767e] py-1 border border-[#74767e] px-5 text-[#6c6d75] hover:text-white transition-all duration-300 text-lg rounded font-bold">
                Contact Me
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Pricing
