import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restauranrService } from "../main";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantProfile from "../components/RestaurantProfile";

type sellerTab = "menu" | "add-item" | "sales";

const Restaurant = () => {
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<sellerTab>("menu");

  const fetchMyRestaurant = async () => {
    try {
      const { data } = await axios.get(`${restauranrService}/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRestaurant(data.restaurant);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRestaurant();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading your restaurant...</p>
      </div>
    );
  }

  if (!restaurant) {
    return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        <RestaurantProfile
          resaturant={restaurant}
          onUpdate={setRestaurant}
          isSeller={true}
        />

        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex border-b">
            {[
              { key: "menu", label: "Menu Items" },
              { key: "add-item", label: "Add Item" },
              { key: "sales", label: "Sales" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as sellerTab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  tab === t.key
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === "menu" && <p>Menu Page</p>}
            {tab === "add-item" && <p>Add Item Page</p>}
            {tab === "sales" && <p>Sales Page</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
