import { useStateProvider } from '../../context/StateContext';
import { useRouter } from 'next/router';
import React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { FiClock } from 'react-icons/fi';
import { BiRightArrowAlt } from 'react-icons/bi';
import { CREATE_ORDER } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { reducerCases } from '../../context/constants';

const Pricing = () => {
  const [{ gigData, userInfo, showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const router = useRouter();
  const { gigid } = router.query;

  const handleSignup = () => {
    if (showLoginModal) {
      dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: false });
    }
    dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
  };

  const handleLogin = () => {
    if (showSignupModal) {
      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: false });
    }
    dispatch({ type: reducerCases.TOGGLE_LOGIN_MODAL, showLoginModal: true });
  };

  const handleRequest = async () => {
  if (!userInfo?.isSocialLogin) {
    toast.error("⚠️ You are not verified! Please complete verification in your profile before placing an order.");
    setTimeout(() => {
      router.push('/profile');
    }, 1500); // Optional: navigate them after short delay
    return;
  }

  try {
    const { data } = await axios.post(CREATE_ORDER, { gigid }, { withCredentials: true });
    toast.success("Your order request has been sent! Please wait for your 'Friend' to accept.");
    router.push('/buyer/orders/');
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
      toast.error("You already have a pending request from this gig.");
    } else if (status === 409 || status === 411) {
      toast.error("Please login again.");
      handleLogin();
    } else if (status === 410) {
      toast.error("You must sign up first before ordering.");
      handleSignup();
    } else {
      toast.error("Order creation failed. Please try again later.");
    }
  }
};


  if (!gigData) return null;

  return (
    <div className="sticky top-36 mb-10 h-max w-full max-w-sm">
      <div className="border p-6 sm:p-8 flex flex-col gap-5 rounded shadow-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-[#74767e]">{gigData.shortDesc}</h4>
          <h6 className="font-semibold text-lg">₹{gigData.price}</h6>
        </div>

        {/* Delivery Info */}
        <div className="text-[#62646a] font-semibold text-sm flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-xl" />
            <span>{gigData.deliveryTime} Days ETA </span>
          </div>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2">
          {(gigData.features || []).map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <BsCheckLg className="text-[#1DBF73] text-lg" />
              <span className="text-[#4f5156] text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        {gigData.userId === userInfo?.id ? (
          <button
            className="flex items-center bg-[#1DBF73] text-white py-2 justify-center font-bold text-lg rounded hover:bg-[#17a865] transition"
            onClick={() => router.push(`/seller/gigs/${gigData.id}`)}
          >
            <span>Edit</span>
            <BiRightArrowAlt className="text-2xl ml-2" />
          </button>
        ) : (
          <button
            className={`flex items-center justify-center py-2 font-bold text-lg rounded transition ${
              userInfo?.isSocialLogin
                ? 'bg-[#1DBF73] hover:bg-[#17a865] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleRequest}
            disabled={!userInfo?.isSocialLogin}
          >
            <span>{userInfo?.isSocialLogin ? 'Request For Service' : 'Verify to Request'}</span>
            <BiRightArrowAlt className="text-2xl ml-2" />
          </button>
        )}
      </div>

      {/* Contact Me Button */}
      {gigData.userId !== userInfo?.id && (
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => toast.info("Place an order first.")}
            className="w-5/6 py-2 border border-[#74767e] text-[#6c6d75] hover:bg-[#74767e] hover:text-white transition duration-300 rounded font-semibold text-md"
          >
            Contact Me
          </button>
        </div>
      )}
    </div>
  );
};

export default Pricing;


