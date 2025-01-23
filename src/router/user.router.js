import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/users", getUsers);

router.get("/users/:userId", getUserById);

router.put("/users/:userId", updateUser);

router.delete("/users/:userId", deleteUser);

export default router;