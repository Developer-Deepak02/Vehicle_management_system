import User from "../model/User.js";
import Vehicle from "../model/Vehicle.js";

// manager dashboard
export const getManagerDashboard = async (req, res) => {
	try {
		const totalVehicles = await Vehicle.countDocuments();
		const totalDrivers = await User.countDocuments({ role: "driver" });
		const unassignedVehicles = await Vehicle.countDocuments({
			status: "available",
		});
		const vehiclesAddedByManager = await Vehicle.countDocuments({
			createdBy: req.user._id,
		});
		const driverAddedByManager = await User.countDocuments({
			createdBy: req.user._id,
		});
		const unassignedDrivers = await User.countDocuments({
			role: "driver",
			vehicleAssigned: null,
		});
		return res.status(200).json({
			totalVehicles,
			totalDrivers,
			unassignedVehicles,
			vehiclesAddedByManager,
			driverAddedByManager,
			unassignedDrivers,
		});
	} catch (error) {
		console.error("getManagerDashboard error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};

// admin dashboard
export const getAdminDashboard = async (req, res) => {
	try {
		const totalVehicles = await Vehicle.countDocuments();
		const totalDrivers = await User.countDocuments({ role: "driver" });
		const unassignedVehicles = await Vehicle.countDocuments({
			status: "available",
		});
		const vehiclesAddedByManager = await Vehicle.countDocuments({
			createdBy: req.user._id,
		});
		const driverAddedByManager = await User.countDocuments({
			createdBy: req.user._id,
		});
		const unassignedDrivers = await User.countDocuments({
			role: "driver",
			vehicleAssigned: null,
		});
		const totalManagers = await User.countDocuments({
			role: "manager",
		});
    const managersInvitedNotJoined = await User.countDocuments({
			role: "manager",
			isVerified: false,
			invitationToken: { $ne: null },
		});
		return res.status(200).json({
			totalVehicles,
			totalDrivers,
			unassignedVehicles,
			vehiclesAddedByManager,
			driverAddedByManager,
			unassignedDrivers,
			totalManagers,
      managersInvitedNotJoined
		});
	} catch (error) {
		console.error("getAdminDashboard error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};