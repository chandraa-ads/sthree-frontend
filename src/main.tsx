import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async"; // ✅ import HelmetProvider

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <HelmetProvider> {/* ✅ Wrap everything with HelmetProvider */}
      <StrictMode>
        <App />
      </StrictMode>
    </HelmetProvider>
  </GoogleOAuthProvider>
);
