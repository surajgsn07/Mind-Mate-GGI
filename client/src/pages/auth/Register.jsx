import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
// import Navbar from "../Home/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
// import PasswordInp from "./components/PasswordInp";
import Cookies from "universal-cookie";
// import { serverUrl } from "../../constants/apiurls";
// import { useRecoilState } from "recoil";
// import { userData } from "../../atoms/state";
import Loader from "../../components/common/Loader";
import PasswordInp from "./PasswordInp";
import UserRegister from "./componenets/UserRegister";
import TherapistRegister from "./componenets/TherapistRegister";
const cookies = new Cookies(null, { path: "/" });
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../store/userSlice";
import axiosInstance from "../../config/axiosConfig.js";
import GoogleBox from "../../components/GoogleBox.jsx";
import signinImg from "./signin.png"
const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const currentUserData = useSelector((state) => state.user);
  console.log(currentUserData);
  const dispatch = useDispatch();
  const [asUserRegister, setAsUserRegister] = useState(true);

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    dob: '',
    gender: "",
    type: "",
    phone: "",

  });
  const [therapistData, setTherapistData] = useState({
    email: "",
    password: "",
    name: "",
    specialization: "",
    experience: "",
    gender: "",
    phone: "",
    virtualFee: "",
  });

  // Route protection if log In is true
  //   useEffect(() => {
  //     const token = cookies.get("authToken");
  //     if (token || currentUserData) {
  //       navigate("/");
  //     }
  //   }, []);

  const userOnChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setData({
      ...data,
      [name]: value,
    });
  };
  const therapistOnChange = (e) => {
    const { name, value } = e.target;
    setTherapistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res = null;
      if (asUserRegister)
        res = await axiosInstance.post(
          `/user/register`,
          {
            ...data,
          }
        );
      else {
        res = await axiosInstance.post(
          `/therapist/register`,
          {
            ...therapistData,
          }
        );
      }

      console.log({ res })
      toast.success(res?.data?.message || "Success");
      cookies.set("user_token", res?.data?.token);
      dispatch(addUser(res?.data?.user));
      navigate("/chat");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // const handleGoogleLoginFailure = async (error) => {
  //   toast.error("Something went wrong please try again");
  //   console.log(error);
  // };
  // const handleGoogleLoginSuccess = async (response) => {
  //   console.log(response);
  //   if (!response.credential) return console.log("Login Failed");
  //   try {
  //     setLoading(true);
  //     const res = await axios.post(`${serverUrl}/user/gsignin`, {
  //       tokenId: response.credential,
  //     });

  //     toast.success(res?.data?.message || "Success");
  //     cookies.set("authToken", res?.data?.token);
  //     setUserData(res?.data?.user);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Something went wrong");
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  return (
    <div className="flex gap-5 ">

      <div className="flex-1 w-1/2">
        <img src={signinImg} alt="da" className="w-full h-full object-cover" />
      </div>

      <div className="p-4 flex-1 w-full flex justify-center items-center">
        <div
          className="py-5 md:px-5 p-3  drop-shadow-[0_3px_6px_rgba(4,120,87,0.4)] bg-white  rounded-2xl mt-20 max-sm:mt-16 max-w-[500px] h-fit flex-1   shadow-sm"
        >
          <h1 className="text-center text-2xl font-bold text-stone-900 my-4">
            REGISTER HERE
          </h1>

          <div className="text-center my-4 gap-4 flex items-center">
            {/* User Tab */}
            <div
              onClick={() => setAsUserRegister(true)}
              className={`py-3 rounded-3xl cursor-pointer flex-1 transition-all duration-300 ${asUserRegister
                  ? "bg-gradient-to-r from-teal-800 to-teal-500 text-white font-semibold"
                  : "border-teal-500 border-2 text-stone-900"
                }`}
            >
              As User
            </div>

            {/* Therapist Tab */}
            <div
              onClick={() => setAsUserRegister(false)}
              className={`py-3 rounded-3xl cursor-pointer flex-1 transition-all duration-300 ${!asUserRegister
                  ? "bg-gradient-to-r from-teal-800 to-teal-500 text-white font-semibold"
                  : "border-teal-500 border-2 text-stone-900"
                }`}
            >
              As Mentor
            </div>
          </div>

          {asUserRegister ? (
            <UserRegister
              handleChange={userOnChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          ) : (
            <TherapistRegister
              handleChange={therapistOnChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}

          <div className="text-center my-4 gap-4 flex items-center ">
            <div className="h-[1px] flex-1   bg-gradient-to-r from-teal-800 to-teal-500   "></div>
            or
            <div className="h-[1px] flex-1 bg-gradient-to-r from-teal-800 to-teal-500   "></div>
          </div>
          <GoogleBox />
          {/* <GoogleOAuthProvider clientId="702829994495-1vhv30rsk04lssok9o2lmqi5d1cd7cha.apps.googleusercontent.com">
            <div className="md:w-[450px] max-sm:w-[260px] border-none  rounded-full mx-auto">
              <div className="mt-4  rounded-full dark:bg-stone-800">
                <GoogleLogin
                  theme={`dark`}
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                />
              </div>
            </div>
          </GoogleOAuthProvider> */}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Register;
