import React, { useState } from "react";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { useRouter } from "next/router";

function TermsAndConditionsModal() {
  const [, dispatch] = useStateProvider();
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const termsText = `
Knell – Terms & Conditions

1. About Knell
Knell is a neutral digital platform that helps users discover and connect with independent service providers...

[continue your detailed terms here, like you originally had them]
`;

  const handleContinue = () => {
    if (accepted) {
      dispatch({ type: reducerCases.TOGGLE_TERMS_MODAL, showTermsModal: false });
      dispatch({ type: reducerCases.TOGGLE_SIGNUP_MODAL, showSignupModal: true });
    }
  };

  const handleClose = () => {
    dispatch({ type: reducerCases.TOGGLE_TERMS_MODAL, showTermsModal: false });
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative z-[10000] bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4 text-center">Terms & Conditions</h2>
        <p className="text-sm text-gray-600 mb-2 text-center">
          By signing up to Knell, you agree to our Terms of Service and Privacy Policy.
          Please read them carefully before continuing.
        </p>

        {/* Scrollable Terms Text */}
        <div className="h-64 overflow-y-auto border border-gray-300 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
          {termsText}
        </div>

        {/* Consent and Continue */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mr-2"
          />
          <label htmlFor="acceptTerms" className="text-sm">
            I agree to the Terms and Conditions
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!accepted}
            className={`px-4 py-2 rounded text-white ${
              accepted ? "bg-[#1DBF73] hover:bg-[#149e5f]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue to Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditionsModal;
