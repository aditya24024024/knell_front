import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE, ORDER_BUYER_COMPLETE_ROUTE } from "../../../utils/constants";
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

function BuyerOrders() {
  const [{ userInfo }] = useStateProvider();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!userInfo || hasFetched) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(data.orders || []);
        setHasFetched(true);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo, hasFetched]);

  const markComplete = async (orderId) => {
    try {
      await axios.put(ORDER_BUYER_COMPLETE_ROUTE, { orderId }, { withCredentials: true });
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {}
  };

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
            <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border rounded-xl shadow px-4 py-4">
              <div className="flex items-center gap-4">
                <img src={order.gig?.createdBy?.profileImage || "/user.png"} alt="seller" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    You ordered <b>{order.gig?.title || "Unknown Gig"}</b> from{" "}
                    <Link href={`/profile/${order.gig?.createdBy?.username || ""}`} className="text-green-600">
                      {order.gig?.createdBy?.username || "Unknown"}
                    </Link>
                  </p>
                  <span className="text-gray-500 text-sm">{timeAgo(order.createdAt)}</span>
                  <span className="text-sm text-gray-600">
                    Price: ₹{order.price} | Delivery: {order.gig?.deliveryTime || "-"} days
                  </span>
                  {/* Status badge */}
                  <span className={`text-xs font-semibold mt-1 w-fit px-2 py-0.5 rounded-full ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Request Accepted' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-end items-center">
                <Link href={`/gig/${order.gig?.id}`} className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800">
                  View Gig
                </Link>
                <Link href={`/buyer/orders/messages/${order.id}`} className="px-4 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800">
                  Message
                </Link>
                {/* Mark Complete button — only shown when seller has delivered */}
                {order.status === 'Delivered' && (
                  <button
                    onClick={() => markComplete(order.id)}
                    className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                  >
                    ✓ Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyerOrders;