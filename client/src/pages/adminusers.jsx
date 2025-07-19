import { useStateProvider } from "../context/StateContext";
import { ALL_USERS_ROUTE, DELETE_USER_ROUTE} from "../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Adminusers() {
  const [users, setusers] = useState([]);
  const [{ userInfo }] = useStateProvider();
  useEffect(() => {
    const getusers = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(ALL_USERS_ROUTE, { withCredentials: true });
        setusers(users);
        console.log(users);
      } catch (err) {
        console.error(err);
      }
    };
      getusers();
    }, []);
  
  const del=async(userid)=>{
    try {
      const new_user_list=await axios.get(`${DELETE_USER_ROUTE}?userId=${userid}`, { withCredentials: true });
      setgigs(new_user_list);
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
                User Id
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
{/*               <th scope="col" className="px-6 py-3">
                Gigs
              </th> */}
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((users) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50"
                  key={users.id}
                >
                  <th scope="row" className="px-6 py-4 ">
                    {users.id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium">
                    {users.email}
                  </th>
                  <td className="px-6 py-4">
                    <Link href={`/profile/${users.username}`} className="text-blue-600 hover:underline">
                      {users.username}
                    </Link>
                </td>
                <td className="px-6 py-4">
                    <button onClick={()=> del(users.id)}>
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

export default Adminusers;
