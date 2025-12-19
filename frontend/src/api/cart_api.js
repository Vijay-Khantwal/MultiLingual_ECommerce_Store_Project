import api from "./axios";
import { toast } from "react-hot-toast";

export const addToCart = async ({ productId, quantity, navigate }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    const err = new Error("NOT_AUTHENTICATED");
    err.code = 401;
    throw err;
  }
  try {
    const { data } = await api.post("/cart/add", {
      productId,
      quantity,
    });

    // toast.success("Added to cart");
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again");
      localStorage.clear();
      navigate("/login");
      return;
    }

    toast.error(err.response?.data?.message || "Something went wrong");
  }
};

export const removeFromCart = async (queryParams) => {
  try {
    // console.log("removing", queryParams);
    const { data } = await api.delete(`/cart/remove`, { params: queryParams });
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to remove item");
    throw err;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await api.put("/cart/update", {
    itemId,
    quantity,
  });
  return data;
};

export const getCart = (queryParams) =>
  api.get("/cart", { params: queryParams });
