import { useStateProvider } from "../../context/StateContext";
import { GET_UNREAD_MESSAGES, MARK_AS_READ_ROUTE } from "../../utils/constants";
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

function UnreadMessages() {
  const [{ userInfo }] = useStateProvider();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) return;

    const getUnreadMessages = async () => {
      try {
        const { data } = await axios.get(GET_UNREAD_MESSAGES, {
          withCredentials: true,
        });
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching unread messages", err);
      } finally {
        setLoading(false);
      }
    };

    getUnreadMessages();
  }, [userInfo]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${MARK_AS_READ_ROUTE}/${id}`, {}, { withCredentials: true });
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error("Failed to mark message as read", err);
    }
  };

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 md:px-12 lg:px-24">
      <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        Your Unread Messages
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500">No unread messages.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-center justify-between bg-white border rounded-xl shadow px-4 py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={message.sender?.profileImage || "/user.png"}
                  alt="Sender"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-semibold">
                    Message from{" "}
                    <Link
                      href={`/profile/${message.sender?.username || ""}`}
                      className="text-green-600 hover:underline"
                    >
                      {message.sender?.username || "Unknown"}
                    </Link>
                  </p>
                  <span className="text-sm text-gray-600">
                    {message.text}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Sent {timeAgo(message.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => markAsRead(message.id)}
                  className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded-lg"
                >
                  Mark as Read
                </button>
                <Link
                  href={`/buyer/orders/messages/${message.orderId}`}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UnreadMessages;
