import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";

const Checkout = () => {
  const router = useRouter();
  const { gigId } = router.query;
  const [order, setOrder] = useState(null);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const requestService = async () => {
    const { data } = await axios.post(
      CREATE_ORDER,
      { gigid: gigId },
      { withCredentials: true }
    );

    setOrder(data);
  };

  const payNow = async () => {
    await loadRazorpay();

    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: "Knell",
      description: "Service Payment",
      order_id: order.orderId,

      handler: (response) => {
        router.push(
          `/success?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`
        );
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-[80vh] mx-20 flex flex-col gap-8 items-center">
      <h1 className="text-3xl">Request this service</h1>

      {!order && (
        <button
          onClick={requestService}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Request Service
        </button>
      )}

      {order && (
        <button
          onClick={payNow}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Pay ₹{order.amount / 100}
        </button>
      )}
    </div>
  );
};

export default Checkout;
