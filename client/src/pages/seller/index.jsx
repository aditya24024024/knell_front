import { useStateProvider } from "../../context/StateContext";
import { GET_SELLER_DASHBOARD_DATA } from "../../utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Index() {
  const [{ userInfo }] = useStateProvider();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const getSellerDashboardData = async () => {
      try {
        const response = await axios.get(GET_SELLER_DASHBOARD_DATA, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setDashboardData(response.data.dashboardData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    if (userInfo) {
      getSellerDashboardData();
    }
  }, [userInfo]);

  if (!userInfo) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh] my-10 mt-0 px-4 sm:px-10 lg:px-32 gap-10">
      {/* Profile Section */}
      <div className="shadow-md p-6 lg:p-10 flex flex-col gap-6 min-w-full lg:min-w-96 w-full lg:w-96 bg-white rounded-lg">
        <div className="flex items-center gap-5">
          {userInfo?.imageName ? (
            <Image
              src={userInfo.imageName}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="bg-purple-500 h-24 w-24 flex items-center justify-center rounded-full">
              <span className="text-5xl text-white font-bold">
                {userInfo.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="text-gray-700 text-lg font-medium">{userInfo.username}</div>
            <div className="font-bold text-md">{userInfo.fullName}</div>
          </div>
        </div>
        <div className="border-t pt-4 text-gray-600">
          {userInfo.description || "No description provided."}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <DashboardCard
          label="Total Gigs"
          value={dashboardData?.gigs}
          onClick={() => router.push("/seller/gigs")}
        />
        <DashboardCard
          label="Completed Bookings"
          value={dashboardData?.orders}
          onClick={() => router.push("/seller/orders")}
        />
        <DashboardCard
          label="Unread Messages"
          value={dashboardData?.unreadMessages}
          onClick={() => router.push("/seller/unread-messages")}
        />
        {/* Uncomment these when backend data is ready
        <DashboardCard label="Earnings Today" value={`₹${dashboardData?.dailyRevenue}`} />
        <DashboardCard label="Earnings Monthly" value={`₹${dashboardData?.monthlyRevenue}`} />
        <DashboardCard label="Earnings Yearly" value={`₹${dashboardData?.revenue}`} />
        */}
        <DashboardCard
          label="Ongoing Bookings"
          value={dashboardData?.stat}
          onClick={() => router.push("/seller/requests")}
        />
      </div>
    </div>
  );
}

// Reusable Card Component
const DashboardCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className={`shadow-md bg-white p-6 sm:p-8 flex flex-col gap-2 rounded-lg transition-all duration-300 ${
      onClick ? 'cursor-pointer hover:shadow-xl' : ''
    }`}
  >
    <h2 className="text-xl text-gray-700">{label}</h2>
    <h3 className="text-[#1DBF73] text-3xl font-extrabold">{value ?? '—'}</h3>
  </div>
);

export default Index;
