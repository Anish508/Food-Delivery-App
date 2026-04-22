import { useState } from "react";
import axios from "axios";
import { useAppStore } from "../store/useAppStore";
import { restauranrService } from "../main";

interface props {
  fetchMyRestaurant: () => Promise<void>;
}
const AddRestaurant = ({ fetchMyRestaurant }: props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const location = useAppStore((state) => state.location);
  const loadingLocation = useAppStore((state) => state.loadingLocation);
  const fetchGeoLocation = useAppStore((state) => state.fetchGeoLocation);

  const validate = () => {
    if (!name.trim()) return "Restaurant name is required";
    if (!phone || phone.length < 10) return "Valid phone number required";
    if (!image) return "Image is required";
    if (!location) return "Location is required";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("phone", phone);
      formData.append("latitude", String(location?.latitude));
      formData.append("longitude", String(location?.longitude));
      formData.append("formattedAddress", location?.formattedAddress || "");
      formData.append("image", image as Blob);

      const res = await axios.post(`${restauranrService}/new`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.message || "Restaurant created successfully");
      fetchMyRestaurant();

      // reset
      setName("");
      setDescription("");
      setPhone("");
      setImage(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Add Restaurant</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div>
          <label className="text-sm font-medium">Restaurant Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Enter restaurant name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Write something about your restaurant"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone *</label>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Location *</label>
          <button
            type="button"
            onClick={fetchGeoLocation}
            className="w-full bg-gray-200 p-2 rounded-lg mt-1 hover:bg-gray-300"
          >
            {loadingLocation
              ? "Fetching location..."
              : location
                ? "Location detected ✅"
                : "Detect Location"}
          </button>
          {location && (
            <p className="text-xs text-gray-600 mt-1">
              {location.formattedAddress}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full mt-1"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="mt-2 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {submitting ? "Creating..." : "Create Restaurant"}
        </button>
      </form>
    </div>
  );
};

export default AddRestaurant;
