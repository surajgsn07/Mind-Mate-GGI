import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "universal-cookie";
import axiosInstance from "../config/axiosConfig";

import { addUser } from "../../store/userSlice";

function Result() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const cookie = new Cookie();
    const dispatch = useDispatch();
    const { result_id } = useParams();
    const [analysis, setAnalysis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = cookie.get("user_token");
        if (!user && token) {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        const token = cookie.get("user_token");
        if (!user && !token) {
            navigate("/user/login");
        } else {
            getResultAnalysis();
        }
    }, [user]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getResultAnalysis = async () => {
        try {
            const response = await axiosInstance.get(`/quiz/result-analysis/${result_id}`);
            if (response.data.analysis) {
                setAnalysis(response.data.analysis);
                console.log(response.data.analysis);
            }
        } catch (error) {
            console.error("Error fetching result analysis:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="container mx-auto min-w-screen p-4 pt-20 bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Result Analysis</h1>
                <div className="space-y-4">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <div
                                  key={index}
                                  className="bg-white p-4 rounded-lg shadow-md animate-pulse"
                              >
                                  <div className="h-6 bg-gray-300 mb-4 rounded"></div>
                                  <div className="space-y-2 mb-4">
                                      <div className="h-4 bg-gray-300 rounded"></div>
                                      <div className="h-4 bg-gray-300 rounded"></div>
                                      <div className="h-4 bg-gray-300 rounded"></div>
                                  </div>
                                  <div className="h-5 bg-gray-300 mb-4 rounded"></div>
                                  <div className="h-5 bg-gray-300 mb-4 rounded"></div>
                                  <div className="h-4 bg-gray-300 rounded"></div>
                                  <div className="w-20 h-6 bg-gray-300 mt-4 rounded-full"></div>
                              </div>
                          ))
                        : analysis.map((item, index) => (
                              <div
                                  key={index}
                                  className="bg-white p-4 rounded-lg shadow-md"
                              >
                                  <h2 className="text-xl font-semibold mb-2">
                                      {item.question_title}
                                  </h2>
                                  <div className="mb-2">
                                      <p className="text-sm">Available Options:</p>
                                      <ul className="list-disc pl-5">
                                          {item.options.map((option, i) => {
                                              const isCorrect = option === item.correct_option;
                                              const isUserAnswer = option === item.user_option && !item.isCorrect;
                                              const optionClass = isCorrect
                                                  ? "text-green-600 font-semibold"
                                                  : isUserAnswer
                                                  ? "text-red-500 font-semibold"
                                                  : "";
                                              return (
                                                  <li key={i} className={optionClass}>
                                                      {option}
                                                  </li>
                                              );
                                          })}
                                      </ul>
                                  </div>
                                  <div className="mb-4">
                                      <p className="text-sm">Explanation:</p>
                                      <p className="text-md">{item.explanation}</p>
                                  </div>
                                  <div
                                      className={`bg-${item.isCorrect ? "green" : "red"}-500 text-white py-1 px-3 rounded-full text-sm`}
                                  >
                                      {item.isCorrect ? "Correct" : "Wrong"}
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
        </>
    );
}

export default Result;