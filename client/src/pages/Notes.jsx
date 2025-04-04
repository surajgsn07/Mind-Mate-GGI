import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaTimes } from 'react-icons/fa';
import axiosInstance from '../config/axiosConfig';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    window.scrollTo(0,0);
    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get('/chat/notes');
        setNotes(response.data.notes || []);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, []);

  return (
    <div className="bg-gradient-to-br from-sky-100 to-indigo-100 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900">Your Summarized Notes</h1>
          <Link
            to="/summarizer"
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Summarize More
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array(4).fill().map((_, i) => (
              <div key={i} className="animate-pulse h-40 bg-white rounded-xl shadow p-4 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-700 mt-20">
            <p className="text-xl mb-4">No notes available yet.</p>
            <Link
              to="/summarizer"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Summarize Notes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedNote(note)}
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{note.title}</h2>
                <p className="text-gray-700 line-clamp-4">{note.summary}</p>
                <div className="mt-4 flex justify-end text-blue-500">
                  <FaExpand />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedNote(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
              >
                <FaTimes className="text-2xl" />
              </button>
              <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">{selectedNote.title}</h2>
              <pre className="whitespace-pre-wrap text-lg text-gray-800 leading-relaxed">
                {selectedNote.summary.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.004 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotesPage;
