import express from "express";
import {
  addReview,
  getProductReviews
} from "../controllers/ReviewController.js";

const router = express.Router();

router.post("/", addReview);

router.get("/product/:productId", getProductReviews);

export {router as ReviewRouter};
