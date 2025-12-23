import Review from "../models/Review.js";
import Order from "../models/Order.js";
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    const hasPurchased = await Order.findOne({
      userId,
      "items.productId": productId,
      status: { $in: ["PLACED", "PAID", "SHIPPED", "DELIVERED"] },
    });

    if (!hasPurchased) {
      return res
        .status(403)
        .json({ message: "You must purchase this product to review it" });
    }

    const existingReview = await Review.findOne({
      userId,
      productId,
    });

    if (existingReview) {
      await Review.deleteOne({ _id: existingReview._id });
    }
    const review = await Review.create({
      productId,
      rating,
      comment,
      userId,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({
    productId: req.params.productId,
  }).populate("userId", "name");

  res.json(reviews);
};
