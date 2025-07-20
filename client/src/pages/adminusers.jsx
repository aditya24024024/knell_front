import { useStateProvider } from "../context/StateContext";
import { ALL_USERS_ROUTE, DELETE_USER_ROUTE, VERIFY_USER_ROUTE } from "../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Adminusers() {
  const [users, setusers] = useState([]);
  const [{ userInfo }] = useStateProvider();

useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const { data } = await axios.get(ALL_USERS_ROUTE, { withCredentials: true });
    setusers(data.users);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};


const del = async (userid) => {
  try {
    await axios.get(`${DELETE_USER_ROUTE}?userId=${userid}`, { withCredentials: true });
    fetchUsers();
  } catch (err) {
    console.error(err);
  }
};

const verifyUser = async (userId) => {
  try {
    await axios.post(
      VERIFY_USER_ROUTE,
      { userIdToVerify: userId },
      { withCredentials: true }
    );
    fetchUsers(); // refresh list
  } catch (err) {
    console.error("Verification error:", err.response?.data || err.message);
  }
};




  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All Users</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">User Id</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Verify</th>
              <th className="px-6 py-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <Link href={`/profile/${user.username}`} className="text-blue-600 hover:underline">
                    {user.username}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  {user.isSocialLogin ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!user.isSocialLogin && (
                    <button
                      className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => verifyUser(user.id)}
                    >
                      Verify
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => del(user.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Adminusers;
