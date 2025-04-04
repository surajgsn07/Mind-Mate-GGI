import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { FaRobot, FaChartBar, FaGamepad, FaHeartbeat, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaFaceSmile, FaNotdef, FaPerson } from "react-icons/fa6";
import { SiCodementor } from "react-icons/si";
import { FaFileVideo } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa6";

const SideBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const currUser = useSelector((state) => state.user);
  const tabs = [
    { name: (currUser)?currUser?.name:"", icon: <FaFaceSmile />, path: "/" },
    { name: "ChatBot", icon: <FaRobot />, path: "/chat" },
    { name: "Analysis", icon: <FaChartBar />, path: "/analysis" },
    {name:"Community" , icon:<FaPerson/> , path:"/community"},
    { name: "Mentor", icon: <SiCodementor />, path: "/mentors" },
    {name:"Mock Interview" , icon: <FaFileVideo />, path:"/mockInterview"},
    {name:"Quiz",icon:<FaGamepad/>,path:"/quiz"},
    {name :"Notes" , icon:<FaNotesMedical/> , path:'/notes'}
  ];

  return (
    <div className="relative flex h-screen w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <motion.nav
        initial={{ x: -200, opacity: 0 }}
        animate={isOpen ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg w-64 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button */}
        <button
          className="text-white p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all absolute top-4 right-4"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>
        <div className="flex flex-col p-6 space-y-4">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              onClick={() => setIsOpen(false)} // Close sidebar on click
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 text-lg font-medium ${
                location.pathname === tab.path ? "bg-gray-800" : ""
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Hamburger Menu */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 text-white p-3 bg-gray-900 rounded-full hover:bg-gray-700 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 transition-all duration-300 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SideBar;
