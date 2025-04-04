import { useEffect, useState } from "react";
import { FaBook, FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { useSelector } from "react-redux";


function Category() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get("/category");
                if (response.data.status) {
                    setCategories(response.data.data);
                } else {
                    console.error("Failed to fetch categories");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
        window.scrollTo(0, 0);
    }, []);

    const handleClick = (categoryId) => {
        if (user) {
            navigate(`/quiz/${categoryId}`);
        } else {
            navigate(`/user/login`);
        }
    };

    return (
        <>
    
            <div className="min-h-screen pt-10  bg-gradient-to-br from-blue-100 to-purple-200">
                <div className="px-4 py-16 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800">
                        Choose a Category
                    </h1>
                    <p className="mt-3 text-center text-gray-600 ">
                        Start your quiz journey by selecting a category below!
                    </p>
                     <Link
                                to="/results"
                                className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
                              >
                                Quiz Results
                    </Link>

                    <div className="grid grid-cols-1 gap-12 mt-12 sm:grid-cols-2 lg:grid-cols-3">
                        {isLoading
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="relative overflow-hidden rounded-xl shadow-lg bg-gray-200 animate-pulse"
                                >
                                    <div className="w-full h-52 bg-gray-300"></div>
                                    <div className="p-6">
                                        <div className="h-6 mb-4 bg-gray-300 rounded"></div>
                                        <div className="h-10 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            ))
                            : categories.map((category) => (
                                <motion.div
                                    key={category._id}
                                    className="relative overflow-hidden transition-transform duration-500 shadow-lg cursor-pointer rounded-xl hover:shadow-2xl"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div
                                        className="relative"
                                        onClick={() => handleClick(category._id)}
                                    >
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="object-fill w-full h-52 rounded-t-xl"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/30 hover:opacity-100">
                                            <FaPlay className="text-5xl text-white animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {category.name}
                                        </h3>
                            
                                        <Link
                                            to={`/prepare/${category._id}`}
                                            className="flex my-3 float-right items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ease-in-out"
                                        >
                                            <FaBook className="text-xl" />
                                            <span>Prepare</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Category;
