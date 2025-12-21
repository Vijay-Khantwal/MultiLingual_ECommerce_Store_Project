import express from "express";
import {
  addReview,
  getProductReviews
} from "../controllers/ReviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/",protect, addReview);

router.get("/product/:productId", getProductReviews);

export {router as ReviewRouter};
