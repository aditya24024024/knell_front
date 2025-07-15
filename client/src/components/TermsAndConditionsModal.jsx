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
          {`
Knell – Terms & Conditions

1. About Knell
Knell is a neutral digital platform that helps users discover and connect with independent service providers (e.g., students offering freelance or platonic activity-based sessions). Knell does not provide any service itself, does not employ any service providers, and does not charge any commission.

Knell operates strictly as an intermediary under Section 79 of the Information Technology Act, 2000, and is not responsible for the actions, omissions, or conduct of users listed on the platform.

2. User Roles
Service Providers: Independent individuals offering freelance or social services.
Customers: Users who seek to connect with service providers for specific, non-romantic, activity-based services.
All interactions are arranged directly between users. Knell only facilitates discovery and basic communication.

3. Platform Rules
- No listings or bookings for romantic, sexual, or illegal services.
- All users must comply with applicable local laws.
- Respect, consent, and professional behavior are mandatory.

4. Knell’s Legal Position
- Knell is not a party to any transaction between users.
- Knell does not set, influence, or enforce pricing.
- Knell does not verify or guarantee the identity, skills, or background of any user.
- Users are advised to exercise due diligence before any offline interaction.

5. Payments
Knell does not process payments or take commissions. Any payments exchanged are handled directly between the customer and the service provider.

6. Limitation of Liability
Knell shall not be held liable for:
- Personal injury, loss, or dispute arising from user interactions.
- Fraud, misconduct, or illegal activity by a user.
- Cancellation, no-shows, or dissatisfaction with a session.
Users agree to hold Knell harmless in all such cases.

7. Dispute Resolution
Disputes must be resolved directly between users. Knell is not obligated to mediate, though it may suspend or ban accounts violating these Terms.

8. Termination
Knell may terminate or suspend access without notice for any violation of these Terms or behavior that could harm the platform.

9. Governing Law
These Terms are governed by the laws of India. Jurisdiction lies with the courts of New Delhi.

Knell – Privacy Policy

Effective Date: [Insert Date]
Platform Name: Knell (www.knell.co.in)

1. What We Collect
- Name, email, phone number
- IP address, device info
- Session history, messages, etc.

2. Why We Collect
- To enable platform features
- Ensure safety and prevent misuse
- Comply with Indian DPDP law

3. Our Legal Basis
We rely on your consent, as per the DPDP Act 2023.

4. Data Sharing
Only with law enforcement or technical partners under NDA.

5. Your Rights
- Access, correct, or delete your data
- Withdraw consent anytime
- Contact: kk@knell.co.in

6. Cookies & Tracking
We may use cookies/analytics to improve user experience.

7. Data Security
We use industry-standard protection but cannot guarantee 100% security.
          `}
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
