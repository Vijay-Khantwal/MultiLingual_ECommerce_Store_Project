import express from "express";
import {
  getUserOrders,
  updateOrderStatus
} from "../controllers/OrderController.js";

import { protect, sellerOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/user", protect, getUserOrders);

router.put("/:id/status", protect, sellerOnly, updateOrderStatus);

export { router as OrderRouter };
