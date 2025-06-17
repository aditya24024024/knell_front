import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(GET_BUYER_ORDERS_ROUTE, {
          withCredentials: true,
        });
        console.log("Fetched orders:", response.data.orders); // Debug
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    if (userInfo) getOrders();
  }, [userInfo]);

  if (!userInfo) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 sm:px-6 md:px-10 lg:px-20 bg-white dark:bg-gray-900">
      <h3 className="mb-6 text-2xl font-semibold text-center md:text-left text-gray-800 dark:text-white">
        All Your Orders
      </h3>

      <div className="w-full overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[700px] text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Order Id</th>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Price</th>
              <th className="px-4 py-3 whitespace-nowrap">Order Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Send Message</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-4">{order.id}</td>
                  <td className="px-4 py-4 font-medium">{order.gig?.title}</td>
                  <td className="px-4 py-4">{order.price}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-4 py-6 text-gray-500 dark:text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;

