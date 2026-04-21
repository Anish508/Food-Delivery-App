import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ["aspirate-staple-hardware.ngrok-free.dev"],
    proxy: {
      "/api/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api/restaurant": {
        target: "http://localhost:7000",
        changeOrigin: true,
      },
      /* "/api/rider": {
        target: "http://localhost:8002",
        changeOrigin: true,
      },
      "/api/order": {
        target: "http://localhost:8003",
        changeOrigin: true,
      }, */
    },
  },
});
