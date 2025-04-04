import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiUsers,
  FiBook,
  FiArrowRight,
  FiHash,
} from "react-icons/fi";
import { MdSchool, MdWorkspacesOutline } from "react-icons/md";
import axiosInstance from "../../config/axiosConfig";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useChatContext } from "../../context/ChatProvider";
import { Link } from "react-router-dom";

const AllCommunity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  const curruser = useSelector((state) => state.user);
  const { currSelectedChat, setCurrSelectedChat } = useChatContext();
   
  const handleFetchAllCommunities = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/community`);
      setCommunities(res.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async (id) => {
 
    try {
      setIsLoading(true);
      const res = await axiosInstance.put(`/community/join/${id}`);
      toast.success("Joined community successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to join community!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAllCommunities();
  }, []);

  const filteredCommunities =
    communities &&
    communities?.filter(
      (community) =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        community.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-800 to-teal-700 py-2 text-transparent bg-clip-text mb-3">
            Explore Learning Communities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join vibrant communities of learners, educators, and experts to
            enhance your knowledge journey.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-teal-400" size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-800 rounded-xl bg-white shadow-sm focus:ring-2 outline-none focus:ring-teal-500"
            placeholder="Search communities by name, topic or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Community Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden h-64"
              >
                <div className="shimmer h-full w-full"></div>
              </div>
            ))
          ) : filteredCommunities.length > 0 ? (
            filteredCommunities?.map((community) => (
              <Link 
               to={`/community/dashboard`}
                onClick={() => setCurrSelectedChat(community)}
                key={community._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-teal-50"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="p-3 bg-teal-50 rounded-lg mr-4">
                      {community.icon === "academic" ? (
                        <MdSchool className="text-teal-600" size={24} />
                      ) : community.icon === "professional" ? (
                        <MdWorkspacesOutline
                          className="text-teal-600"
                          size={24}
                        />
                      ) : (
                        <FiHash className="text-teal-600" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-teal-900">
                        {community.name}
                      </h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full mt-1">
                        {community.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-5">{community.description}</p>
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center text-sm text-teal-600">
                      <FiUsers className="mr-1" />
                      <span>{community.memberCount} members</span>
                    </div>
                    <div className="flex items-center text-sm text-teal-600">
                      <FiBook className="mr-1" />
                      {/* <span>{community.courses} courses</span> */}
                    </div>
                  </div>
                  <button
                    disabled={community.members.some(
                      (member) => member._id === curruser._id
                    )}
                    onClick={() => handleJoinCommunity(community._id)}
                    className={`w-full flex items-center justify-center py-2 px-4 rounded-lg font-medium transition-colors ${
                      community.members.some(
                        (member) => member._id === curruser._id
                      )
                        ? "bg-gradient-to-r from-teal-600 to-teal-800 opacity-50 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-teal-600 to-teal-800 text-white"
                    }`}
                  >
                    {community.members.some(
                      (member) => member._id === curruser._id
                    )
                      ? "Joined"
                      : "Join Community"}
                    {community.members.some(
                      (member) => member._id === curruser._id
                    ) && <FiArrowRight className="ml-2" />}
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <MdWorkspacesOutline
                className="mx-auto text-teal-300"
                size={48}
              />
              <h3 className="mt-4 text-lg font-medium text-teal-800">
                No communities found
              </h3>
              <p className="mt-1 text-white">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCommunity;
