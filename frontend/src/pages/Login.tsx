import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle, FaLock } from "react-icons/fa";
import { useAppData } from "../context/AppContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useAppData();

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/login`, {
        code: authResult.code,
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);

      // Refetch user data to update context
      await refetchUser();

      // Navigate to select-role; ProtectedRoute will redirect to / if user has role
      navigate("/select-role", { replace: true });
    } catch (error) {
      console.log("error", error);
      toast.error("Problem while login");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: () => {
      toast.error("Google login failed");
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          {/* Logo / Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">FoodHub</h1>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </div>

          {/* Google Button */}
          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-70"
          >
            <FaGoogle className="text-red-500" />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Info */}
          <div className="text-center text-sm text-gray-600">
            New here? Sign in with Google to create an account instantly.
          </div>

          {/* Footer */}
          <div className="text-xs text-center text-gray-500 space-y-2">
            <p>
              By continuing, you agree to our{" "}
              <span className="text-gray-800 font-medium cursor-pointer">
                Terms
              </span>{" "}
              &{" "}
              <span className="text-gray-800 font-medium cursor-pointer">
                Privacy Policy
              </span>
            </p>

            <div className="flex items-center justify-center gap-2 text-gray-500">
              <FaLock size={14} />
              <span>Secure authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
