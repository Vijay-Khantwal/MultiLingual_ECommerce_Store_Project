import express from "express";
import {
  addReview,
  getProductReviews
} from "../controllers/ReviewController.js";
import { protect } from "../middleware/auth.js";
import { addReviewValidator } from "../middleware/validators.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/",protect, addReviewValidator,  validate, addReview);

router.get("/product/:productId", getProductReviews);

export {router as ReviewRouter};
