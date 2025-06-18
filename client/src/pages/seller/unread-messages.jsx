import { useStateProvider } from "../../context/StateContext";
import { GET_UNREAD_MESSAGES, MARK_AS_READ_ROUTE } from "../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function UnreadMessages() {
  const [{ userInfo }] = useStateProvider();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getUnreadMessages = async () => {
      const {
        data: { messages: unreadMessages },
      } = await axios.get(GET_UNREAD_MESSAGES, { withCredentials: true });
      setMessages(unreadMessages);
    };
    if (userInfo) getUnreadMessages();
  }, [userInfo]);

  const markAsRead = async (id) => {
    const response = await axios.put(
      `${MARK_AS_READ_ROUTE}/${id}`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      const updated = messages.filter((msg) => msg.id !== id);
      setMessages(updated);
    }
  };

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-4 sm:px-32">
      <h3 className="m-5 text-2xl font-semibold text-center sm:text-left">All your Unread Messages</h3>

      {/* Desktop table view */}
      <div className="relative overflow-x-auto hidden sm:block shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Text</th>
              <th className="px-6 py-3">Sender Name</th>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3"><span className="sr-only">Mark as Read</span></th>
              <th className="px-6 py-3"><span className="sr-only">View Conversation</span></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr
                key={message.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">{message.text}</td>
                <td className="px-6 py-4">{message.sender?.fullName}</td>
                <td className="px-6 py-4">{message.orderId}</td>
                <td className="px-6 py-4 text-blue-600">
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      markAsRead(message.id);
                    }}
                    className="hover:underline"
                  >
                    Mark as Read
                  </Link>
                </td>
                <td className="px-6 py-4 text-blue-600">
                  <Link
                    href={`/seller/orders/messages/${message.orderId}`}
                    className="hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-2"><span className="font-semibold">Text:</span> {message.text}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-2"><span className="font-semibold">Sender:</span> {message.sender?.fullName}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4"><span className="font-semibold">Order ID:</span> {message.orderId}</p>
            <div className="flex justify-between">
              <button
                onClick={() => markAsRead(message.id)}
                className="text-blue-600 hover:underline"
              >
                Mark as Read
              </button>
              <Link
                href={`/seller/orders/messages/${message.orderId}`}
                className="text-blue-600 hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnreadMessages;
