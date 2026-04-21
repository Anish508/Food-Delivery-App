import { create } from "zustand";
import axios from "axios";
import { authService } from "../main";
import type { User, LocationData } from "../types";

interface AppState {
  user: User | null;
  isAuth: boolean;
  loading: boolean;

  location: LocationData | null;
  city: string;
  loadingLocation: boolean;

  // actions
  setUser: (user: User | null) => void;
  setIsAuth: (value: boolean) => void;
  setLoading: (value: boolean) => void;

  setLoadingLocation: (value: boolean) => void;
  setLocation: (value: LocationData | null) => void;

  fetchUser: () => Promise<void>;
  fetchGeoLocation: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuth: false,
  loading: true,

  location: null,
  city: "Fetching Location",
  loadingLocation: false,

  setUser: (user) => set({ user }),
  setIsAuth: (value) => set({ isAuth: value }),
  setLoading: (value) => set({ loading: value }),
  setLoadingLocation: (value) => set({ loadingLocation: value }),
  setLocation: (location) => set({ location }),

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({ loading: false });
        return;
      }

      const { data } = await axios.get(`${authService}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        user: data,
        isAuth: true,
      });
    } catch (error) {
      console.log(error);
      set({
        user: null,
        isAuth: false,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchGeoLocation: async () => {
    if (!navigator.geolocation) {
      alert("Please Allow Location to Continue");
      return;
    }

    set({ loadingLocation: true });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
          );

          const geoData = await res.json();

          // Always prefer English-safe fields
          const city =
            geoData.address?.road ||
            geoData.address?.quarter ||
            geoData.address?.suburb ||
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.state_district ||
            "Unknown";

          const locationData: LocationData = {
            latitude,
            longitude,
            formattedAddress: geoData.display_name || "Unknown location",
          };

          set({
            location: locationData,
            city,
            loadingLocation: false,
          });
        } catch (error) {
          console.log(error);
          set({ loadingLocation: false });
        }
      },
      (error) => {
        console.log(error);
        set({ loadingLocation: false });
      },
    );
  },
}));
