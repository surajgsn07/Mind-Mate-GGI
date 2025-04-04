import React, { useEffect, useState } from "react";
import {
  FiMessageSquare,
  FiPlus,
  FiMenu,
  FiSearch,
  FiUsers,
  FiStar,
  FiMoreVertical,
} from "react-icons/fi";
import axiosInstance from "../../../config/axiosConfig";
import { useSelector } from "react-redux";
import { useChatContext } from "../../../context/ChatProvider";
export default function AllChats() {
  const currUser = useSelector((state) => state.user);
  const { allChats, setAllChats,currSelectedChat ,setCurrSelectedChat} = useChatContext();
  const [loading, setLoading] = useState(false);

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/community/user`);
      setAllChats(response.data?.data);
    } catch (error) {
      console.error("Error fetching all chats:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, [currUser]);
 
  return (
    <div className="flex-1 overflow-y-auto">
      {allChats.map((community) => (
        <div
          key={community._id}
          onClick={() => setCurrSelectedChat(community)}
          className={`p-4 border-b border-gray-100 cursor-pointer flex items-center
          ${
            currSelectedChat?._id === community._id
              ? "bg-teal-50 border-l-4 border-l-teal-500"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800">
            <FiUsers size={18} />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-900 truncate">
                {community.name}
                {community.isFavorite && (
                  <FiStar className="inline ml-1 text-yellow-400" size={14} />
                )}
              </p>
              {community.unread > 0 && (
                <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {community.unread}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {community.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
