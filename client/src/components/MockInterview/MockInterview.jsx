import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import { FiLoader, FiMic, FiMicOff, FiVolume2, FiVideo, FiVideoOff, FiUpload } from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import pdfToText from 'react-pdftotext';
import Tesseract from 'tesseract.js';

// Configure PDF.js worker path
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const MockInterview = () => {
  // Refs
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [videoStream, setVideoStream] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ContentText, setContentText] = useState("");
  const [isProcessingContent, setIsProcessingContent] = useState(false);
  const [ContentError, setContentError] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // PDF text extraction
  const extractTextFromPdf = async (file) => {
    try {
      const text = await pdfToText(file);
      return text;
    } catch (error) {
      console.error(error);
      setError('Error processing the PDF. Please try again.');
      setLoading(false);
    }
  };

  const handlePdf = async (file) => {
    try {
      setIsProcessingContent(true);
      setContentError(null);
      const text = await extractTextFromPdf(file);
      setContentText(text);
    } catch (error) {
      console.error(error);
      setContentError('Error processing PDF');
    } finally {
      setIsProcessingContent(false);
    }
  };

  // Image text extraction
  const handleImage = async (file) => {
    try {
      setIsProcessingContent(true);
      setContentError(null);
      const result = await Tesseract.recognize(file, 'eng');
      setContentText(result.data.text);
    } catch (error) {
      console.error(error);
      setContentError('Error processing image');
    } finally {
      setIsProcessingContent(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      handlePdf(file);
    } else if (file.type.startsWith('image/')) {
      handleImage(file);
    } else {
      setContentError('Unsupported file type. Please upload PDF or image.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Interview question handler
  const handleAskQuestion = async (updatedHistory = []) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("/interview", { 
        history: updatedHistory,
        content : ContentText
      });

      if (response.data?.response) {
        const question = response.data.response;
        const newHistory = [
          ...updatedHistory,
          { 
            type: "question",
            speaker: "interviewer", 
            content: question,
            timestamp: new Date().toISOString()
          }
        ];
        setHistory(newHistory);
        speakText(question);
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setError('Failed to get next question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Speech synthesis
  const speakText = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    synth.speak(utterance);
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    await handleAskQuestion([]);
  };

  // Speech recognition
  const startListening = () => {
    if (loading) return;

    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    setTranscript("");
    setIsListening(true);

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    let finalTranscript = "";

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const txt = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += txt + " ";
        } else {
          interimTranscript += txt;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (finalTranscript.trim()) {
        const lastQuestion = history.findLast(item => item.type === "question");
        const updatedHistory = [
          ...history,
          { 
            type: "answer",
            speaker: "candidate", 
            content: finalTranscript.trim(),
            question: lastQuestion?.content || "",
            timestamp: new Date().toISOString()
          }
        ];
        setHistory(updatedHistory);
        handleAskQuestion(updatedHistory);
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Camera setup
  const initCamera = async () => {
    try {
      setCameraError(null);
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const analysizeInterview = async () => {
    try {
      setIsAnalyzing(true);
      const response = await axiosInstance.post('/interview/report', { history });
      if (response.data) {
        navigate('/interview-analysis');
      }
    } catch (error) {
      console.error("Error analyzing interview:", error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initialize camera
  useEffect(() => {
    initCamera();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const retryCamera = () => {
    initCamera();
  };

  useEffect(() => {
    retryCamera();
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    }
  }, [])
  

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);


  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
      {/* Header */}
      <header className="w-full max-w-6xl mb-6">
        <h1 className="text-2xl font-bold text-blue-400">AI Mock Interview</h1>
        <p className="text-gray-400">Practice your interview skills with AI</p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-6xl mb-4 p-3 bg-red-900/50 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-6">
        {/* Video Panel */}
        <div className="w-full lg:w-2/3 bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="relative h-64 md:h-96 bg-black">
            {cameraError ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <FiVideoOff className="text-4xl text-red-500 mb-2" />
                <p className="text-red-400 mb-4">{cameraError}</p>
                <button
                  onClick={retryCamera}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
                >
                  <FiVideo className="mr-2" />
                  Retry Camera
                </button>
              </div>
            ) : videoStream ? (
              <div className="relative h-full w-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {history.length > 0 && history[history.length - 1].speaker === "interviewer" && (
                  <div className="absolute bottom-4 right-4 flex items-center">
                    <img 
                      src={'robot-speaking.gif'} 
                      alt="Interviewer speaking" 
                      className="w-12 h-12"
                    />
                    <span className="ml-2 text-sm bg-gray-900 bg-opacity-70 px-2 py-1 rounded-full">
                      Interviewer speaking
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FiLoader className="animate-spin text-2xl mb-2 text-blue-400" />
                <p className="text-gray-400">Initializing camera...</p>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-full text-sm">
              {isListening ? (
                <span className="flex items-center text-red-400">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Listening...
                </span>
              ) : (
                <span className="text-gray-300">
                  {videoStream ? "Camera active" : "Camera loading"}
                </span>
              )}
            </div>
          </div>

          {/* Conversation History */}
          <div className="p-4 h-64 overflow-y-auto bg-gray-800 border-t border-gray-700">
            {history.length === 0 && !interviewStarted ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="mb-4">Ready to begin your mock interview?</p>
                <button
                  onClick={startInterview}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Start Interview
                </button>
              </div>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                    item.speaker === "interviewer"
                      ? "bg-blue-900 text-white self-start mr-auto"
                      : "bg-gray-700 text-white self-end ml-auto"
                  }`}
                >
                  <div className="flex items-center">
                    {item.speaker === "interviewer" ? (
                      <img 
                        src={'robot-speaking.gif'} 
                        alt="Interviewer" 
                        className="w-8 h-8 mr-2"
                      />
                    ) : null}
                    <div>
                      <p className="font-medium">
                        {item.speaker === "interviewer" ? "Interviewer" : "You"}
                      </p>
                      <p className="mt-1">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center p-3 text-gray-400">
                <img 
                  src={'robot-speaking.gif'} 
                  alt="Interviewer thinking" 
                  className="w-8 h-8 mr-2"
                />
                <span>Interviewer is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-1/3 bg-gray-800 rounded-xl p-6 shadow-2xl">
          <div className="space-y-4">
            {/* Content Upload */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium text-blue-400 mb-2">Upload Content</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
              <button
                onClick={triggerFileInput}
                disabled={isProcessingContent}
                className={`flex items-center justify-center py-3 px-4 w-full bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors ${
                  isProcessingContent ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isProcessingContent ? (
                  <FiLoader className="animate-spin mr-2" />
                ) : (
                  <FiUpload className="mr-2" />
                )}
                {isProcessingContent ? "Processing..." : "Upload Content"}
              </button>
              {ContentError && (
                <p className="text-red-400 text-sm mt-2">{ContentError}</p>
              )}
              {ContentText && (
                <p className="text-green-400 text-xs mt-2">
                  ✓ Content loaded successfully
                </p>
              )}
            </div>

            {/* Current Response */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-medium text-blue-400 mb-2">Current Response</h3>
              <p className="text-gray-300">
                {transcript || (isListening ? "Listening..." : "No input yet")}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={loading || !interviewStarted || cameraError}
                className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } ${
                  loading || !interviewStarted || cameraError ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isListening ? (
                  <>
                    <FiMicOff className="mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <FiMic className="mr-2" />
                    Start Listening
                  </>
                )}
              </button>

              <button
                onClick={() => speakText(transcript)}
                disabled={!transcript}
                className={`flex items-center justify-center py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors ${
                  !transcript ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiVolume2 className="mr-2" />
                Speak Response
              </button>

              <button
                onClick={retryCamera}
                className="flex items-center justify-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                <FiVideo className="mr-2" />
                {cameraError ? "Retry Camera" : "Reconnect Camera"}
              </button>

              <button
                onClick={analysizeInterview}
                disabled={isAnalyzing || history.length === 0}
                className={`flex items-center justify-center py-3 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors ${
                  isAnalyzing || history.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isAnalyzing ? (
                  <FiLoader className="animate-spin mr-2" />
                ) : (
                  <FaLightbulb className="mr-2" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze Interview"}
              </button>
            </div>

            {/* Status */}
            <div className="pt-4 border-t border-gray-700">
              <h3 className="font-medium text-blue-400 mb-2">Interview Status</h3>
              <div className="flex items-center mb-2">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    interviewStarted ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span>
                  {interviewStarted
                    ? `Interview in progress (${history.length} questions)`
                    : "Ready to begin"}
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    videoStream ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>
                  {videoStream ? "Camera connected" : cameraError || "Camera disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;