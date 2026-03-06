import { useStateProvider } from "../../../context/StateContext";
import {
  GET_SELLER_REQUEST_ORDERS_ROUTE,
  DECLINE_ROUTE,
  ORDER_SUCCESS_ROUTE,
  ORDER_COMPLETE_ROUTE,
} from "../../../utils/constants";
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

function Requests() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const { data: { orders } } = await axios.get(GET_SELLER_REQUEST_ORDERS_ROUTE, { withCredentials: true });
        setOrders(orders);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  const decline = async (orderId) => {
    try {
      await axios.get(`${DECLINE_ROUTE}?orderId=${orderId}`, { withCredentials: true });
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {}
  };

  const accept = async (orderId) => {
    try {
      await axios.put(ORDER_SUCCESS_ROUTE, { orderId }, { withCredentials: true });
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {}
  };

  const markDelivered = async (orderId) => {
    try {
      await axios.put(ORDER_COMPLETE_ROUTE, { orderId }, { withCredentials: true });
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-12 lg:px-24">
      <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        All Your Order Requests
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No order requests found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between bg-white border rounded-xl shadow px-4 py-4">
              <div className="flex items-center gap-4">
                <img src={order.buyer?.profileImage || "/user.png"} alt="Profile" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    <Link href={`/profile/${order.buyer?.username || ""}`} className="text-black hover:underline">
                      {order.buyer?.username || "Unknown"}
                    </Link>{" "}
                    has requested your service: <b>{order.gig.title}</b>
                  </p>
                  <span className="text-gray-500 text-sm">{timeAgo(order.createdAt)}</span>
                  <span className="text-sm text-gray-600">
                    Category: {order.gig.category} | Price: ₹{order.price} | Delivery: {order.gig.deliveryTime} days
                  </span>
                  {/* Status badge */}
                  <span className={`text-xs font-semibold mt-1 w-fit px-2 py-0.5 rounded-full ${
                    order.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Request Accepted' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-end items-center">
                <Link href={`/buyer/orders/messages/${order.id}`} className="px-4 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800">
                  Message
                </Link>

                {/* Paid → show Accept/Decline */}
                {order.status === 'Paid' && (
                  <>
                    <button onClick={() => accept(order.id)} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                      Accept
                    </button>
                    <button onClick={() => decline(order.id)} className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">
                      Decline
                    </button>
                  </>
                )}

                {/* Request Accepted → show Mark Delivered */}
                {order.status === 'Request Accepted' && (
                  <button onClick={() => markDelivered(order.id)} className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg">
                    Mark Delivered
                  </button>
                )}

                {/* Delivered → waiting for buyer */}
                {order.status === 'Delivered' && (
                  <span className="text-blue-600 font-semibold text-sm">
                    ✓ Delivered — Waiting for buyer
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

export default Requests;