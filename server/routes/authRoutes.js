import express from "express";
import {
	registerUser,
	loginUser,
	getUsers,
	verifyOtp,
	resendOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
