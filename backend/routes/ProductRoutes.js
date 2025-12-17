import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  searchProducts
} from "../controllers/ProductController.js";
import { protect, sellerOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect ,sellerOnly,createProduct);
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.delete("/:id", protect, sellerOnly, deleteProduct);
export {router as productRouter};
