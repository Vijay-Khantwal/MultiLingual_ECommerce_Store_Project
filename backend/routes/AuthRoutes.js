import express from "express";
import { login, register } from "../controllers/AuthController.js";
import { createUserValidator } from "../middleware/validators.js";
import { validate } from "../middleware/validate.js";
import { body } from "express-validator";
const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  login
);
router.post("/register", createUserValidator, validate, register);

export { router as AuthRouter };
