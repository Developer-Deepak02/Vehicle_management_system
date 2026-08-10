import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
	admin,
	manager,
	adminAndManager,
} from "../middleware/adminMiddleware.js";

const router = express.Router();

import {
	createVehicle,
	getAllVehicles,
} from "../controllers/vehicleController.js";

router.post("/create-vehicle", protect, admin, createVehicle);
router.get("/all-vehicles", protect, adminAndManager, getAllVehicles);

export default router;
