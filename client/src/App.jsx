import { Provider, useDispatch, useSelector } from "react-redux";
import "./App.css";
import { matchPath, Outlet, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import Navbar from "./pages/Home/components/Navbar";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import axiosInstance from "./config/axiosConfig";
import { addUser } from "../store/userSlice";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const cookies = new Cookies();

  useEffect(() => {
    const fetchUser = async () => {
      const token = cookies.get("user_token");
      console.log(token);
      if (token) {
        try {
          const res = await axiosInstance.get("/user");
          if (res.data?.user) {
            dispatch(addUser(res.data.user));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, []);

    // List of routes where Navbar should be hidden
    const hideNavbarRoutes = [
      "/chat",
      "/analysis",
      "/playground",
      "/quiz",
      "/quiz/:category_id",
      "/result/:result_id",
      "/results",
      "/prepare/:category_id",
      '/mockInterview',
      "/interview-analysis"
    ];
    

  // Check if current path matches any in hideNavbarRoutes
  const shouldHideNavbar = hideNavbarRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  return (
    <div className="">
      {/* Hide Navbar on certain routes */}
   {!shouldHideNavbar && <Navbar />}

      <Outlet />

      <Toaster />
    </div>
  );
}

export default App;
