import React, { useEffect, useState, useRef } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import axios from "axios";
import { useRouter } from "next/router";
import { useStateProvider } from "../../context/StateContext";
import { ADD_MESSAGE, GET_MESSAGES, HOST} from "../../utils/constants";
import { io } from "socket.io-client";

let socket;

function MessageContainer() {
  const router = useRouter();
  const { orderId } = router.query;
  const [{ userInfo }] = useStateProvider();

  const [recipentId, setRecipentId] = useState(undefined);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false); // added
  const lastSentRef = useRef(0);

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
      const isUrl = /^https?:\/\/[^\s]+$/i.test(part);
      return isUrl ? (
  <a
    key={i}
    href={part}
    target="_blank"
    rel="noopener noreferrer"
    className="underline break-all opacity-90 hover:opacity-100"
  >
    {part}
  </a>
) : (
  part
);
    });
  };

  const containsPhoneNumber = (text) => {
    const phoneRegex = /(\+?\d[\s_.-]?){9,13}\d/g;
    return phoneRegex.test(text);
  };

  const containsUPI = (text) => {
    const upiRegex = /[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}/g;
    return upiRegex.test(text);
  };

  useEffect(() => {
    if (!userInfo?.id) return;
    socket = io(HOST, { withCredentials: true });
    if (userInfo?.id) socket.emit("join", userInfo.id);
    return () => { socket.disconnect(); };
  }, [userInfo?.id]);

  useEffect(() => { 
    if (!socket || !orderId || !userInfo?.id) return;
    const getMessages = async () => {
      const {
        data: { messages: dataMessages, recipentId: recipent },
      } = await axios.get(`${GET_MESSAGES}/${orderId}`, { withCredentials: true });
      setMessages(dataMessages);
      setRecipentId(recipent);
    };
    if (orderId && userInfo) getMessages();
  }, [orderId, userInfo]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.orderId === parseInt(orderId)) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    return () => { socket.off("newMessage"); };
  }, [orderId]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isSending) sendMessage();
    }
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
    const trimmed = messageText.trim();
    if (!trimmed.length) return;
    if (isSending) return; // guard

    const now = Date.now();
    if (now - lastSentRef.current < 2000) {
      console.warn("You're sending messages too quickly!");
      return;
    }

    if (containsPhoneNumber(trimmed)) {
      alert("Phone numbers aren't allowed in messages. Please keep transactions on Knell.");
      return;
    }

    if (containsUPI(trimmed)) {
      alert("UPI IDs aren't allowed in messages. Please keep payments on Knell.");
      return;
    }

    lastSentRef.current = now;
    setIsSending(true); // lock

    try {
      const response = await axios.post(
        `${ADD_MESSAGE}/${orderId}`,
        { message: trimmed, recipentId },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setMessages((prev) => [...prev, response.data.message]);
        setMessageText("");
      }
    } catch (err) {
      console.error(err);
      lastSentRef.current = 0;
    } finally {
      setIsSending(false); // unlock always
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] w-full px-2 sm:px-4 md:px-8 pt-4 sm:pt-10">
      <div className="flex justify-center items-center h-full">
        <div className="bg-white dark:bg-gray-800 shadow-lg border w-full max-w-5xl rounded-lg flex flex-col px-3 py-4 sm:px-6 sm:py-6">

          {/* File sharing banner */}
          <div className="mb-3 px-3 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 text-xs text-yellow-800 dark:text-yellow-300">
            📁 Share raw files and deliverables via <span className="font-semibold">Google Drive</span> or <span className="font-semibold">WeTransfer</span> links. Phone numbers and off-platform payments are not allowed.
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-300 max-h-[65vh] sm:max-h-[70vh]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === userInfo.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 break-words max-w-[75%] sm:max-w-[60%] ${
                    message.senderId === userInfo.id
                      ? "bg-[#1DBF73] text-white"
                      : "bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-800"
                  }`}
                >
                  <p className="break-words">{renderMessageText(message.text)}</p>
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
              disabled={isSending}
            />
            <button
              type="button"
              className={`text-white rounded-full p-3 transition duration-200 ${
                isSending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1DBF73] hover:bg-[#17a863]"
              }`}
              onClick={sendMessage}
              disabled={isSending}
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