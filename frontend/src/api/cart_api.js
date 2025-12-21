import api from "./axios";
import { toast } from "react-hot-toast";
import i18n from "../i18n";

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

    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error(i18n.t("cart.sessionExpired"));
      localStorage.clear();
      navigate("/login");
      return;
    }

    console.error(err);
  }
};

export const removeFromCart = async (queryParams) => {
  try {
    // console.log("removing", queryParams);
    const { data } = await api.delete(`/cart/remove`, { params: queryParams });
    return data;
  } catch (err) {
    toast.error(i18n.t("cart.errors.removeItem"));
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
