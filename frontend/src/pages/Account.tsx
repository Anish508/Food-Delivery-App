import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import toast from "react-hot-toast";
import { AiOutlineHome } from "react-icons/ai";

const Account = () => {
  const { user, setUser, setIsAuth } = useAppData();

  const firstLater = user?.name.charAt(0).toUpperCase();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.setItem("token", "");
    setUser(null);
    setIsAuth(false);
    toast.success("Logout Success");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-orange-700 hover:text-orange-800 font-medium text-sm"
          >
            <AiOutlineHome className="w-5 h-5" />
            Home
          </button>
        </div>
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          {user?.image ? (
            <img
              src={user.image}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-orange-700 text-white flex items-center justify-center text-2xl font-bold">
              {firstLater}
            </div>
          )}

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {user?.name}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">User ID</span>
            <span className="font-medium text-gray-800 truncate max-w-[150px]">
              {user?._id}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-800 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={logoutHandler}
            className="w-full bg-orange-700 hover:bg-orange-800 text-white py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
