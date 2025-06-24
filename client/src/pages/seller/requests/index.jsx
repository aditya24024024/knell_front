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

function Requests() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const {
          data: { orders },
        } = await axios.get(GET_SELLER_REQUEST_ORDERS_ROUTE, {
          withCredentials: true,
        });
        setOrders(orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  const decline = async (orderId) => {
    try {
      const {
        data: { orders },
      } = await axios.get(`${DECLINE_ROUTE}?orderId=${orderId}`, {
        withCredentials: true,
      });
      setOrders(orders);
    } catch (err) {
      console.error(err);
    }
  };

  const accept = async (orderId) => {
    try {
      const {
        data: { orders },
      } = await axios.put(
        ORDER_SUCCESS_ROUTE,
        { orderId },
        { withCredentials: true }
      );
      setOrders(orders);
    } catch (err) {
      console.error(err);
    }
  };

  const complete = async (orderId) => {
    try {
      const {
        data: { orders },
      } = await axios.put(
        ORDER_COMPLETE_ROUTE,
        { orderId },
        { withCredentials: true }
      );
      setOrders(orders);
    } catch (err) {
      console.error(err);
    }
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
        <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Order Id</th>
                <th className="px-4 py-3 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Category</th>
                <th className="px-4 py-3 whitespace-nowrap">Price</th>
                <th className="px-4 py-3 whitespace-nowrap">Delivery Time</th>
                <th className="px-4 py-3 whitespace-nowrap">Order Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Buyer</th>
                <th className="px-4 py-3 whitespace-nowrap">Send Message</th>
                <th className="px-4 py-3 whitespace-nowrap">Accept</th>
                <th className="px-4 py-3 whitespace-nowrap">Decline</th>
                <th className="px-4 py-3 whitespace-nowrap">Complete</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-4">{order.id}</td>
                  <td className="px-4 py-4 font-medium">{order.gig.title}</td>
                  <td className="px-4 py-4">{order.gig.category}</td>
                  <td className="px-4 py-4">{order.price}</td>
                  <td className="px-4 py-4">{order.gig.deliveryTime}</td>
                  <td className="px-4 py-4">{order.createdAt?.split("T")[0]}</td>
                  <td className="px-4 py-4">{order.status}</td>

                  {/* ✅ New Buyer column */}
                  <td className="px-4 py-4">
                    {order.buyer?.username ? (
                      <Link
                        href={`/profile/${order.buyer.username}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.buyer.username}
                      </Link>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/buyer/orders/messages/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Send
                    </Link>
                  </td>

                  <td className="px-4 py-4">
                    {order.status === "Request Accepted" ? (
                      <span className="text-green-600">Accepted</span>
                    ) : (
                      <button
                        onClick={() => accept(order.id)}
                        className="text-green-600 hover:underline"
                      >
                        Accept
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {order.status === "Request Accepted" ? (
                      <span className="text-gray-400">Accepted</span>
                    ) : (
                      <button
                        onClick={() => decline(order.id)}
                        className="text-red-600 hover:underline"
                      >
                        Decline
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {order.status === "Request Accepted" ? (
                      <button
                        onClick={() => complete(order.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <span className="text-gray-400">Accept first</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Requests;
