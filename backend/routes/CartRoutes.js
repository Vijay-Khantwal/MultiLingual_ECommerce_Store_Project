import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/CartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);

router.delete("/remove", protect, removeFromCart);
router.put("/update", protect, updateCartItem);


export { router as CartRouter };
