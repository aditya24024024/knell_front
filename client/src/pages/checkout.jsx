import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { CREATE_ORDER } from "../utils/constants";

const Checkout = () => {
  const router = useRouter();
  const { gigId } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!gigId) return;

    axios
      .post(CREATE_ORDER, { gigid: gigId }, { withCredentials: true })
      .then((res) => setOrder(res.data))
      .catch(console.error);
  }, [gigId]);

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
    const loaded = await loadRazorpay();
    if (!loaded) return alert("Razorpay SDK failed");

    const rzp = new window.Razorpay({
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: "Knell",
      order_id: order.orderId,
      handler: (res) =>
        router.push(
          `/success?razorpay_payment_id=${res.razorpay_payment_id}&razorpay_order_id=${res.razorpay_order_id}&razorpay_signature=${res.razorpay_signature}`
        ),
    });

    rzp.open();
  };

  return (
    <div className="min-h-[80vh] mx-20 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">Please complete the payment</h1>
      {order && (
        <button onClick={payNow} className="bg-black text-white px-6 py-3 rounded">
          Pay ₹{order.amount / 100}
        </button>
      )}
    </div>
  );
};

export default Checkout;
