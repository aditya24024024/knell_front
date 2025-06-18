import React, { useEffect, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import axios from "axios";
import { ADD_MESSAGE, GET_MESSAGES } from "../../utils/constants";
import { useRouter } from "next/router";
import { useStateProvider } from "../../context/StateContext";

function MessageContainer() {
  const router = useRouter();
  const { orderId } = router.query;
  const [{ userInfo }] = useStateProvider();

  const [recipentId, setRecipentId] = useState(undefined);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages: dataMessages, recipentId: recipent },
      } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
        withCredentials: true,
      });
      setMessages(dataMessages);
      setRecipentId(recipent);
    };
    if (orderId && userInfo) {
      getMessages();
    }
  }, [orderId, userInfo]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") sendMessage();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const sendMessage = async () => {
    if (messageText.trim().length) {
      const response = await axios.post(
        `${ADD_MESSAGE}/${orderId}`,
        { message: messageText, recipentId },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setMessages([...messages, response.data.message]);
        setMessageText("");
      }
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] w-full px-2 sm:px-4 md:px-8 pt-4 sm:pt-10">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white dark:bg-gray-800 shadow-lg border w-full max-w-5xl rounded-lg flex flex-col px-3 py-4 sm:px-6 sm:py-6">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 max-h-[65vh] sm:max-h-[70vh]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === userInfo.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 break-words max-w-[75%] sm:max-w-[60%] ${
                    message.senderId === userInfo.id
                      ? "bg-[#1DBF73] text-white"
                      : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-800"
                  }`}
                >
                  <p>{message.text}</p>
                  <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-1">
                    <span>{formatTime(message.createdAt)}</span>
                    {message.senderId === userInfo.id && message.isRead && (
                      <BsCheckAll className="text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              className="flex-grow rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1DBF73] bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="bg-[#1DBF73] hover:bg-[#17a863] text-white rounded-full p-3 transition duration-200"
              onClick={sendMessage}
            >
              <FaRegPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
