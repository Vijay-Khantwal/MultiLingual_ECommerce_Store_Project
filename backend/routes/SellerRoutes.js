import express from "express";
import { protect, sellerOnly } from "../middleware/auth.js";
import {
  getSellerProducts,
  getSellerOrders,
  updateProduct,
} from "../controllers/SellerController.js";
import { mongoIdParamValidator } from "../middleware/validators.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/products", protect, sellerOnly, getSellerProducts);
router.put(
  "/product/:id",
  protect,
  sellerOnly,
  mongoIdParamValidator,
  validate,
  updateProduct
);

router.get("/orders", protect, sellerOnly, getSellerOrders);

export { router as SellerRouter };
