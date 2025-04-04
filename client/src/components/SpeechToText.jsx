import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // Store Blob for sending
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Start Recording
  const startRecording = async () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(finalTranscript);
    };
    recognition.start();
    recognitionRef.current = recognition;

    // Audio Recording Setup
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      setAudioBlob(audioBlob); // Store blob to send later
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Send Audio File to Backend
  const sendAudio = async () => {
    if (!audioBlob) {
      alert("No recorded audio found!");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", response.data);
      alert("Audio uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload audio.");
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl text-center">
      <h2 className="text-xl font-bold mb-4">🎙️ Audio to Text Converter</h2>
      
      {/* Start/Stop Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-lg text-white ${isRecording ? "bg-red-600" : "bg-blue-600"}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Display Audio Player */}
      {audioURL && (
        <div className="mt-4">
          <p className="text-gray-400">🔊 Recorded Audio:</p>
          <audio controls src={audioURL} className="w-full mt-2"></audio>
        </div>
      )}

      {/* Display Transcription */}
      <div className="mt-4 p-2 bg-gray-800 rounded-lg text-left">
        <p className="text-gray-400">📝 Transcript:</p>
        <p className="text-white font-semibold">{transcript || "Waiting for speech..."}</p>
      </div>

      {/* Upload Button */}
      {audioBlob && (
        <button
          onClick={sendAudio}
          className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white"
        >
          Upload Audio
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
