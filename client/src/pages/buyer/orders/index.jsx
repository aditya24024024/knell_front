import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

function Orders() {
  const [{ userInfo }] = useStateProvider();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
          withCredentials: true,
        });
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-12 lg:px-24">
      <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        All Your Orders
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between bg-white border rounded-xl shadow px-4 py-4"
            >
              <div className="flex items-center gap-4">
                <img
  src={order.gig?.createdBy?.profileImage || "/default.jpg"}
  alt="Seller"
  className="w-14 h-14 rounded-full object-cover"
/>
<div className="flex flex-col">
  <p className="font-semibold">
    Order from{" "}
    <Link
      href={`/profile/${order.gig?.createdBy?.username || ""}`}
      className="text-black hover:underline"
    >
      {order.gig?.createdBy?.username || "Unknown"}
    </Link>
  </p>
  <span className="text-gray-500 text-sm">
    {timeAgo(order.createdAt)}
  </span>
  <span className="text-sm text-gray-600">
    Gig: <b>{order.gig?.title}</b> | ₹{order.price} | Status:{" "}
    <b className="capitalize">{order.status}</b>
  </span>
</div>

              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                <Link
                  href={`/buyer/orders/messages/${order.id}`}
                  className="px-4 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800"
                >
                  Message
                </Link>
                {order.status === "Completed" && (
                  <span className="px-4 py-2 text-sm bg-green-100 rounded-lg text-green-700 font-semibold">
                    Completed
                  </span>
                )}
                {order.status === "Request Accepted" && (
                  <span className="px-4 py-2 text-sm bg-blue-100 rounded-lg text-blue-700 font-semibold">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
