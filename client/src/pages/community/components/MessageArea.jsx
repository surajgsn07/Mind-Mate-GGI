import React, { useEffect, useState } from "react";
import {
  BsChatLeftText,
  BsThreeDotsVertical,
  BsEmojiSmile,
  BsMicFill,
} from "react-icons/bs";
import { IoSend } from "react-icons/io5";
// import { sendMessage } from '../../../constants/apiCalls';
import EmojiPicker from "emoji-picker-react";
import  toast  from "react-hot-toast";
import { useSelector } from "react-redux";
import { useChatContext } from "../../../context/ChatProvider";
import { useSocket } from "../../../context/SocketProvider";
import { Axios } from "axios";
import axiosInstance from "../../../config/axiosConfig";

const MessageArea = ({ currSelectedChat, setMessages }) => {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const [typing, setTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { allChatsMessages } = useChatContext();

  // Speech Recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  const handleVoiceInput = () => {
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Append recognized speech to message state
  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error detected: " + event.error);
      setIsRecording(false);
    };
  }, [recognition]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const data = {};
      data.communityId = currSelectedChat._id;
      data.content = message

      console.log(data)
      try {
        const res = await axiosInstance.post("/community/message", data);
        console.log(res)
        socket?.emit("new message", res.data.message);
        setMessages((prev) => [...prev, res.data.message]);
        setMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  // HANDLE TYPING STATE REAL TIME
  const handleChange = (e) => {
    setMessage(e.target.value);
    if (!socket) return;

    if (!typing) {
      setTyping(true);
      socket?.emit("typing", {
        roomId: currSelectedChat?._id,
        user: currentUser,
      });
    }
    clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        setTyping(false);
        socket?.emit("stop typing", currSelectedChat?._id);
      }, 1000)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onEmojiClick = (event) => {
    setMessage((prev) => prev + event.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/webp" &&
      file.type !== "image/png" &&
      file.type !== "image/gif"
    ) {
      toast.error("Unsupported file type, Only images are allowed");
      return;
    }
    if (file.size > 10000000) {
      toast.error("File size should be less than 10MB");
      return;
    }
    handleSendMessage(file);
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white  ">
      <div className="flex items-center relative">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-10">
            <EmojiPicker
              height={350}
              emojiStyle="facebook"
              width="17rem"
              lazyLoadEmojis={true}
              onEmojiClick={onEmojiClick}
            />
          </div>
        )}

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-500 :text-gray-400 hover:text-teal-600 :hover:text-teal-400"
        >
          <BsEmojiSmile size={20} />
        </button>

        {/* File Upload */}
        <label
          htmlFor="file"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
        >
          <BsThreeDotsVertical size={20} />
        </label>
        <input
          type="file"
          name="file"
          id="file"
          hidden
          onChange={handleFileChange}
        />

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 :bg-stone-800 :text-gray-200"
        />

        {/* Send/Voice Button */}
        {message.trim() ? (
          <button
            type="button"
            onClick={() => handleSendMessage()}
            className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-4 py-2 rounded-r-lg hover:from-teal-800 hover:to-teal-900 transition-all"
          >
            <IoSend size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 text-gray-500 :text-gray-400 hover:text-teal-600 :hover:text-teal-400 ${
              isRecording ? "text-red-500 animate-pulse" : ""
            }`}
          >
            <BsMicFill size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageArea;
