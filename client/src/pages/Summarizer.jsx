import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import pdfToText from 'react-pdftotext';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaExclamationTriangle, FaExpand } from 'react-icons/fa';
import axiosInstance from '../config/axiosConfig';
import { Link } from 'react-router-dom';

function Summarizer() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('');
  const [fullImage, setFullImage] = useState(null);
  const [title, setTitle] = useState('');


  useEffect(() => {
    document.title = 'Notes Summarizer';
    return () => {
      if (preview && typeof preview === 'string') {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const resetStates = () => {
    setError('');
    setText('');
    setSummary('');
    setPreview(null);
    setFullImage(null);
    setFileType('');
  };

  const handlePdf = async (file) => {
    try {
      const text = await pdfToText(file);
      setText(text);
      await summarizeText(text);
    } catch (error) {
      console.error(error);
      setError('Error processing the PDF. Please try again.');
      setLoading(false);
    }
  };

  const handleImage = async (file) => {
    try {
      const result = await Tesseract.recognize(file, 'eng');
      const text = result.data.text;
      console.log({text})
      setText(text);
      await summarizeText(text);
    } catch (error) {
      console.error(error);
      setError('Error processing the image. Please try again.');
      setLoading(false);
    }
  };

  const summarizeText = async (inputText) => {
    try {
      const response = await axiosInstance.post('/chat/summarize', { prompt: inputText });
      if (response.data.status) {
        setTitle(response.data.title?.trim());
        setSummary(response.data.summary.replaceAll('*', '').trim());
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Error summarizing the text. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    resetStates();
    setLoading(true);

    const type = file.type;
    setFileType(type);

    if (type === 'application/pdf') {
      setPreview(URL.createObjectURL(file));
      handlePdf(file);
    } else if (type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      handleImage(file);
    } else {
      setError('Unsupported file format. Please upload a PDF or an image.');
      setLoading(false);
    }
  };

  const handlePaste = useCallback((event) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) onDrop([blob]);
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0,0);
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center justify-center pt-14 pb-14 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
          <Link
            to="/notes"
            className="bg-indigo-600 text-white px-5 py-2 m-4 rounded-xl hover:bg-indigo-700 transition"
          >
           View Summarized Notes
          </Link>
      <motion.div
        {...getRootProps()}
        className="w-full max-w-4xl p-6 bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col items-center cursor-pointer hover:shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center w-full h-60 border-dashed border-4 border-gray-300 rounded-2xl bg-gray-50 p-4 text-center">
          <FaCloudUploadAlt className="text-7xl text-blue-400 mb-4" />
          <p className="text-gray-600 text-lg">Drag and drop a PDF/image or paste an image from clipboard</p>
        </div>
      </motion.div>

      {preview && (
        <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded-xl shadow-md">
          {fileType === 'application/pdf' ? (
            <div className="flex flex-col items-center justify-center h-30 bg-gray-100 border border-dashed border-gray-300 rounded-xl text-gray-500">
              <FaCloudUploadAlt className="text-4xl mb-2 text-blue-400" />
              <p className="text-lg font-medium">PDF uploaded successfully</p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-96 rounded-xl object-contain w-full cursor-pointer"
                onClick={() => setFullImage(preview)}
              />
              <button
                onClick={() => setFullImage(preview)}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-2 rounded-full"
              >
                <FaExpand />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <motion.div
          className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg flex items-center w-full max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaExclamationTriangle className="mr-2" />
          <p>{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-blue-500 hover:underline">Try Again</button>
        </motion.div>
      )}

      {loading && (
        <div className="mt-6 flex items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z" />
          </svg>
          <span className="ml-4 text-gray-700">Summarizing...</span>
        </div>
      )}

{summary && (
  <motion.div
    className="mt-6 p-6 bg-white border border-gray-300 rounded-2xl shadow-lg w-full max-w-4xl"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {title && (
      <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">{title}</h2>
    )}
    <h3 className="text-2xl font-semibold mb-2 text-gray-800">Summary</h3>
    <pre className="whitespace-pre-wrap text-gray-800 text-lg">
      {summary.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.01 }}
        >
          {char}
        </motion.span>
      ))}
    </pre>
  </motion.div>
)}


      {fullImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <img
              src={fullImage}
              alt="Full Preview"
              className="max-w-screen-md max-h-screen object-contain rounded-lg"
            />
            <button
              onClick={() => setFullImage(null)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg text-black hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summarizer;
