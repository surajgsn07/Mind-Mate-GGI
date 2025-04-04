import { useEffect } from "react";
import { motion } from "framer-motion";

const SosModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center"
      >
        <h2 className="text-2xl font-bold text-red-600">🚨 SOS Sent!</h2>
        <p className="mt-3 text-gray-700">
          Stay calm. Your loved ones have been notified and will reach out soon.
          You are not alone. 💙
        </p>
        <button
          onClick={onClose}
          className="mt-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Okay
        </button>
      </motion.div>
    </div>
  );
};

export default SosModal;
