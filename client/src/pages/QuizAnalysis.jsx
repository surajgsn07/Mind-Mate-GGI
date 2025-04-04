import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "universal-cookie";
import { addUser } from "../../store/userSlice";
import axiosInstance from "../config/axiosConfig";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function QuizAnalysis() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const cookie = new Cookie();
    const dispatch = useDispatch();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = cookie.get("user_token");
        if (!user && token) {
            // navigate("/");
        }
    }, [user]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const token = cookie.get("user_token");
        if (!user && !token) {
            navigate("/user/login");
        } else {
            getResults();
        }
    }, [user]);

    const getResults = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/quiz/user-results`);
            if (response.data.results) {
                setResults(response.data.results);
            }
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAccuracy = (marks, total) => {
        return Number(((marks / total) * 100).toFixed(2));
    };

    const getTag = (accuracy) => {
        if (accuracy >= 90) return "Excellent";
        if (accuracy >= 75) return "Good";
        if (accuracy >= 50) return "Needs Improvement";
        return "Poor";
    };

    const getCategoryColor = (categoryName, opacity = 1) => {
        switch (categoryName) {
            case "Web Development":
                return `rgba(76, 175, 80, ${opacity})`;
            case "Mobile Development":
                return `rgba(33, 150, 243, ${opacity})`;
            case "General Aptitude":
                return `rgba(255, 87, 34, ${opacity})`;
            default:
                return `rgba(156, 39, 176, ${opacity})`;
        }
    };

    const groupedResults = results.slice().reverse().reduce((acc, result) => {
        const categoryId = result.category_id._id;
        if (!acc[categoryId]) {
            acc[categoryId] = {
                label: result.category_id.name,
                data: [],
                borderColor: getCategoryColor(result.category_id.name),
                backgroundColor: getCategoryColor(result.category_id.name, 0.2),
                tension: 0.4,
                fill: true,
            };
        }
        acc[categoryId].data.push(calculateAccuracy(result.marks, result.answers.length));
        return acc;
    }, {});

    const chartData = {
        labels: results.slice().reverse().map((result) => new Date(result.createdAt).toLocaleDateString()),
        datasets: Object.values(groupedResults),
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const categoryName = context.dataset.label || "";
                        const accuracy = context.raw;
                        return `${categoryName}: Accuracy: ${accuracy}%`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                    font: {
                        family: "'Inter', sans-serif",
                        weight: "bold",
                    },
                    color: "rgb(55, 65, 81)",
                },
                grid: {
                    color: "rgba(55, 65, 81, 0.1)",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Accuracy (%)",
                    font: {
                        family: "'Inter', sans-serif",
                        weight: "bold",
                    },
                    color: "rgb(55, 65, 81)",
                },
                min: 0,
                max: 100,
                grid: {
                    color: "rgba(55, 65, 81, 0.1)",
                },
            },
        },
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200 px-6 py-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Your Quiz Results</h1>

                <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Accuracy Progress</h2>
                    {results.length > 0 ? (
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-gray-700 text-center">No results to display yet.</p>
                    )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <div
                                  key={index}
                                  className="p-4 bg-white rounded-xl shadow animate-pulse"
                              >
                                  <div className="w-full h-32 mb-4 bg-gray-300 rounded-md"></div>
                                  <div className="h-6 mb-2 bg-gray-300 rounded"></div>
                                  <div className="h-5 mb-2 bg-gray-300 rounded"></div>
                                  <div className="w-full h-2 mb-2 bg-gray-200 rounded-full"></div>
                                  <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                              </div>
                          ))
                        : results.map((result) => {
                              const totalQuestions = result.answers.length;
                              const accuracy = calculateAccuracy(result.marks, totalQuestions);
                              const tag = getTag(accuracy);

                              return (
                                  <Link
                                      to={`/result/${result._id}`}
                                      key={result._id}
                                      className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300"
                                  >
                                      <img
                                          src={result.category_id.image}
                                          alt={result.category_id.name}
                                          className="w-full h-32 object-cover rounded-md mb-3"
                                      />
                                      <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                          {result.category_id.name}
                                      </h2>
                                      <div className="text-lg font-bold text-gray-700 mb-1">
                                          {result.marks} / {totalQuestions}
                                      </div>
                                      <div className="mb-2">
                                          <div className="w-full h-2 bg-gray-200 rounded-full">
                                              <div
                                                  className="h-2 rounded-full"
                                                  style={{
                                                      width: `${accuracy}%`,
                                                      backgroundColor:
                                                          accuracy >= 90
                                                              ? "#4CAF50"
                                                              : accuracy >= 75
                                                              ? "#FFEB3B"
                                                              : "#FF5722",
                                                  }}
                                              ></div>
                                          </div>
                                          <p className="text-sm text-gray-600 mt-1">
                                              Accuracy: {accuracy}%
                                          </p>
                                      </div>
                                      <span
                                          className={`inline-block px-3 py-1 text-sm rounded-full text-white font-medium ${
                                              tag === "Excellent"
                                                  ? "bg-green-500"
                                                  : tag === "Good"
                                                  ? "bg-yellow-500"
                                                  : "bg-red-500"
                                          }`}
                                      >
                                          {tag}
                                      </span>
                                  </Link>
                              );
                          })}
                </div>
            </div>
        </div>
    );
}

export default QuizAnalysis;
