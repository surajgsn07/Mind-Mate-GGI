import React from "react";
import { FaSpinner } from "react-icons/fa";

const AnalyzingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-20 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 text-white rounded-2xl shadow-xl">
        <FaSpinner className="w-16 h-16 animate-spin text-blue-500" />
        <p className="mt-4 text-lg font-semibold">Analyzing data...</p>
      </div>
    </div>
  );
};

export default AnalyzingModal;
