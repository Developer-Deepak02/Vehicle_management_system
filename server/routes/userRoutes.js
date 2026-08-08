import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
	admin,
	manager,
	adminAndManager,
} from "../middleware/adminMiddleware.js";
import {
  getUsers,
	getCurrentUser,
	updateCurrentUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/all-users", protect, adminAndManager , getUsers);
router.get("/me", protect, getCurrentUser);
router.put("/update-me", protect, updateCurrentUser);

export default router;
