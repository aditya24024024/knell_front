import { useStateProvider } from "../../../context/StateContext";
import { GET_SELLER_ORDERS_ROUTE , DECLINE_ROUTE, ORDER_SUCCESS_ROUTE,ORDER_COMPLETE_ROUTE} from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Requests() {
  const [orders, setOrders] = useState([]);
  const [{ userInfo }] = useStateProvider();
  useEffect(() => {
    const getOrders = async () => {
      try {
        const {
          data: { orders },
        } = await axios.get(GET_SELLER_ORDERS_ROUTE, { withCredentials: true });
        setOrders(orders);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) getOrders();
  }, [userInfo,orders]);
  
  const decline=async(orderid)=>{
    try {
      // console.log(orderid)
      const new_order_list=await axios.get(`${DECLINE_ROUTE}?orderId=${orderid}`, { withCredentials: true });
      setOrders(new_order_list);
    } catch (err) {
      console.error(err);
    }
  }
  const accept=async(orderid)=>{
    try {
      const new_order_list=await axios.put(ORDER_SUCCESS_ROUTE,{orderId:orderid}, { withCredentials: true });
      setOrders(new_order_list);
    } catch (err) {
      console.error(err);
    }
  }
  const complete=async(orderid)=>{
    try {
      const new_order_list=await axios.put(ORDER_COMPLETE_ROUTE,{orderId:orderid}, { withCredentials: true });
      setOrders(new_order_list);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Send Message
              </th>
              <th scope="col" className="px-6 py-3">
                Accept Request
              </th>
              <th scope="col" className="px-6 py-3">
                Decline Request
              </th>
              <th scope="col" className="px-6 py-3">
                Completed?
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={order.id}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {order.id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {order.gig.title}
                  </th>
                  <td className="px-6 py-4">{order.gig.category}</td>
                  <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">{order.gig.deliveryTime}</td>
                  <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
                  <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4 ">
                    <Link
                      href={`/buyer/orders/messages/${order.id}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Send
                    </Link>
                  </td>
                <td className="px-6 py-4">
                  {order.status==="Request Accepted"?
                  "Request Accepted":
                  <button onClick={()=> accept(order.id)}>
                  Accept Request
                  </button>
                  }
                </td>
                <td className="px-6 py-4">
                  {order.status==="Request Accepted"?
                    "Request is accepted now":
                    <button onClick={()=> decline(order.id)}>
                  Decline Request
                  </button>}
                </td>
                <td className="px-6 py-4">
                  {order.status==="Request Accepted"?
                    <button onClick={()=> complete(order.id)}>
                  Mark as Completed
                  </button>:
                  "Accept the request first"}
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Requests;