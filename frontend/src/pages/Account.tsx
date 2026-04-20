import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useAppStore } from "../store/useAppStore";
const Account = () => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setIsAuth = useAppStore((state) => state.setIsAuth);

  const navigate = useNavigate();

  const firstLater = user?.name?.charAt(0).toUpperCase();

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    setUser(null);
    setIsAuth(false);
    toast.success("Logout Success");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold text-gray-800">My Account</h1>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            <AiOutlineHome className="w-5 h-5" />
            Home
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 border-b pb-5">
          {user?.image ? (
            <img
              src={user.image}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl font-bold">
              {firstLater}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">User ID</span>
            <span className="font-medium text-gray-800 truncate max-w-[180px]">
              {user?._id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-800 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center gap-2 border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <AiOutlineShoppingCart className="text-orange-600 w-6 h-6" />
            <span className="text-sm font-medium text-gray-700">My Orders</span>
          </button>

          {/* Address */}
          <button
            onClick={() => navigate("/address")}
            className="flex flex-col items-center justify-center gap-2 border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <HiOutlineLocationMarker className="text-orange-600 w-6 h-6" />
            <span className="text-sm font-medium text-gray-700">
              My Address
            </span>
          </button>
        </div>

        {/* Logout */}
        <div className="mt-8">
          <button
            onClick={logoutHandler}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
