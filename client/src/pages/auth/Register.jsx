import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { addUser } from "../../../store/userSlice";
import axiosInstance from "../../config/axiosConfig.js";
import GoogleBox from "../../components/GoogleBox.jsx";
import signinImg from "./signin.png";
import UserRegister from "./componenets/UserRegister";

const cookies = new Cookies(null, { path: "/" });

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    gender: "",
    type: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidDateOfBirth = (dob) => {
    const selectedDate = new Date(dob);
    const today = new Date();
  
    // Check if DOB is in the future
    if (selectedDate >= today) return false;
  
    // Calculate age
    const age = today.getFullYear() - selectedDate.getFullYear();
  
    return age >= 5;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(data.phone)) {
        return toast.error("Phone number must be a valid 10-digit number.");
      }

    // Basic validations
    if (!isValidDateOfBirth(data.dob)) {
      return toast.error("Registeration birth should be atleast 5 years ago.");
    }

    if (!data.password || data.password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/user/register`, data);
      toast.success(res?.data?.message || "Registration successful");
      navigate('/verify-otp' , {
        state: {
          email : data.email
        }
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1 w-1/2">
        <img src={signinImg} alt="Sign In Visual" className="w-full h-full object-cover" />
      </div>

      <div className="p-4 flex-1 w-full flex justify-center items-center">
        <div className="py-5 md:px-5 p-3 bg-white rounded-2xl mt-20 max-sm:mt-16 max-w-[500px] flex-1 shadow-sm drop-shadow-[0_3px_6px_rgba(4,120,87,0.4)]">
          <h1 className="text-center text-2xl font-bold text-stone-900 my-4">
            REGISTER HERE
          </h1>

          <UserRegister
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />


        </div>
      </div>
    </div>
  );
};

export default Register;
