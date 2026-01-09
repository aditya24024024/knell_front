import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_WALLET_ROUTE } from "../../../utils/constants";

function Wallet() {
  const [{ userInfo }] = useStateProvider();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (!userInfo) return;
    axios
      .get(GET_SELLER_WALLET_ROUTE, { withCredentials: true })
      .then((res) => setWallet(res.data.wallet))
      .catch(console.error);
  }, [userInfo]);

  return (
    <div className="min-h-screen pt-28 px-4 md:px-12 lg:px-24">
      <h3 className="text-2xl font-semibold mb-6">Wallet</h3>

      <div className="bg-white shadow rounded-xl p-6">
        <p className="text-gray-500">Available Balance</p>
        <p className="text-3xl font-bold text-green-600">
          ₹{wallet?.balance || 0}
        </p>
      </div>
    </div>
  );
}

export default Wallet;
