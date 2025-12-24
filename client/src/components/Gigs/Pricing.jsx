import { useStateProvider } from '../../context/StateContext';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { FiClock } from 'react-icons/fi';
import { BiRightArrowAlt } from 'react-icons/bi';
import { CREATE_ORDER } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { reducerCases } from '../../context/constants';

const Pricing = () => {
  const [{ gigData, userInfo, showLoginModal, showSignupModal }, dispatch] =
    useStateProvider();
  const router = useRouter();
  const { gigid } = router.query;

  const [requestSent, setRequestSent] = useState(false);

  const handleSignup = () => {
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
  };

  const handleLogin = () => {
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
  };

  const handleRequest = async () => {
    if (!userInfo?.isSocialLogin) {
      toast.error(
        '⚠️ You are not verified! Please complete verification in your profile.'
      );
      setTimeout(() => router.push('/profile'), 1500);
      return;
    }

    try {
      await axios.post(
        CREATE_ORDER,
        { gigid },
        { withCredentials: true }
      );

      toast.success(
        'Request sent! You will be notified once the seller accepts.'
      );
      setRequestSent(true);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401)
        toast.error('You already have a pending request for this gig.');
      else if (status === 409 || status === 411) {
        toast.error('Session expired. Please login again.');
        handleLogin();
      } else if (status === 410) {
        toast.error('Please sign up first.');
        handleSignup();
      } else {
        toast.error('Order request failed. Please try again.');
      }
    }
  };

  if (!gigData) return null;

  const currencySymbol = gigData.currency?.symbol || '₹';

  return (
    <div className="sticky top-36 mb-10 h-max w-full max-w-sm">
      <div className="border p-6 sm:p-8 flex flex-col gap-5 rounded shadow-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-[#74767e]">
            {gigData.shortDesc}
          </h4>
          <h6 className="font-semibold text-lg">
            {currencySymbol}
            {gigData.price}
          </h6>
        </div>

        {/* Delivery Info */}
        <div className="text-[#62646a] font-semibold text-sm flex gap-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-xl" />
            <span>{gigData.deliveryTime} Days ETA</span>
          </div>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2">
          {(gigData.features || []).map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <BsCheckLg className="text-[#1DBF73]" />
              <span className="text-sm text-[#4f5156]">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        {gigData.userId === userInfo?.id ? (
          <button
            className="flex items-center bg-[#1DBF73] text-white py-2 justify-center font-bold text-lg rounded"
            onClick={() => router.push(`/seller/gigs/${gigData.id}`)}
          >
            Edit
            <BiRightArrowAlt className="text-2xl ml-2" />
          </button>
        ) : (
          <button
            className={`flex items-center justify-center w-full py-2 font-bold text-lg rounded transition ${
              requestSent
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#1DBF73] hover:bg-[#17a865] text-white'
            }`}
            onClick={handleRequest}
            disabled={requestSent}
          >
            <span>
              {requestSent
                ? 'Request Sent'
                : userInfo?.isSocialLogin
                ? 'Request For Service'
                : 'Verify to Request'}
            </span>
            <BiRightArrowAlt className="text-2xl ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pricing;
