import express from "express";
import { protect, sellerOnly } from "../middleware/auth.js";
import {
  getSellerProducts,
  getSellerOrders
} from "../controllers/SellerController.js";

const router = express.Router();

router.get("/products", protect, sellerOnly, getSellerProducts);

router.get("/orders", protect, sellerOnly, getSellerOrders);

export {router as SellerRouter};