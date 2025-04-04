import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeCookie } from "../../../utils/cookiesApi";
import toast from "react-hot-toast";
import { addUser } from "../../../../store/userSlice";
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Mentors", href: "/mentors" },
  { label: "AI Tutor", href: "/mockInterview" },
  // { label: "Career Path", href: "/career-path" },
  // { label: "Notes Summarizer", href: "/notes-summarizer" },
  { label: "Communities", href: "/community" },
  // { label: "My Appointments", href: "/appointments" },
 
];
// import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const cookies = new Cookies();
  const currUserData = useSelector((state) => state.user);
const dispatch = useDispatch();
const navigate=useNavigate();
  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  // const navigate = useNavigate();

  const handleLogout = () => {

    toast.success("Logged out successfully");
    dispatch(addUser(null));  
    cookies.remove("user_token");
    navigate("/login");
  };
  
  // console.log(currUserData);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg shadow-sm px-10 h-20 felx items-center border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="flex items-center flex-shrink-0">
            <div
              className={`text-2xl  font-bold w-20 p-3 rounded-b-full object-cover h-20 overflow-clip" `}
            >
              <img src="/logo.png" alt="logo " className=" rounded-full object-cover " />
            </div>
          </Link>
          <ul className="hidden lg:flex ml-14 space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link className="hover:text-teal-600 font-semibold" to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-4 items-center">
            {currUserData ? (
              <>
                <button
                  onClick={handleLogout}
                  className="py-2 px-3 border rounded-md"
                >
                  Log out
                </button>

                <button
                  onClick={() => {

                    navigate("/chat");

                  }}
                  className="py-2 px-3 border rounded-md bg-gradient-to-r from-teal-600 to-teal-800  text-white font-semibold"
                >
                  {currUserData.name}'s 
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <Link to={"/login"} className="py-2 px-3 border rounded-md">
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="text-white bg-gradient-to-r from-teal-600 to-teal-800 py-2 px-3 rounded-md"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-white w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <button
                onClick={handleLogout}
                className="py-2 px-3 border rounded-md"
              >
                Log in
              </button>
              <Link
                to="/signup"
                className="py-2 px-3 rounded-md hover:opacity-75  bg-gradient-to-r from-teal-600 to-teal-800 "
              >
                Create an account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
