import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const Playground = () => {
  const [mode, setMode] = useState("breathing");
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [breathState, setBreathState] = useState("Breathe In");
  const [intervalDuration, setIntervalDuration] = useState(10);
  const [message, setMessage] = useState("");
  
  const audioNature = useRef(new Audio("nature.mp3"));
  const audioBgm = useRef(new Audio("bgm.mp3"));
  const videoRef = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (mode === "breathing" && isPlaying) {
      let sequence = ["Breathe In", "Hold", "Breathe Out"];
      let index = 0;
      const interval = setInterval(() => {
        setBreathState(sequence[index]);
        speak(sequence[index]);
        index = (index + 1) % sequence.length;
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, mode]);

  useEffect(() => {
    audioNature.current.loop = true;
    audioBgm.current.loop = true;
  }, []);

  useEffect(() => {
    if (time > 0 && time % intervalDuration === 0) {
      setIntervalDuration((prev) => prev + 30);
      const messages = [
        "You're doing great!", 
        "Keep going, you're on the right track!", 
        "Stay focused and relaxed!", 
        "You're improving every second!" 
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMsg);
      speak(randomMsg);
    }
  }, [time]);

  const speak = (text) => {
    if (!isPlaying) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioNature.current.play();
      audioBgm.current.play();
      videoRef.current.play();
      if (mode === "meditation") videoRef.current.muted = false;
      // Request fullscreen
      const element = document.documentElement; // or any specific element you want to fullscreen

if (element.requestFullscreen) {
  element.requestFullscreen();
} else if (element.mozRequestFullScreen) {
  element.mozRequestFullScreen(); // Firefox
} else if (element.webkitRequestFullscreen) {
  element.webkitRequestFullscreen(); // Chrome, Safari, Opera
} else if (element.msRequestFullscreen) {
  element.msRequestFullscreen(); // IE/Edge
}
    } else {
      audioNature.current.pause();
      audioBgm.current.pause();
      videoRef.current.pause();
      synth.cancel();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setBreathState("Breathe In");
    setMessage("");
    setIntervalDuration(60);
    audioNature.current.pause();
    audioNature.current.currentTime = 0;
    audioBgm.current.pause();
    audioBgm.current.currentTime = 0;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    videoRef.current.muted = true;
    synth.cancel();
  };

  const handleModeChange = (newMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      handleReset();
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center bg-transparent justify-center text-white font-mono overflow-hidden">
    <video 
  ref={videoRef} 
  className="absolute top-0 left-0 w-full h-full object-cover z-[0]" 
  loop 
  muted
  autoPlay
>
  <source src="nature2.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

      <div className="absolute top-0 bg-transparent left-0 z-[40] w-full h-full  bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg bg-black/50 rounded-xl p-5">
          {mode === "breathing" ? "Breathing Exercise" : "Meditation"}
        </h1>
        
        <div className="flex gap-6 mb-8">
          <button className={`px-5 py-3 rounded-lg font-bold transition-all duration-300 ${mode === "breathing" ? "bg-green-500 shadow-lg scale-110" : "bg-gray-500 hover:bg-green-400"}`} onClick={() => handleModeChange("breathing")}>
            Breathing Exercise
          </button>
          <button className={`px-5 py-3 rounded-lg font-bold transition-all duration-300 ${mode === "meditation" ? "bg-green-500 shadow-lg scale-110" : "bg-gray-500 hover:bg-green-400"}`} onClick={() => handleModeChange("meditation")}>
            Meditation
          </button>
        </div>

        {mode === "breathing" && (
          <motion.div
            animate={{ scale: breathState === "Breathe In" ? 1.6 : breathState === "Hold" ? 1.2 : 0.8 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-40 h-40 bg-white rounded-full m-20 flex items-center justify-center text-black text-2xl font-bold shadow-2xl border-4 border-blue-400"
          >
            {breathState}
          </motion.div>
        )}

        <h2 className="text-3xl mt-6 font-semibold bg-black/50 rounded-xl p-5">
          Time: {Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}
        </h2>

        {message && <p className="mt-4 text-xl font-bold text-yellow-400 bg-black/50 rounded-xl p-5">{message}</p>}

        <div className="mt-8 flex gap-6">
          <button className="px-6 py-3 bg-blue-600 rounded-lg flex items-center gap-2 text-lg font-semibold hover:bg-blue-500 transition-all" onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
          </button>
          <button className="px-6 py-3 bg-red-600 rounded-lg flex items-center gap-2 text-lg font-semibold hover:bg-red-500 transition-all" onClick={handleReset}>
            <FaRedo /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Playground;
