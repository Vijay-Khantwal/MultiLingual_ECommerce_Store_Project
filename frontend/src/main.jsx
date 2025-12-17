import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Router from "./routes";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <>
    <AuthProvider>
      <CartProvider>
        <Router />
        <div>
          <Toaster />
        </div>
      </CartProvider>
    </AuthProvider>
  </>
);
