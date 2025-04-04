import React, { useState } from "react";
import { FiPlusCircle, FiX, FiBook, FiUsers, FiHash } from "react-icons/fi";
import { MdOutlineSchool, MdOutlinePublic } from "react-icons/md";
import axiosInstance from "../../config/axiosConfig";
import toast from "react-hot-toast";

const CreateCommunity = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    privacy: "public",
    tags: [],
    newTag: "",
  });
  const [loading, setLoading] = useState(false);
  const categories = [
    {
      value: "academic",
      label: "Academic Subjects",
      icon: <MdOutlineSchool />,
    },
    { value: "professional", label: "Professional Skills", icon: <FiBook /> },
    { value: "technology", label: "Technology", icon: <FiHash /> },
    { value: "language", label: "Language Learning", icon: <FiUsers /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.description || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/community/new", formData);
      console.log(response);
      toast.success("Community created successfully!");
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating community:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create community";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <FiPlusCircle className="text-white mr-3" size={24} />
          <h2 className="text-xl font-semibold text-white">
            Create New Community
          </h2>
        </div>
        <button onClick={onClose} className="text-teal-200 hover:text-white">
          <FiX size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Community Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Community Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="e.g. Advanced Data Science"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="What's this community about?"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <label
                key={cat.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  formData.category === cat.value
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-300 hover:border-teal-300"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <span className="text-teal-600 mr-2">{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-teal-700 to-teal-800 text-white rounded-lg hover:from-teal-800 hover:to-teal-900 transition-all flex items-center"
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                "Create Community
                <FiPlusCircle className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
