import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const authService = "/api";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="211365934869-h4qamlcgn0dpjd9ubb1u0f5va21d7dpd.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
);
