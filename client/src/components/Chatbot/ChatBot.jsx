import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaImage, FaMicrophone , FaLightbulb  } from "react-icons/fa";
import axiosInstance from "../../config/axiosConfig";
import Loader from "../common/Loader"
import { useNavigate } from "react-router-dom";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import AnalyzingModal from "./AnalyzingModal";
import SosModal from "./SOSAlert";
import {useSelector} from "react-redux"
const ChatBot = () => {
  
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" , emotion:"happy" }
  ]);
  // const [isTextMessage, setIsTextMessage] = useState(true);
  const [showSOSAlert, setshowSOSAlert] = useState(false);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showMicModal, setShowMicModal] = useState(false);
  const [loadingChats, setloadingChats] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const user = useSelector((state) => state.user);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const emotionIcons = {
    sad: "😢",
    happy: "😊",
    neutral: "😐",
    angry: "😡",
    disgust: "🤢",
    fear: "😱",
  };
  const navigate = useNavigate();

  const fetchChat = async()=>{
    try {
      setloadingChats(true);
      const response = await axiosInstance.get('/chat/chats');
      if(response.data){
        console.log("data : " , response.data);
        const arr = response.data.chats;
        let a = [];
        arr.forEach((res)=>{
          a.push({
            text : res.message,
            emotion: res.emotion,
            sender:"user"
          });
          a.push({
            text:res.response,
            emotion:res.emotion,
            sender:"bot"
          });
        })
        setMessages(a);
      }
    } catch (error) {
      console.log("error : " , error);
    }finally{
      setloadingChats(false);
    }
  }

  useEffect(() => {
    // Clean up speech recognition when component unmounts
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Add auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if(user)
      fetchChat();
  }, [user])
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const speakText = (text) => {
    if (!text) return;

    const synth = window.speechSynthesis;

    // Stop any ongoing speech before speaking the new text
    if (synth.speaking) {
        synth.cancel();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = "en-US"; // Set language
    utterance.rate = 1; // Adjust speed (default is 1)
    utterance.pitch = 1; // Adjust pitch (default is 1)

    synth.speak(utterance);
};


  let isTextMessage = true;


  const handleSend = async (messageText = input) => {
    if (!messageText.trim() && !selectedImage ) return;

    if(loading)return;

    // Set loading immediately
    setLoading(true);
    
    // Save the user message first
    const newMessage = { text: messageText, image: imagePreview, sender: "user"  , emotion:""};
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Clear input fields
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    
    try {
      let response;
      
      // Make API request based on whether there's an image or not
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("message", messageText);
        formData.append("id", "679b9457a5ad24f87bca8349");
        formData.append("prevData" , messages )
        if(messageText.toLowerCase().includes("suicide")){
          setshowSOSAlert(true);
        }
        response = await axiosInstance.post("/chat/img", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.post("/chat", { 
          message: messageText
        });
      }
      
      // Add bot response to messages
      if (response.data) {

        if(response.data.response === 'sos'){
          setshowSOSAlert(true)
        }
        
        setMessages([...updatedMessages, { 
          text: response.data.response, 
          sender: "bot" 
        }]);

        console.log({isTextMessage})
        if(!isTextMessage){
          speakText(response.data.response);
          isTextMessage = true;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...updatedMessages, { 
        text: "⚠️ Failed to send message. Please try again.", 
        sender: "bot" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    
    if(loading)return;
    try {
      // Check browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.");
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      setTranscript("");
      setShowMicModal(true);
      setIsListening(true);

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      let variable = "";
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        console.log({interimTranscript , finalTranscript})

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        
        variable = finalTranscript || interimTranscript;
        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        console.log({variable})
        setIsListening(false);
        setShowMicModal(false);
        if (variable.trim()) {
          isTextMessage = false;
          handleSend(variable);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setShowMicModal(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setIsListening(false);
      setShowMicModal(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setShowMicModal(false);
  };

  const handleAnalysis = async()=>{
    try {
      setIsAnalyzing(true);
      const response = await axiosInstance.get('/chat/analyze');
      if(response.data){
        navigate('/analysis')
      }
    } catch (error) {
        console.log("error :" , error);
    }finally{
      setIsAnalyzing(false);
    }
  }

  return (

<div className="flex relative flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-200  bg-no-repeat bg-cover bg-center text-white">
{
        loadingChats ? 
        <div className="p-4 space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`max-w-xs p-3 min-w-[40%] rounded-lg relative animate-pulse 
              ${index % 2 === 0 ? "bg-blue-500 ml-auto" : "bg-gray-700 mr-auto"}`}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-3 w-full bg-gray-500 rounded mb-1"></div>
            <div className="h-3 w-5/6 bg-gray-500 rounded mb-1"></div>
            <div className="h-3 w-4/6 bg-gray-500 rounded"></div>
    
            {/* Simulated Image Placeholder */}
            {index % 2 !== 0 && (
              <div className="mt-2 w-40 h-40 bg-gray-600 rounded-lg"></div>
            )}
    
            {/* Placeholder for Emotion or Speaker Icon */}
            <div className={`absolute ${index % 2 === 0 ? "right-1" : "hidden"} bottom-1 text-xl bg-gray-500 w-6 h-6 rounded-full`} ></div>
          </div>
        ))}
      </div>:<>

      <div onClick={handleAnalysis} className="bg-black px-4 py-2 absolute rounded-lg top-1 right-2 z-40" >
        <FaLightbulb  className=" bg-black text-amber-400   " size={24} />
      </div>
    

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
  {messages.map((msg, index) => (
    <div
    key={index}
    title={msg.emotion} 
    className={`group max-w-xs p-3 min-w-[40%] rounded-lg relative 
      ${msg.sender === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700 mr-auto"}
    `}
  >
    <div className="font-semibold">{msg.sender.toUpperCase()}</div>
    {msg.text}
    {msg.image && (
      <img 
        src={msg.image} 
        alt="Sent" 
        className="mt-2 w-40 h-40 object-cover rounded-lg" 
      />
    )}
  
    {/* Tooltip */}
    <div 
      className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity 
        bg-black text-white text-xs rounded px-2 py-1 shadow-lg"
    >
      {msg.emotion}
    </div>
  
    {/* Emotion Icon */}
    <div className={`absolute ${msg.sender === "user" ? "right-1" : "hidden"} bottom-1 text-xl lg:text-2xl`}>
      {emotionIcons[msg.emotion]}
    </div>
  
    {/* Speaker Icon for Bot */}
    {msg.sender === 'bot' && (
      <div onClick={() => speakText(msg.text)} className="absolute bottom-1 right-1 cursor-pointer">
        <HiMiniSpeakerWave />
      </div>
    )}
  </div>
  
  ))}

  {/* Bot Typing Skeleton */}
  {loading && (
    <div className="max-w-xs p-3 min-w-[40%] rounded-lg relative animate-pulse bg-gray-700 mr-auto">
      <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
      <div className="h-3 w-full bg-gray-500 rounded mb-1"></div>
      <div className="h-3 w-5/6 bg-gray-500 rounded mb-1"></div>
      <div className="h-3 w-4/6 bg-gray-500 rounded"></div>
    </div>
  )}

  <div ref={messagesEndRef} />
</div>


      {/* Image Preview */}
      {imagePreview && (
        <div className="p-2 text-center">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-24 h-24 object-cover rounded-lg mx-auto" 
          />
          <button 
            onClick={() => {
              setSelectedImage(null);
              setImagePreview(null);
            }}
            className="mt-1 text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}

      {
        // loading && (
        //   <TypingLoader/>
        // )
      }


      {/* Input & Send Button */}
      <div className="flex items-center p-4 w-full  mx-auto rounded-xl">
        <div className="bg-gray-700 flex  sm:w-[95%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto items-center p-4 min-w-[320px] rounded-xl " >
        <label className="cursor-pointer rounded-lg bg-gray-700 hover:bg-gray-600">
          <FaImage className="text-white text-xl" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange} 
            disabled={loading}
          />
        </label>
        
        <input
          type="text"
          className="flex-1 p-2 mx-2 rounded-lg bg-gray-700 text-white outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
          disabled={loading}
        />
        <button 
          className={`p-2 m-1 rounded-lg ${
            loading 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-btn-color hover:bg-blue-600"
          }`} 
          onClick={() => handleSend()} 
          disabled={loading}
        >
          {loading ? "⏳" : <FaPaperPlane className="text-white" />}
        </button>
        <button 
          className={`p-2 ml-2 rounded-lg ${
            isListening 
              ? "bg-red-600 animate-pulse" 
              : "bg-red-500 hover:bg-red-600"
          }`} 
          onClick={isListening ? stopListening : startListening}
          disabled={loading}
        >
          <FaMicrophone className="text-white" />
        </button>
        </div>
      </div>
      

        </>
      }

      {/* Voice Input Modal */}
      {showMicModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-lg text-center w-80">
            <p className="text-lg">{isListening ? "Listening..." : "Processing..."}</p>
            <FaMicrophone className="text-red-500 text-4xl mx-auto my-3 animate-pulse" />
            <p className="bg-gray-700 p-2 rounded-lg text-white min-h-12 break-words">
              {transcript || "Speak now..."}
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
              onClick={stopListening}
            >
              Stop Listening
            </button>
          </div>
        </div>
      )}


      <AnalyzingModal isOpen={isAnalyzing} />
      <SosModal isOpen={showSOSAlert} onClose={()=>setshowSOSAlert(false)} />
    </div>
  );
};



const TypingLoader = () => {
  return (
    <div className="flex mx-4 justify-start my-2 items-center w-full">
      <div className="loader bg-stone-100 dark:bg-stone-700 p-2 rounded-full flex space-x-3">
        <div
          className="w-2 h-2 bg-blue-700 rounded-full animate-bounce"
          style={{ animationDuration: "0.5s", animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-700 rounded-full animate-bounce"
          style={{ animationDuration: "0.5s", animationDelay: "0.3s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-700 rounded-full animate-bounce"
          style={{ animationDuration: "0.5s", animationDelay: "0.6s" }}
        ></div>
      </div>
    </div>
  );
};

export default ChatBot;