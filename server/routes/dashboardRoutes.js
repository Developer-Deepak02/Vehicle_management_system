import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin, manager } from "../middleware/adminMiddleware.js";
import { getAdminDashboard, getManagerDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/manager-dashboard", protect, manager, getManagerDashboard);
router.get("/admin-dashboard", protect, admin, getAdminDashboard);

export default router;
