import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/", createUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

export {router as UserRouter};
