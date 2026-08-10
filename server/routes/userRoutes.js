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
	createManager,
  createDriver,
  activateDeactivate,
  updateUser,
  deleteUser,
  getAvailableDrivers
} from "../controllers/userController.js";

const router = express.Router();

router.get("/all-users", protect, adminAndManager, getUsers);
router.get("/me", protect, getCurrentUser);
router.put("/update-me", protect, updateCurrentUser);
router.post("/create-manager", protect, admin, createManager);
router.post("/create-driver", protect, adminAndManager, createDriver);
router.get("/available-drivers", protect, adminAndManager, getAvailableDrivers);
router.patch("/status/:id", protect, adminAndManager, activateDeactivate);
router.put("/update-user/:id" , protect, adminAndManager, updateUser);
router.delete("/delete-user/:id", protect, admin, deleteUser);

export default router;
