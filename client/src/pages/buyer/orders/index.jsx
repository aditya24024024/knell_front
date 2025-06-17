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
        const {
          data: { orders },
        } = await axios.get(GET_BUYER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo]);

  return (
    <div className="min-h-[80vh] px-4 md:px-8 lg:px-16 pt-24 pb-12 bg-white dark:bg-gray-900">
      <h3 className="mb-6 text-xl md:text-2xl font-semibold text-center md:text-left">
        All Your Orders
      </h3>

      <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                <td className="px-4 py-4">{order.id}</td>
                <td className="px-4 py-4 font-medium">{order.gig.title}</td>
                <td className="px-4 py-4">{order.price}</td>
                <td className="px-4 py-4">
                  {order.createdAt?.split("T")[0]}
                </td>
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
    </div>
  );
}

export default Orders;
