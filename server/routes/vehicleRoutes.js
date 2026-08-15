import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
	admin,
	manager,
	adminAndManager,
	driver,
} from "../middleware/adminMiddleware.js";

const router = express.Router();

import {
	createVehicle,
	getAllVehicles,
	getVehicle,
	updateVehicle,
	deleteVehicle,
	getAvailableVehicles,
	assignVehicle,
	getMyVehicle,
	unassignVehicle,
	activateDeactivateVehicle,
} from "../controllers/vehicleController.js";

router.post("/create-vehicle", protect, adminAndManager, createVehicle);
router.get("/my-vehicle", protect, driver, getMyVehicle);
router.get("/all-vehicles", protect, adminAndManager, getAllVehicles);
router.get(
	"/available-vehicle",
	protect,
	adminAndManager,
	getAvailableVehicles,
);
router.get("/:id", protect, adminAndManager, getVehicle);
router.put("/update-vehicle/:id", protect, admin, updateVehicle);
router.delete("/delete-vehicle/:id", protect, admin, deleteVehicle);
router.put("/:id/assign", protect, adminAndManager, assignVehicle);
router.put("/:id/unassign", protect, adminAndManager, unassignVehicle);
router.patch(
	"/:id/status",
	protect,
	adminAndManager,
	activateDeactivateVehicle,
);
export default router;
