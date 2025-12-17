import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  const review = await Review.create(req.body);
  res.json(review);
};

export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({
    productId: req.params.productId
  }).populate("userId", "name");

  res.json(reviews);
};
