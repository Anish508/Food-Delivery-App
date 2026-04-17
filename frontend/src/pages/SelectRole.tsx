import React, { useState, useEffect } from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../main";

type Role = "customer" | "rider" | "seller" | null;

const SelectRole = () => {
  const [role, setRole] = useState<Role>(null);
  const { setUser, user, loading } = useAppData();
  const navigate = useNavigate();

  // Redirect to home if user already has a role
  useEffect(() => {
    if (!loading && user?.role) {
      navigate("/", { replace: true });
    }
  }, [user?.role, loading, navigate]);

  const roles: Role[] = ["customer", "rider", "seller"];

  const addRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${authService}/api/auth/add-role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("token", data.token);
      setUser(data.user);

      navigate("/", { replace: true });
    } catch (error) {
      alert("Something went wrong...");
      console.log(error);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Choose Your Role
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Select how you want to use the platform
        </p>

        <div className="space-y-4">
          {roles.map((r) => (
            <div
              key={r}
              onClick={() => setRole(r)}
              className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition ${
                role === r
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-400"
              }`}
            >
              <div>
                <h2 className="font-medium capitalize">{r}</h2>
                <p className="text-sm text-gray-500">
                  {r === "customer" && "Order food from restaurants"}
                  {r === "rider" && "Deliver food and earn"}
                  {r === "seller" && "Sell your food online"}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  role === r
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={addRole}
          disabled={!role}
          className={`w-full mt-6 py-3 rounded-xl text-white font-medium transition ${
            role
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
