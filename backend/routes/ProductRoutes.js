import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  searchProducts
} from "../controllers/ProductController.js";
import { protect, sellerOnly } from "../middleware/auth.js";
import { mongoIdParamValidator } from "../middleware/validators.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/", protect ,sellerOnly,createProduct);
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", mongoIdParamValidator,validate,getProductById);
router.delete("/:id", protect, sellerOnly,mongoIdParamValidator,validate, deleteProduct);
export {router as productRouter};
