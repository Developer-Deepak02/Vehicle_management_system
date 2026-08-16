import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
	admin,
	manager,
	adminAndManager,
} from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
	getUsers,
	getCurrentUser,
	updateCurrentUser,
	createManager,
	createDriver,
	activateDeactivate,
	updateUser,
	deleteUser,
	getDrivers,
	getDriver,
	acceptInvitation,
	changePassword,
	updateProfilePicture,
	submitDriverLicense,
	verifyDriverLicense,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/all-users", protect, adminAndManager, getUsers);
router.get("/me", protect, getCurrentUser);
router.put("/update-me", protect, updateCurrentUser);
router.post("/create-manager", protect, admin, createManager);
router.post("/create-driver", protect, adminAndManager, createDriver);
router.get("/drivers", protect, adminAndManager, getDrivers);
router.get("/drivers/:id", protect, adminAndManager, getDriver);
router.patch("/status/:id", protect, adminAndManager, activateDeactivate);
router.put("/update-user/:id", protect, adminAndManager, updateUser);
router.delete("/delete-user/:id", protect, admin, deleteUser);
router.post("/accept-invitation", acceptInvitation);
router.put("/change-password", protect, changePassword);
router.put(
	"/profile-picture",
	protect,
	upload.single("profilePicture"),
	updateProfilePicture,
);
router.put(
	"/driver-license",
	protect,
	upload.single("drivingLicensePicture"),
	submitDriverLicense,
);
router.patch(
	"/driver-license/:id/verify",
	protect,
	adminAndManager,
	verifyDriverLicense,
);

export default router;
