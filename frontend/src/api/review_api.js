import api from "./axios";

export const addReview = (data) =>
  api.post("/reviews", data);

export const getReviews = (productId) =>
  api.get(`/reviews/product/${productId}`);
