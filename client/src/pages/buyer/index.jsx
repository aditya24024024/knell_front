// /pages/buyer/index.js

import { useStateProvider } from "../../context/StateContext";
import { useRouter } from "next/router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { GET_BUYER_DASHBOARD_DATA } from "../../utils/constants";
import { GET_BUYER_ORDERS_ROUTE, GET_UNREAD_MESSAGES } from "../../utils/constants";

const DashboardCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className={`shadow-md bg-white p-6 flex flex-col gap-2 rounded-lg transition-all duration-300 ${
      onClick ? 'cursor-pointer hover:shadow-xl' : ''
    }`}
  >
    <h2 className="text-xl text-gray-700">{label}</h2>
    <h3 className="text-[#1DBF73] text-3xl font-extrabold">{value ?? '—'}</h3>
  </div>
);

function BuyerDashboard() {
  const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const [ordersCount, setOrdersCount] = useState(null);
  const [unreadCount, setUnreadCount] = useState(null);

  useEffect(() => {
    if (!userInfo) return;

    const fetchDashboardData = async () => {
      try {
        const [ordersRes, unreadRes] = await Promise.all([
          axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true }),
          axios.get(GET_UNREAD_MESSAGES, { withCredentials: true }),
        ]);
        setOrdersCount(ordersRes.data.orders?.length || 0);
        setUnreadCount(unreadRes.data.unreadCount || 0);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      }
    };

    fetchDashboardData();
  }, [userInfo]);

  if (!userInfo) return null;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-10 lg:px-32 flex flex-col lg:flex-row gap-10">
      {/* Profile Section */}
      <div className="shadow-md p-6 flex flex-col gap-6 min-w-full lg:min-w-96 bg-white rounded-lg">
        <div className="flex items-center gap-5">
          {userInfo?.imageName ? (
            <Image src={userInfo.imageName} alt="Profile" width={100} height={100} className="rounded-full" />
          ) : (
            <div className="bg-blue-500 h-24 w-24 flex items-center justify-center rounded-full">
              <span className="text-5xl text-white font-bold">
                {userInfo.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-gray-700 text-lg font-medium">{userInfo.username}</p>
            <p className="font-bold text-md">{userInfo.fullName}</p>
          </div>
        </div>
        <div className="border-t pt-4 text-gray-600">
          {userInfo.description || "No description provided."}
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <DashboardCard
          label="Your Orders"
          value={ordersCount}
          onClick={() => router.push("/buyer/orders")}
        />
        <DashboardCard
          label="Unread Messages"
          value={unreadCount}
          onClick={() => router.push("/buyer/unread-messages")}
        />
      </div>
    </div>
  );
}

export default BuyerDashboard;
