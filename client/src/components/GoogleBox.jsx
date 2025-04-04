import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Cookie from "universal-cookie";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';

const GoogleBox = ({ setIsLoading }) => {
  const cookie = new Cookie();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential provided.");
      }

      const decodedToken = jwtDecode(credentialResponse.credential);
      const { name = "Anonymous", email, sub: google_id } = decodedToken;
      const sanitized_name = name.replace(/[^a-zA-Z\s]/g, "").trim();

      setIsLoading(true);

      const response = await axiosInstance.post(`/user/google_login`, {
        email,
        name: sanitized_name,
        google_id
      });

      if (response.data.status) {
        toast.success('Logged In Successfully');
        const token = response.data.token;
        if (token) {
          cookie.set(`user_token`, token, {
            path: '/',
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          });
          navigate(`/`);
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Google Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Login failed")} />
    </div>
  );
};

export default GoogleBox;
