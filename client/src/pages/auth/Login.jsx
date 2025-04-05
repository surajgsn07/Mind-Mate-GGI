import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getCookie, setCookie } from "../../utils/cookiesApi";
import axiosInstance from "../../config/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import PasswordInp from "./PasswordInp";
import Loader from "../../components/common/Loader";
import GoogleBox from "../../components/GoogleBox";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../../../store/userSlice";
import loginImg from './login.png';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const currentUserData = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getCookie("user_token");
    if (currentUserData || token) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/user/login`, { ...data });
      toast.success(res?.data?.message || "Success");
      setCookie("user_token", res?.data?.token);
      dispatch(addUser(res?.data?.user));
      console.log(res);
      navigate("/community");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center  justify-center px-6">
      <div className="hidden md:block md:w-1/2 max-sm:hidden">
        <img src={loginImg} className="w-full h-full object-cover" alt="" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className=" shadow-xl rounded-3xl mx-auto p-8 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-extrabold  mb-6">Welcome Back</h1>
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
            type="email"
            onChange={handleChange}
            name="email"
            placeholder="Email"
            required
          />
          <PasswordInp onChange={handleChange} placeholder="Password" name="password" />
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 transition-all duration-300 text-white font-semibold rounded-lg"
          >
            {loading ? <Loader /> : "Login"}
          </motion.button>
        </form>
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          Not Having an Account? <Link to="/register" className="text-emerald-500 font-semibold">Register here</Link>
        </div>
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-400" />
          <span className="text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-400" />
        </div>
        <GoogleBox setIsLoading={setLoading} />
      </motion.div>
    </div>
  );
}