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
        <div className="w-full overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[800px] text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Order Id</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Order Date</th>
                <th className="px-4 py-3">Send Message</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-4">{order.id}</td>
                  <td className="px-4 py-4 font-medium">{order.gig?.title}</td>
                  <td className="px-4 py-4">₹{order.price}</td>
                  <td className="px-4 py-4">
                    {order.gig?.createdBy?.username ? (
                      <Link
                        href={`/profile/${order.gig.createdBy.username}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.gig.createdBy.username}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-4 py-4">{order.createdAt?.split("T")[0]}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/buyer/orders/messages/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Send
                    </Link>
                  </td>
                  <td className="px-4 py-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;
