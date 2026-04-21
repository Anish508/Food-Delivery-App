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

      const { data } = await axios.get(`${authService}/auth/me`, {
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
    console.log("fetchGeoLocation called");
    if (!navigator.geolocation) {
      console.error("Geolocation not available");
      set({ city: "Location Unavailable", loadingLocation: false });
      return;
    }

    set({ loadingLocation: true });
    console.log("start - requesting geolocation");

    // Wrap the callback-based API in a Promise so we can race it
    // against a hard deadline. On Windows + Chrome + http://localhost,
    // the OS Location Service can hang silently — neither the success
    // nor the error callback fires. Promise.race() guarantees we always
    // resolve within GEOLOCATION_TIMEOUT_MS.
    const GEOLOCATION_TIMEOUT_MS = 10_000;

    const getPositionPromise = (): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          // Pass a slightly longer timeout to the browser so our
          // Promise.race() deadline fires first, giving us control.
          timeout: GEOLOCATION_TIMEOUT_MS + 2000,
          maximumAge: 60_000, // Accept a position up to 1 min old
        });
      });

    const timeoutPromise = (): Promise<never> =>
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("GEOLOCATION_TIMEOUT")),
          GEOLOCATION_TIMEOUT_MS,
        ),
      );

    try {
      const position = await Promise.race([
        getPositionPromise(),
        timeoutPromise(),
      ]);

      const { latitude, longitude } = position.coords;
      console.log(`Got position — Lat: ${latitude}, Lon: ${longitude}`);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
        {
          headers: {
            // Nominatim requires a User-Agent identifying your app
            "User-Agent": "Tomato-FoodDelivery-App/1.0",
          },
        },
      );

      if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

      const geoData = await res.json();
      console.log("Nominatim response:", geoData);

      const formattedAddress = geoData.display_name || "Current location";
      const locationData: LocationData = {
        latitude,
        longitude,
        formattedAddress,
      };

      set({
        location: locationData,
        city:
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          "Your Location",
        loadingLocation: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (message === "GEOLOCATION_TIMEOUT") {
        console.warn(
          "Geolocation timed out after 10 s. " +
            "This is common on Windows when OS Location Services are disabled. " +
            "Check: Settings → Privacy & Security → Location → On.",
        );
      } else {
        console.error("Geolocation failed:", message);
      }
      // Always unblock the UI — never leave loadingLocation: true
      set({ city: "Set Location", loadingLocation: false });
    }
  },
}));
