import React, { useState } from "react";
import {
  FiMessageSquare,
  FiPlus,
  FiMenu,
  FiSearch,
  FiUsers,
  FiStar,
  FiMoreVertical,
} from "react-icons/fi";
import { BsChatLeftText, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import ModalWrapper from "../../components/common/ModalWrapper";
import { RiCommunityLine } from "react-icons/ri";
import CreateCommunity from "./CreateCommunity";
import MessageArea from "./components/MessageArea";
import ChatArea from "./components/ChatArea";
import AllChats from "./components/AllChats";

const CommunityDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // Sample data
 



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-teal-600 text-white shadow-lg"
      >
        <FiMenu size={20} />
      </button>

      {/* Side Drawer */}
      <div
        className={`${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transform transition-transform duration-300 fixed md:static 
          inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-10 flex flex-col`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-teal-800 to-teal-900">
          <div className="flex items-center">
            <RiCommunityLine className="text-white mr-2" size={24} />
            <h2 className="text-xl font-semibold text-white">My Communities</h2>
          </div>
          <button className="text-teal-100 hover:text-white">
            <FiSearch size={20} />
          </button>
        </div>

        {/* Create Community Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setOpenModal(true)}
            className="w-full flex items-center justify-center py-2 px-4 rounded-lg 
            bg-gradient-to-r from-teal-700 to-teal-800 text-white font-medium
            hover:from-teal-800 hover:to-teal-900 transition-all shadow-md"
          >
            <FiPlus className="mr-2" />
            Create Community
          </button>
        </div>

        {/* Community List */}
       <AllChats />

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white">
            <span>U</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">User Name</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <ChatArea />
      <ModalWrapper open={openModal} setOpenModal={setOpenModal}>
        <CreateCommunity onClose={() => setOpenModal(false)} />
      </ModalWrapper>
    </div>
  );
};

export default CommunityDashboard;
