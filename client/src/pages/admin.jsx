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
      } catch (err) {
        console.error(err);
      }
    };
      getgigs();
    }, []);
  
  const del=async(gigid)=>{
    try {
      const new_order_list=await axios.get(`${DELETE_GIG}?gigId=${gigid}`, { withCredentials: true });
      setgigs(new_order_list);
    } catch (err) {
      console.error(err);
    }
  }

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
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
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
                <td className="px-6 py-4">
                    <button onClick={()=> del(gigs.id)}>
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

export default Admin;
