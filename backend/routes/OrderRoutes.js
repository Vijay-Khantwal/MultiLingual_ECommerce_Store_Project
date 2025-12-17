import express from "express";
import {
  placeOrder,
  getUserOrders,
  updateOrderStatus
} from "../controllers/OrderController.js";

import { protect, sellerOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/user", protect, getUserOrders);

router.put("/:id/status", protect, sellerOnly, updateOrderStatus);

export { router as OrderRouter };
