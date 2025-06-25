import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Orders() {
  const [{ userInfo }] = useStateProvider();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!userInfo || hasFetched) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
          withCredentials: true,
        });

        setOrders(data.orders || []);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, hasFetched]);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-10 lg:px-20 bg-white dark:bg-gray-900">
      <h3 className="mb-6 text-2xl font-semibold text-center text-gray-800 dark:text-white">
        All Your Orders
      </h3>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between bg-white border rounded-xl shadow px-4 py-4 dark:bg-gray-800 dark:border-gray-700"
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
                      className="text-blue-600 hover:underline"
                    >
                      {order.gig?.createdBy?.username || "Unknown"}
                    </Link>
                  </p>
                  <span className="text-gray-500 text-sm">
                    Gig: {order.gig?.title || "Untitled"} | ₹{order.price}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ordered on: {order.createdAt?.split("T")[0]} | Status: {order.status}
                  </span>
                </div>
              </div>

              <div>
                <Link
                  href={`/buyer/orders/messages/${order.id}`}
                  className="px-4 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800"
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
