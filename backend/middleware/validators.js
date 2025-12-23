import { body, param, query } from "express-validator";

export const createUserValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["CONSUMER", "SELLER", "ADMIN"])
    .withMessage("Invalid role"),

  body("lang").optional().isString(),

  body("address.fullName").optional().isString(),

  body("address.phone")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("address.street").optional().isString(),
  body("address.city").optional().isString(),
  body("address.state").optional().isString(),
  body("address.pincode")
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Invalid pincode"),
];

export const mongoIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid MogoDB ID"),
];

export const addToCartValidator = [
  body("productId").isMongoId().withMessage("Invalid product id"),

  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const updateCartItemValidator = [
  body("itemId").isMongoId().withMessage("Invalid cart item id"),

  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const removeFromCartValidator = [
  query("itemId").isMongoId().withMessage("Invalid cart item id"),
];

export const getCartValidator = [
  query("lang")
    .optional()
    .isIn(["english", "hindi"])
    .withMessage("Invalid language"),
];

export const addReviewValidator = [
  body("productId").isMongoId().withMessage("Invalid product id"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
];
