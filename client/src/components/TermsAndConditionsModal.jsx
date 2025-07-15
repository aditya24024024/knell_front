import React, { useState } from "react";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

function TermsAndConditionsModal() {
  const [, dispatch] = useStateProvider();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      dispatch({ type: reducerCases.TOGGLE_TERMS_MODAL, showTermsModal: false });
      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
    }
  };

  const handleClose = () => {
    dispatch({ type: reducerCases.TOGGLE_TERMS_MODAL, showTermsModal: false });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999]">
      <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-[10000] max-w-md w-full mx-4 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Terms & Conditions</h2>
        <div className="h-48 overflow-y-auto border border-gray-200 p-3 text-sm text-gray-700 rounded">
          <p>
            Please read and accept the terms before continuing. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nulla at euismod nulla. Proin id augue nec arcu ullamcorper consectetur. Sed vel porta lorem, a tempus sapien.
            {/* Add real terms here */}
          </p>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mr-2"
          />
          <label htmlFor="acceptTerms" className="text-sm">I agree to the Terms and Conditions</label>
        </div>
        <button
          disabled={!accepted}
          onClick={handleContinue}
          className={`w-full mt-4 py-2 text-white rounded ${
            accepted ? "bg-[#1DBF73] hover:bg-[#149e5f]" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Signup
        </button>
      </div>
    </div>
  );
}

export default TermsAndConditionsModal;
