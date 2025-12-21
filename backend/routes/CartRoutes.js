import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem
} from "../controllers/CartController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  addToCartValidator,
  updateCartItemValidator,
  removeFromCartValidator,
  getCartValidator
} from "../middleware/validators.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  addToCartValidator,
  validate,
  addToCart
);

router.get(
  "/",
  protect,
  getCartValidator,
  validate,
  getCart
);

router.put(
  "/update",
  protect,
  updateCartItemValidator,
  validate,
  updateCartItem
);

router.delete(
  "/remove",
  protect,
  removeFromCartValidator,
  validate,
  removeFromCart
);

export { router as CartRouter };
