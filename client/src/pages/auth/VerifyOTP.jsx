import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axiosConfig";
import signinImg from "./signin.png";


const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location  = useLocation();
  const email = location.state?.email


  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Please enter a 6-digit OTP");
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        email,
        otp: finalOtp,
      });
      toast.success(res?.data?.message || "OTP Verified Successfully");
      navigate("/community");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1 w-1/2">
        <img
          src={signinImg}
          alt="Verify OTP Visual"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 w-full flex justify-center items-center px-4">
        <div className="py-8 px-5 bg-white rounded-2xl mt-20 max-sm:mt-16 max-w-[450px] w-full shadow-lg drop-shadow-[0_3px_6px_rgba(4,120,87,0.4)]">
          <h1 className="text-center text-2xl font-bold text-stone-900 mb-6">
            VERIFY YOUR EMAIL
          </h1>

          <p className="text-center text-sm text-gray-500 mb-6">
            Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex gap-3 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md disabled:opacity-50 transition-all duration-200"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
