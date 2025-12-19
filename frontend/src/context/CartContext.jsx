import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
} from "../api/cart_api.js";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { lang } = useAuth();

  // Load cart initially
  useEffect(() => {
    if (!lang) return;
    loadCart();
  }, [lang]);

  const loadCart = async () => {
    try {
      const res = await getCart({ lang });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async ({ productId, quantity, product }) => {
    try {
      await apiAddToCart({ productId, quantity });

      setCartItems((prev) => {
        const exists = prev.some((item) => item.product._id === productId);
        if (exists) return prev;

        return [...prev, { productId, product, quantity }];
      });

      toast.success("Added to cart");
      return true;
    } catch (err) {
      if (err.code === 401 || err.response?.status === 401) {
        toast.error("Please login to add items to cart");
        return false;
      }

      toast.error("Failed to add to cart");
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== productId));
    try {
      // console.log("getting",productId);
      await apiRemoveFromCart({ itemId: productId });
    } catch {
      loadCart();
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
