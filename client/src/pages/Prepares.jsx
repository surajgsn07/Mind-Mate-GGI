import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import toast from "react-hot-toast";

// Helper function
const getLevelClass = (level) => {
    switch (level) {
        case "easy":
            return "bg-green-500 text-white";
        case "medium":
            return "bg-yellow-500 text-white";
        case "hard":
            return "bg-red-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

const Prepare = () => {
    const { category_id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("any");
    const [answersVisibility, setAnswersVisibility] = useState(new Map());

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/question/${category_id}/all`);
                const data = response.data.data;
                setQuestions(data);
                setFilteredQuestions(data);

                const initialVisibility = new Map();
                data.forEach((q) => initialVisibility.set(q._id, false));
                setAnswersVisibility(initialVisibility);

                toast.success("Questions loaded successfully!");
            } catch (error) {
                toast.error("Failed to fetch questions. Redirecting to home.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [category_id, navigate]);

    const toggleAnswerVisibility = (questionId) => {
        setAnswersVisibility((prev) => {
            const newVisibility = new Map(prev);
            newVisibility.set(questionId, !newVisibility.get(questionId));
            return newVisibility;
        });
    };

    const filterQuestions = () => {
        let filtered = questions;

        if (searchTerm.trim()) {
            filtered = filtered.filter((q) =>
                q.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedLevel !== "any") {
            filtered = filtered.filter((q) => q.level === selectedLevel);
        }

        setFilteredQuestions(filtered);
    };

    useEffect(() => {
        filterQuestions();
    }, [searchTerm, selectedLevel]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="min-h-screen px-4 py-6 pt-20  bg-gradient-to-br from-blue-100 to-purple-200">
                {loading ? (
                    <div className="grid gap-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white rounded-lg shadow-lg  animate-pulse"
                            >
                                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                                <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Search by question title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded-md "
                            />

                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="w-full md:w-48 p-2 border rounded-md "
                            >
                                <option value="any">All Levels</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <p className="mb-4 text-lg">
                            Total Questions: {filteredQuestions.length}
                        </p>
                        <div className="grid gap-6">
                            {filteredQuestions.map((question, index) => (
                                <div
                                    key={question._id}
                                    className="p-6 bg-white rounded-lg shadow-lg "
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xl font-semibold">
                                            {index + 1}. {question.title}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelClass(
                                                question.level
                                            )}`}
                                        >
                                            {question.level}
                                        </span>
                                    </div>
                                    <ul className="pl-6 mb-4 list-disc">
                                        {question.options.map((option, optionIndex) => (
                                            <li key={optionIndex}>{option}</li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => toggleAnswerVisibility(question._id)}
                                        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        {answersVisibility.get(question._id)
                                            ? "Hide Answer"
                                            : "Show Answer"}
                                    </button>
                                    {answersVisibility.get(question._id) && (
                                        <div className="p-4 mt-4 bg-gray-100 rounded dark:bg-gray-700">
                                            <p><strong>Correct Answer:</strong></p>
                                            <p>{question.options[question.correctAnswerIndex]}</p>
                                            <p><strong>Explanation:</strong></p>
                                            <p>{question.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Prepare;
