import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateProfile
} from "../controllers/UserController.js";
import { protect } from "../middleware/auth.js";
import { createUserValidator, mongoIdParamValidator } from "../middleware/validators.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/",createUserValidator,validate, createUser);

router.get("/", getAllUsers);

router.get("/:id",mongoIdParamValidator,validate, getUserById);
router.put("/me", protect, updateProfile);

export {router as UserRouter};
