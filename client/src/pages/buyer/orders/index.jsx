// import { useStateProvider } from "../../../context/StateContext";
// import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
// import axios from "axios";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// function Orders() {
//   const [{ userInfo }] = useStateProvider();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hasFetched, setHasFetched] = useState(false);

//   useEffect(() => {
//     if (!userInfo || hasFetched) return;

//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axios.get(GET_BUYER_ORDERS_ROUTE, {
//           withCredentials: true,
//         });

//         setOrders(data.orders || []);
//         setHasFetched(true);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [userInfo, hasFetched]);

//   return (
//     <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-10 lg:px-20 bg-white dark:bg-gray-900">
//       <h3 className="mb-6 text-2xl font-semibold text-center text-gray-800 dark:text-white">
//         All Your Orders
//       </h3>

//       {loading ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-center text-gray-500 dark:text-gray-400">No orders found.</p>
//       ) : (
//         <div className="w-full overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
//           <table className="w-full min-w-[800px] text-sm text-left text-gray-700 dark:text-gray-300">
//             <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
//               <tr>
//                 <th className="px-4 py-3">Order Id</th>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Price</th>
//                 <th className="px-4 py-3">View Gig</th>
//                 <th className="px-4 py-3">Order Date</th>
//                 <th className="px-4 py-3">Send Message</th>
//                 <th className="px-4 py-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr
//                   key={order.id}
//                   className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
//                 >
//                   <td className="px-4 py-4">{order.id}</td>
//                   <td className="px-4 py-4 font-medium">{order.gig?.title}</td>
//                   <td className="px-4 py-4">₹{order.price}</td>
//                   <td className="px-4 py-4">
//   {order.gig?.id ? (
//     <Link
//       href={`/gig/${order.gig.id}`}
//       className="text-blue-600 hover:underline"
//     >
//       View Gig
//     </Link>
//   ) : (
//     <span className="text-gray-500">Unavailable</span>
//   )}
// </td>
//                   <td className="px-4 py-4">{order.createdAt?.split("T")[0]}</td>
//                   <td className="px-4 py-4">
//                     <Link
//                       href={`/buyer/orders/messages/${order.id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Send
//                     </Link>
//                   </td>
//                   <td className="px-4 py-4">{order.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Orders;
import { useStateProvider } from "../../../context/StateContext";
import { GET_BUYER_ORDERS_ROUTE } from "../../../utils/constants";
import { GET_SELLER_ORDERS_ROUTE } from "../../../utils/constants";
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
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border rounded-xl shadow px-4 py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={order.gig?.createdBy?.profileImage || "/user.png"}
                  alt="seller"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    You ordered{" "}
                    <b className="text-black hover:underline">{order.gig?.title || "Unknown Gig"}</b>{" "}
                    from{" "}
                    <Link
                      href={`/profile/${order.gig?.createdBy?.username || ""}`}
                      className="text-green-600"
                    >
                      {order.gig?.createdBy?.username || "Unknown"}
                    </Link>
                  </p>
                  <span className="text-gray-500 text-sm">
                    {timeAgo(order.createdAt)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Status: <b>{order.status}</b> | Price: ₹{order.price} | Delivery:{" "}
                    {order.gig?.deliveryTime || "-"} days
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                <Link
                  href={`/gig/${order.gig?.id}`}
                  className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800"
                >
                  View Gig
                </Link>
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

export default BuyerOrders;
