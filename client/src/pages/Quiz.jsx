import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FaceRecognition from "./FaceRecognition";

function Quiz() {
  const { category_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizStarted, setQuizStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const faceRef = useRef(null);

  const getQuestions = async () => {
    try {
      const response = await axiosInstance.get(`/question/${category_id}`);
      const fetchedQuestions = response.data.data;
      setQuestions(fetchedQuestions);
      setAnswers(Array(fetchedQuestions.length).fill(-1));
    } catch (error) {
      toast.error("Failed to load questions.");
      navigate("/quiz");
    }
  };

  useEffect(() => {
    if (category_id) getQuestions();
  }, [category_id]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev % 60 === 0) {
            toast(`Time left: ${Math.floor(prev / 60)} minutes ⏱️`);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      toast.error("Time's up! Submitting quiz...");
      handleSubmit();
    }
  }, [quizStarted, timeLeft]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    window.scrollTo(0, 0);

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        toast.error("Cheating attempt detected: Exiting fullscreen.");
        navigate("/quiz");
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [navigate, user]);
  useEffect(() => {
    let stream = null;
  
    // Initialize camera
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream = mediaStream;
        setCameraOn(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
        toast.error("Camera access is required to start the quiz.");
        setCameraOn(false);
      }
    };
  
    startCamera();
  
    // Cleanup function to stop camera
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop(); // Stop each track
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video element
      }
      setCameraOn(false); // Update state
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const handleAnswerChange = (index) => {
    const updated = [...answers];
    updated[currentQuestion] = index;
    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 500);
    }
  };

  
  

  const handleNext = () => {
    if (answers[currentQuestion] === -1) {
      toast.error("Please select an answer before proceeding!");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleBack = () => setCurrentQuestion((prev) => prev - 1);

  const handleSubmit = () => {
    if (answers.includes(-1)) {
      toast.error("You have unanswered questions!");
      return;
    }

    setIsLoading(true);
    const submissionData = questions.map((q, i) => ({
      question_id: q._id,
      user_answer: answers[i],
    }));

    axiosInstance
      .post("/quiz/submit-quiz", { category_id, answers: submissionData })
      .then(() => {
        toast.success("Quiz submitted successfully!");
        navigate("/results");
      })
      .catch(() => toast.error("Failed to submit the quiz."))
      .finally(() => setIsLoading(false));
  };

  const startQuiz = () => {
    if (!cameraOn) {
      toast.error("Please allow camera access to start the quiz.");
      return;
    }

    if (questions.length === 0) {
      toast.error("No questions available!");
      return;
    }

    setQuizStarted(true);
    setModalOpen(false);
    toast("Good luck! Let's ace this quiz! 🎉", { icon: "🚀" });

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const getLevelClass = (level) => {
    switch (level) {
      case "easy":
        return "bg-green-500 text-white px-2 py-1 rounded text-sm";
      case "medium":
        return "bg-yellow-500 text-white px-2 py-1 rounded text-sm";
      case "hard":
        return "bg-red-500 text-white px-2 py-1 rounded text-sm";
      default:
        return "bg-gray-500 text-white px-2 py-1 rounded text-sm";
    }
  };

  
    useEffect(() => {
      
      if (faceRef.current) {
        const interval = setInterval(() => {
          const data = faceRef.current.getFaceData();
          
  
          if(data.length > 1) {
            toast.error("Cheating attempt detected: Two person on same screen.");
            navigate("/quiz");
          }
  
        }, 300); 
    
        return () => clearInterval(interval);
      }
    }, [faceRef , faceRef?.current]);
  


  const progress = (currentQuestion / questions.length) * 100;

  if (!quizStarted && modalOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center space-y-6 w-full max-w-xl">
          <h2 className="text-3xl font-bold text-gray-800">Ready to Start the Quiz?</h2>
          <p className="text-gray-600">Questions: {questions.length}</p>
          <p className="text-gray-600">Time Limit: 10 minutes</p>
          <p className="text-gray-600">1 point per question</p>

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Camera Preview (Required)</p>
            <video
              ref={videoRef}
              autoPlay
              className="w-48 h-32 mx-auto rounded-md border-2 border-indigo-500 shadow-md"
            />
            {!cameraOn && <p className="text-red-500 mt-2">Camera not enabled</p>}
          </div>

          <button
            onClick={startQuiz}
            disabled={!cameraOn}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              cameraOn
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:p-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Time Left: <span className="text-red-500">{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" : ""}{timeLeft % 60}</span>
          </h2>
          <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
        </div>

        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-3 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{questions[currentQuestion].title}</h3>
              <span className={getLevelClass(questions[currentQuestion].level)}>{questions[currentQuestion].level}</span>
            </div>
            <ul className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`question_${currentQuestion}`}
                      checked={answers[currentQuestion] === index}
                      onChange={() => handleAnswerChange(index)}
                      className="form-radio h-5 w-5 text-indigo-600"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t mt-6">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentQuestion === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            } transition`}
          >
            Back
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 text-white rounded-lg font-semibold transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
        <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Camera Preview (Required)</p>
            {/* <video
              ref={videoRef}
              autoPlay
              className="w-48 h-32 mx-auto rounded-md border-2 border-indigo-500 shadow-md"
            /> */}
            
            <FaceRecognition ref={faceRef}   />
            {!cameraOn && <p className="text-red-500 mt-2">Camera not enabled</p>}
          </div>
      </div>
    </div>
  );
}

export default Quiz;
