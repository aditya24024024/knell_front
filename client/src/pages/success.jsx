import { CREATE_ORDER } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Success() {
  const router = useRouter();
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = router.query;

  useEffect(() => {
    const verify = async () => {
      await axios.post(
        CREATE_ORDER,
        {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        },
        { withCredentials: true }
      );

      setTimeout(() => router.push("/buyer/orders"), 4000);
    };

    if (razorpay_payment_id) verify();
  }, [razorpay_payment_id, router]);

  return (
    <div className="h-[80vh] flex items-center px-20 pt-20 flex-col">
      <h1 className="text-4xl text-center">
        Payment successful 🎉
      </h1>
      <h1 className="text-2xl text-center mt-4">
        Verifying payment…
      </h1>
    </div>
  );
}

export default Success;
