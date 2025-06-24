import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
        <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Order Id</th>
                <th className="px-4 py-3 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Category</th>
                <th className="px-4 py-3 whitespace-nowrap">Price</th>
                <th className="px-4 py-3 whitespace-nowrap">Delivery Time</th>
                <th className="px-4 py-3 whitespace-nowrap">Order Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Buyer</th>
                <th className="px-4 py-3 whitespace-nowrap">Send Message</th>
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

                  {/* ✅ Buyer username with link */}
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
