import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// import img from "../../../../public/user.png";

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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const {
          data: { orders },
        } = await axios.get(GET_SELLER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) getOrders();
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
                  src={order.buyer?.profileImage || "/user.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    Order for <b>{order.gig.title}</b>
                  </p>
                  <span className="text-sm text-gray-600">
                    ₹{order.price} • {order.gig.category} • Delivery:{" "}
                    {order.gig.deliveryTime} day(s)
                  </span>
                  <span className="text-gray-500 text-sm">
                    Ordered {timeAgo(order.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                {order.buyer?.username && (
                  <Link
                    href={`/profile/${order.buyer.username}`}
                    className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg"
                  >
                    {order.buyer.username}
                  </Link>
                )}
                <Link
                  href={`/buyer/orders/messages/${order.id}`}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
