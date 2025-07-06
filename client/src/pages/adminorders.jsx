import { useStateProvider } from "../context/StateContext";
import { ALL_ORDER_ROUTE, DELETE_ORDER_ROUTE} from "../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function AdminOders() {
  const [orders, setorders] = useState([]);
  const [{ userInfo }] = useStateProvider();
  useEffect(() => {
    const getorders = async () => {
      try {
        const {
          data: { orders },
        } = await axios.get(ALL_ORDER_ROUTE, { withCredentials: true });
        setorders(orders);
      } catch (err) {
        console.error(err);
      }
    };
      getorders();
    }, []);
  
  const del=async(orderid)=>{
    try {
      const new_order_list=await axios.get(`${DELETE_ORDER_ROUTE}?orderId=${orderid}`, { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All Orders</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order Id
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Buyer Id
              </th>
              <th scope="col" className="px-6 py-3">
                Gig Id
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((orders) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={orders.id}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {orders.id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {orders.status}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {orders.buyerId}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {orders.gigId}
                  </th>
                <td className="px-6 py-4">
                    <button onClick={()=> del(orders.id)}>
                  Delete
                  </button>
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

export default AdminOders;
