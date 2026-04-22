import { useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restauranrService } from "../main";
import toast from "react-hot-toast";
import { BiEdit, BiMapPin, BiSave } from "react-icons/bi";

interface props {
  resaturant: IRestaurant;
  isSeller: boolean;
  onUpdate: (restaurant: IRestaurant) => void;
}

const RestaurantProfile = ({ resaturant, isSeller, onUpdate }: props) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(resaturant.name);
  const [description, setDescription] = useState(resaturant.description);
  const [isOpen, setIsOpen] = useState(resaturant.isOpen);
  const [loading, setLoading] = useState(false);

  const toggleOpenStatus = async () => {
    try {
      const { data } = await axios.put(
        `${restauranrService}/status`,
        { status: !isOpen },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success(data.message);
      setIsOpen(data.restaurant.isOpen);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${restauranrService}/edit`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      onUpdate(data.restaurant);
      toast.success(data.message);
      setEditMode(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* 🔹 Image */}
      {resaturant.image && (
        <img
          src={resaturant.image}
          alt="Restaurant"
          className="h-48 w-full object-cover md:h-64"
        />
      )}

      {/* 🔹 Content */}
      <div className="p-5 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="w-full">
            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                {resaturant.name}
              </h2>
            )}

            {/* Location */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <BiMapPin className="text-red-500" />
              <span>
                {resaturant.autoLocation?.formattedAddress ||
                  "Location Unavailable"}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          {isSeller && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="self-start text-gray-500 hover:text-black transition"
            >
              <BiEdit size={20} />
            </button>
          )}
        </div>

        {/* Description */}
        {editMode ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            {resaturant.description || "No description added"}
          </p>
        )}

        {/* Status + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
          {/* Status */}
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${
              isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {isOpen ? "OPEN" : "CLOSED"}
          </span>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            {editMode && (
              <button
                onClick={saveChanges}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                <BiSave />
                {loading ? "Saving..." : "Save"}
              </button>
            )}

            {isSeller && (
              <button
                onClick={toggleOpenStatus}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                  isOpen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isOpen ? "Close Restaurant" : "Open Restaurant"}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400">
          Created on {new Date(resaturant.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default RestaurantProfile;
