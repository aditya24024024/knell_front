import Head from "next/head";
import { useState } from "react";

export default function DeleteAccount() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) return;
    window.location.href = `mailto:support@knell.co.in?subject=Delete Account Request&body=Please delete my Knell account associated with this email: ${email}`;
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Delete Account – Knell</title>
        <meta name="description" content="Request deletion of your Knell account and associated data." />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Delete Your Account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Deleting your account will permanently remove all your data from Knell, including your profile, gigs, orders, and messages. This action cannot be undone.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
              ✅ Your request has been submitted. We'll delete your account within 7 business days and confirm via email.
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
              >
                Request Account Deletion
              </button>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Alternatively, email us directly at{" "}
                <a href="mailto:support@knell.co.in" className="text-red-400 underline">
                  support@knell.co.in
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}