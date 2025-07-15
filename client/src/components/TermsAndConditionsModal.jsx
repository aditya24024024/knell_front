import React, { useState } from "react";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { useRouter } from "next/router";

const TermsAndConditionsModal = () => {
  const [, dispatch] = useStateProvider();
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const termsText = `
Knell – Terms & Conditions

1. About Knell  
Knell is a neutral digital platform that helps users discover and connect with independent service providers...

2. User Roles  
Service Providers: Independent individuals offering freelance or social services.  
Customers: Users who seek to connect with service providers for specific, non-romantic, activity-based services.

3. Platform Rules  
- No listings or bookings for romantic, sexual, or illegal services.  
- All users must comply with applicable local laws.  
- Respect, consent, and professional behavior are mandatory.

4. Knell’s Legal Position  
- Knell is not a party to any transaction between users.  
- Knell does not set, influence, or enforce pricing.  
- Knell does not verify or guarantee the identity, skills, or background of any user.

5. Payments  
Knell does not process payments or take commissions.

6. Limitation of Liability  
Knell shall not be held liable for:  
- Personal injury, loss, or dispute from user interactions  
- Fraud, misconduct, or illegal activity by a user

7. Dispute Resolution  
Disputes must be resolved directly between users.

8. Termination  
Knell may suspend access for violations.

9. Governing Law  
These Terms are governed by Indian Law.
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
        aria-hidden="true"
      ></div>

      {/* Modal Box */}
      <div
        className="relative z-[10000] bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >
        <h2 id="terms-title" className="text-2xl font-semibold mb-4 text-center">
          Terms & Conditions
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          By signing up to Knell, you agree to our Terms of Service and Privacy Policy.
          Please read them carefully before continuing.
        </p>

        {/* Scrollable Terms Content */}
        <div className="h-64 overflow-y-auto border border-gray-300 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
          {termsText}
        </div>

        {/* Accept Checkbox */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mr-2"
          />
          <label htmlFor="acceptTerms" className="text-sm cursor-pointer">
            I agree to the Terms and Conditions
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!accepted}
            className={`px-4 py-2 rounded text-white transition ${
              accepted
                ? "bg-[#1DBF73] hover:bg-[#149e5f]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
