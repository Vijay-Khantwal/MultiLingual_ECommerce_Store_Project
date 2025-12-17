import api from "./axios";

export const getSellerOrders = (queryParams) =>
  api.get("/seller/orders",{params : queryParams});

export const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, { status });

export const placeOrder = () =>
  api.post("/orders");

export const getUserOrders = (queryParams) =>
  api.get(`/orders/user` , {params : queryParams});