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
	getVehicle,
	updateVehicle,
	deleteVehicle,
} from "../controllers/vehicleController.js";

router.post("/create-vehicle", protect, admin, createVehicle);
router.get("/all-vehicles", protect, adminAndManager, getAllVehicles);
router.get("/:id", protect, adminAndManager, getVehicle);
router.put("/update-vehicle/:id", protect, admin, updateVehicle);
router.delete("/delete-vehicle/:id", protect, admin, deleteVehicle);

export default router;
