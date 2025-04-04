import React, { useContext, useEffect, useRef, useState } from "react";
import MessageArea from "./MessageArea";
import { useSocket } from "../../../context/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { useChatContext } from "../../../context/ChatProvider";
import toast from "react-hot-toast";
import { setOnlineUsers } from "../../../../store/chatSlice";
import { FiMoreVertical, FiUsers } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import axiosInstance from "../../../config/axiosConfig";
import Loader from "../../../components/common/Loader";
import { FaVideo } from "react-icons/fa";
import {Link} from "react-router-dom"

import dayjs from "dayjs";

export const formatDate = (date) => {
  const messageDate = dayjs(date);
  const today = dayjs();
  const yesterday = today.subtract(1, "day");

  if (messageDate.isSame(today, "day")) {
    return "Today";
  } else if (messageDate.isSame(yesterday, "day")) {
    return "Yesterday";
  } else {
    return messageDate.format("MMM D, YYYY");
  }
};

export default function ChatArea() {
  const socket = useSocket();
  const dispatch = useDispatch();
  // RECOIL STATES
  const currentUser = useSelector((state) => state.user);

  const onlineUsers = useSelector((state) => state.chat.onlineUsers);
  // GENERAL STATES
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSarchModalOpen, setSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currTypingUser, setCurrTypingUser] = useState(null);
  const [messageLoading, setMessageLoading] = useState(false);
  // REFERENCE STATES
  const messagesEndRef = useRef(null);
  // CHAT CONTEXT STATES
  const {
    notifications,
    setNotifications,
    setLatestMessage,
    messages,
    setMessages,
    setAllChats,
    allChatsMessages,
    currSelectedChat,
    setCurrSelectedChat,
  } = useChatContext();
  // VIDEO CALL CONTEXT STATES
  // console.log({all:allChatsMessages})
  useEffect(() => {
    if (!socket) return;

    socket.on("user online", (data) => {
      dispatch(setOnlineUsers(data));
    });

    socket.on("user offline", (data) => {
      dispatch(setOnlineUsers(data));
    });

    if (currSelectedChat) {
      socket.emit("join chat", currSelectedChat?._id);
    }

    return () => {
      // socket.off('user online');
      // socket.off('user offline');
      // socket.off('typing');
      // socket.off('stop typing');
    };
  }, [socket, currSelectedChat]);

  useEffect(() => {
    if (!socket) return;
    socket.on("typing", (data) => {
      setIsTyping(true);
      setCurrTypingUser(data);
    });
    socket.on("stop typing", (data) => {
      setIsTyping(false);
      setCurrTypingUser(null);
    });
  }, [socket, currSelectedChat]);

  // useEffect(() => {
  //   setMessages(
  //     messages?.filter(
  //       (item) => item.chat._id === currSelectedChat?._id
  //     )[0]?.messages || []
  //   );
  // }, [messages, currSelectedChat]);

  useEffect(() => {
    if (!socket || !currSelectedChat) return;

    setNotifications((prev) =>
      prev?.filter((i) => i.chat._id !== currSelectedChat?._id)
    );

    return () => {
      socket.emit("leave chat", currSelectedChat?._id);
    };
  }, [currSelectedChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = ({ newMessageReceived, chat }) => {
      const receivedChatId = newMessageReceived.chat?._id;

      // If the current selected chat is not the one receiving the message
      if (!currSelectedChat || currSelectedChat?._id !== receivedChatId) {
        const alreadyNotified = notifications?.some(
          (n) => n.chat?._id === receivedChatId
        );

        if (!alreadyNotified) {
          setNotifications((prev) => [...prev, newMessageReceived]);
          setLatestMessage(newMessageReceived);
          toast.success("New Message Received");

          // Add chat to allChats if not already present
          setAllChats((prevChats) => {
            const chatExists = prevChats.some((c) => c._id === chat._id);
            return chatExists ? prevChats : [chat, ...prevChats];
          });
        }
      } else {
        // Message belongs to currently selected chat
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [currSelectedChat, socket, notifications]);

  useEffect(() => {
    if (!isTyping) setCurrTypingUser(null);
  }, [isTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({});
  }, [messages, isTyping]);

  // const downloadFile = async (url, fileName) => {
  //   try {
  //     const response = await fetch(url, { method: "GET" });
  //     if (!response.ok) throw new Error("Failed to fetch file");

  //     const blob = await response.blob();
  //     const downloadUrl = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.download = fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(downloadUrl);
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };

  const handleFetchChatMessages = async () => {
    try {
      setMessageLoading(true);
      const res = await axiosInstance.get(
        `/community/messages/${currSelectedChat._id}`
      );

      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (!currSelectedChat) return;

    handleFetchChatMessages();
  }, [currSelectedChat]);

  return (
    <div className="flex-1 flex flex-col">
      {!currSelectedChat ? (
        <div className="flex items-center min-h-full w-full justify-center">
          <div className="flex flex-col items-center">
            <img
              className="object-cover h-32 w-32 rounded-full"
              src="https://assets.turbologo.ru/blog/ru/2022/04/15044031/156.png"
              alt=""
            />
            <h2 className="text-sm mt-4 opacity-40 font-semibold">
              START A CHAT
            </h2>
          </div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 mr-3">
                <FiUsers size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {currSelectedChat?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {currSelectedChat?.memberCount} members{" "}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={`/community/vc/${currSelectedChat?._id}`} className="text-gray-500 hover:text-teal-600">
                <FaVideo size={20} />
              </Link>
              <button className="text-gray-500 hover:text-teal-600">
                <FiUsers size={20} />
              </button>
              <button className="text-gray-500 hover:text-teal-600">
                <FiMoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {messageLoading ? (
            <div className="min-h-full w-full">
              <Loader />
            </div>
          ) : (
            <div className="flex-1 p-4  overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender?._id === currentUser?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md min-w-20 rounded-lg p-3 ${
                        msg.sender?._id === currentUser?._id
                          ? "bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-br-none"
                          : "bg-white border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {!msg.sender?._id === currentUser?._id ? (
                        <p className="text-xs font-medium text-teal-800 mb-1">
                          {msg.sender?.name}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-white mb-1">
                          {"You"}
                        </p>
                      )}

                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender?._id === currentUser?._id
                            ? "text-teal-200"
                            : "text-gray-500"
                        } text-right`}
                      >
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
            </div>
          )}
          {/* Message Input */}
          <MessageArea
            currSelectedChat={currSelectedChat}
            setMessages={setMessages}
          />
        </>
      )}
    </div>
  );
}
