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
          <p className="whitespace-pre-line">
  {Knell – Terms & Conditions

1. About Knell
Knell is a neutral digital platform that helps users discover and connect with independent service providers (e.g., students offering freelance or platonic activity-based sessions). Knell does not provide any service itself, does not employ any service providers, and does not charge any commission.

Knell operates strictly as an intermediary under Section 79 of the Information Technology Act, 2000, and is not responsible for the actions, omissions, or conduct of users listed on the platform.

2. User Roles
Service Providers: Independent individuals offering freelance or social services.

Customers: Users who seek to connect with service providers for specific, non-romantic, activity-based services.

All interactions are arranged directly between users. Knell only facilitates discovery and basic communication.

3. Platform Rules
No listings or bookings for romantic, sexual, or illegal services.
All users must comply with applicable local laws.
Respect, consent, and professional behavior are mandatory.
4. Knell’s Legal Position
Knell is not a party to any transaction between users.
Knell does not set, influence, or enforce pricing.
Knell does not verify or guarantee the identity, skills, or background of any user.

Users are advised to exercise due diligence before any offline interaction.

5. Payments
Knell does not process payments or take commissions. Any payments exchanged are handled directly between the customer and the service provider, offline or via mutual agreement.

6. Limitation of Liability
Knell shall not be held liable for:
Any personal injury, loss, or dispute arising from user interactions.
Fraud, misconduct, or illegal activity by a user.
Cancellation, no-shows, or dissatisfaction with a session.
Users agree to hold Knell harmless in all such cases.

7. Dispute Resolution
Disputes must be resolved directly between users. Knell is not obligated to mediate, though it may suspend or ban accounts found violating these Terms.

8. Termination
Knell reserves the right to terminate or suspend user access without notice if these Terms are violated or if any activity risks legal or reputational harm to the platform.



9. Governing Law
These Terms are governed by the laws of India. Jurisdiction lies with the courts of [ New Delhi].



Knell – Privacy Policy
Effective Date: [Insert Date]
Platform Name: Knell (www.knell.co.in)

1. What We Collect
When you register or interact with Knell, we may collect:
Name, email, phone number
IP address, device information
Service listings, messages (within platform), session history

2. Why We Collect

We use this data to:
Maintain and improve our platform
Enable user discovery and communication
Ensure safety and prevent misuse
Comply with Indian data protection laws

3. Our Legal Basis
We rely on your explicit consent to collect and process your data, as required by the Digital Personal Data Protection (DPDP) Act, 2023.

4. Data Sharing
We do not sell or rent your data. Data may be shared:
With law enforcement when legally required
With technical partners for site maintenance (under strict confidentiality)

5. Your Rights

Under the DPDP Act, you may:
Request access to your personal data
Ask us to correct, update, or delete your data
Withdraw consent at any time
To make a request, contact: kk@knell.co.in

6. Cookies & Tracking
We may use cookies or analytics tools to improve performance. You can disable cookies in your browser settings.

7. Data Security
We follow reasonable industry standards to protect user data, but no system is 100% secure.}
          }
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
