import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";

const Checkout = () => {
  const router = useRouter();
  const { gigId } = router.query;
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const payNow = async () => {
    try {
      setLoading(true);

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // 🔥 CREATE ORDER ON CLICK
      const { data } = await axios.post(
        CREATE_ORDER,
        { gigid: gigId },
        { withCredentials: true }
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Knell",
        description: "Gig Purchase",
        order_id: data.orderId,

        handler: (response) => {
          router.push(
            `/success?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`
          );
        },

        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      // console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] mx-20 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">
        Seller accepted your request. Complete payment.
      </h1>

      <button
        onClick={payNow}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? "Opening Razorpay..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
