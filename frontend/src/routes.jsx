import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MarketPlace from "./pages/MarketPlace";
import NotFound from "./pages/NotFound";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";

import ProtectedRoute from "./auth/ProtectedRoute";
import SellerRoute from "./auth/SellerRoute";
import UserOrders from "./pages/UserOrders";
import Search from "./pages/Search";
import Profile from "./pages/Profile";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MarketPlace />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/orders",
    element: <UserOrders />,
  },
  {
    path: "/marketplace",
    element: <MarketPlace />,
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  /* ---------- AUTH ---------- */
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },

  /* ---------- PRODUCTS ---------- */
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },

  /* ---------- USER (PROTECTED) ---------- */
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },

  /* ---------- SELLER (PROTECTED) ---------- */
  {
    path: "/seller",
    element: (
      <SellerRoute>
        <SellerDashboard />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/add-product",
    element: (
      <SellerRoute>
        <AddProduct />
      </SellerRoute>
    ),
  },

  /* ---------- FALLBACK ---------- */
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={routes} />;
}
