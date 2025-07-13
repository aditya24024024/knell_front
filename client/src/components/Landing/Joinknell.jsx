import Image from "next/image";
import React from "react";
import { reducerCases } from '../../context/constants';
import { useStateProvider } from '../../context/StateContext';
import AuthWrapper from '../AuthWrapper';

function Joinknell() {
  const [{ showSignupModal, userInfo }, dispatch] = useStateProvider();

  const handleSignup = () => {
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  };

  return (
    <>
      {showSignupModal && <AuthWrapper type="signup" />}
      <div className="relative mx-4 sm:mx-8 md:mx-16 lg:mx-32 my-10">
        {/* Overlay content */}
        <div className="absolute z-10 top-[15%] sm:top-1/4 left-4 sm:left-10 right-4 sm:right-auto">
          <h4 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 leading-snug sm:leading-tight max-w-[90%] sm:max-w-[75%] md:max-w-[65%]">
            monetise your <i>time.</i>
          </h4>
          {!userInfo && (
            <button
              className="border text-sm sm:text-base font-medium px-4 sm:px-5 py-2 sm:py-2.5 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
              onClick={handleSignup}
            >
              Join Knell
            </button>
          )}
        </div>

        {/* Background image */}
        <div className="w-full h-60 sm:h-72 md:h-96 lg:h-[28rem] relative">
          <Image
            src="/bg-signup.webp"
            fill
            priority
            alt="signup"
            className="rounded-md object-cover"
          />
        </div>
      </div>
    </>
  );
}

export default Joinknell;
