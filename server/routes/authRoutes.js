import express from "express";
import {
	registerUser,
	loginUser,
	getUsers,
	verifyOtp,
	resendOtp,
	forgotPassword,
	verifyResetOtp,
	resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();
// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
// verify otp and resend otp routes
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
// forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

export default router;
