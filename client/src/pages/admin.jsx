import { useStateProvider } from "../context/StateContext";
import { ADMIN_ROUTE, DELETE_GIG} from "../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Admin() {
  const [gigs, setgigs] = useState([]);
  const [{ userInfo }] = useStateProvider();
  useEffect(() => {
    const getgigs = async () => {
      try {
        const {
          data: { gigs },
        } = await axios.get(ADMIN_ROUTE, { withCredentials: true });
        setgigs(gigs);
        console.log(gigs)
      } catch (err) {
        console.error(err);
      }
    };
    console.log("ak")
    // console.log(userInfo)
    // if (userInfo) {
      // console.log("asdfghjk")
      getgigs();
    // }
      console.log("aks")
    }, []);
  
  const del=async(gigid)=>{
    try {
      // console.log(gigid)
      const new_order_list=await axios.get(`${DELETE_GIG}?gigId=${gigid}`, { withCredentials: true });
      setgigs(new_order_list);
    } catch (err) {
      console.error(err);
    }
  }
//   const accept=async(orderid)=>{
//     try {
//       const new_order_list=await axios.put(ORDER_SUCCESS_ROUTE,{orderId:orderid}, { withCredentials: true });
//       setOrders(new_order_list);
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   const complete=async(orderid)=>{
//     try {
//       const new_order_list=await axios.put(ORDER_COMPLETE_ROUTE,{orderId:orderid}, { withCredentials: true });
//       setOrders(new_order_list);
//     } catch (err) {
//       console.error(err);
//     }
//   }

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All Gigs</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Gig Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Price
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                Delivery Time
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                Order Date
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                Status
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                Send Message
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                Accept Request
              </th> */}
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Completed?
              </th> */}
            </tr>
          </thead>
          <tbody>
            {gigs.map((gigs) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={gigs.id}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {gigs.id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {gigs.title}
                  </th>
                  <td className="px-6 py-4">{gigs.category}</td>
                  {/* <td className="px-6 py-4">{order.price}</td>
                  <td className="px-6 py-4">{order.gig.deliveryTime}</td>
                  <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
                  <td className="px-6 py-4">{order.status}</td> */}
                  {/* {
                    order.status==="Request Accepted"?
                    <td className="px-6 py-4 ">
                    <Link
                      href={`/buyer/orders/messages/${order.id}`}
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Send
                    </Link>
                  </td>
                  :
                  "Can not send Message"
                }
                <td className="px-6 py-4">
                  {order.status==="Request Accepted"?
                  "Request Accepted":
                  <button onClick={()=> accept(order.id)}>
                  Accept Request
                  </button>
                  }
                </td> */}
                <td className="px-6 py-4">
                    <button onClick={()=> del(gigs.id)}>
                  Delete
                  </button>
                </td>
                {/* <td className="px-6 py-4">
                  {order.status==="Request Accepted"?
                    <button onClick={()=> complete(order.id)}>
                  Completed
                  </button>:
                  "Accept the request first"}
                </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;