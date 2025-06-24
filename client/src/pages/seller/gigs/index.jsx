import { GET_USER_GIGS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function GigsIndex() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserGigs = async () => {
      try {
        setLoading(true);
        const {
          data: { gigs: gigsData },
        } = await axios.get(GET_USER_GIGS_ROUTE, {
          withCredentials: true,
        });
        setGigs(gigsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserGigs();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-12 lg:px-24">
      <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        All Your Gigs
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : gigs.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any gigs yet.</p>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">ETA</th>
                <th className="px-6 py-3 text-right">Edit</th>
                {/* <th className="px-6 py-3 text-right">Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {gigs.map(({ title, category, price, deliveryTime, id }) => (
                <tr
                  key={id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {title}
                  </td>
                  <td className="px-6 py-4">{category}</td>
                  <td className="px-6 py-4">₹{price}</td>
                  <td className="px-6 py-4">{deliveryTime} days</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/seller/gigs/${id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  {/* Optional delete button logic:
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GigsIndex;
