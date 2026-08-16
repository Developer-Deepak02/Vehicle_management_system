import User from "../model/User.js";
import Vehicle from "../model/Vehicle.js";

// manager dashboard
export const getManagerDashboard = async (req, res) => {
	try {
		// vehicle
		const totalVehicles = await Vehicle.countDocuments();
		const activeVehicles = await Vehicle.countDocuments({
			active: true,
		});
		const inactiveVehicle = await Vehicle.countDocuments({
			active: false,
		});
		const availableVehicles = await Vehicle.countDocuments({
			status: "available",
			active: true,
		});
		const assignedVehicles = await Vehicle.countDocuments({
			status: "assigned",
			active: true,
		});
		// driver
		const totalDrivers = await User.countDocuments({ role: "driver" });
		const activeDrivers = await User.countDocuments({
			active: true,
			role: "driver",
		});
		const inactiveDrivers = await User.countDocuments({
			active: false,
			role: "driver",
		});
		const assignedDrivers = await User.countDocuments({
			vehicleAssigned: { $ne: null },
			role: "driver",
		});
		const unAssignedDrivers = await User.countDocuments({
			vehicleAssigned: null,
			role: "driver",
		});
		const vehiclesAddedByManager = await Vehicle.countDocuments({
			createdBy: req.user._id,
		});
		const driversAddedByManager = await User.countDocuments({
			role: "driver",
			createdBy: req.user._id,
		});
				return res.status(200).json({
					vehicles: {
						total: totalVehicles,
						active: activeVehicles,
						inactive: inactiveVehicle,
						available: availableVehicles,
						assigned: assignedVehicles,
						addedByManager: vehiclesAddedByManager,
					},
					drivers: {
						total: totalDrivers,
						active: activeDrivers,
						inactive: inactiveDrivers,
						assigned: assignedDrivers,
						unassigned: unAssignedDrivers,
						addedByManager: driversAddedByManager,
					},
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
		const activeVehicles = await Vehicle.countDocuments({
			active: true,
		});
		const inactiveVehicles = await Vehicle.countDocuments({
			active: false,
		});
		const availableVehicles = await Vehicle.countDocuments({
			status: "available",
			active: true,
		});
		const assignedVehicles = await Vehicle.countDocuments({
			status: "assigned",
			active: true,
		});
		const totalDrivers = await User.countDocuments({
			role: "driver",
		});
		const activeDrivers = await User.countDocuments({
			role: "driver",
			active: true,
			isVerified: true,
		});
		const inactiveDrivers = await User.countDocuments({
			role: "driver",
			active: false,
		});
		const assignedDrivers = await User.countDocuments({
			role: "driver",
			vehicleAssigned: { $ne: null },
		});
		const unassignedDrivers = await User.countDocuments({
			role: "driver",
			vehicleAssigned: null,
		});
		const totalManagers = await User.countDocuments({
			role: "manager",
		});
		const activeManagers = await User.countDocuments({
			role: "manager",
			active: true,
			isVerified: true,
		});
		const inactiveManagers = await User.countDocuments({
			role: "manager",
			active: false,
		});
		const managersInvitedNotJoined = await User.countDocuments({
			role: "manager",
			isVerified: false,
			invitationToken: { $ne: null },
		});
		const vehiclesAddedByManagers = await Vehicle.countDocuments({
			createdBy: {
				$in: await User.find({
					role: "manager",
				}).distinct("_id"),
			},
		});
		const driversAddedByManagers = await User.countDocuments({
			role: "driver",
			createdBy: {
				$in: await User.find({
					role: "manager",
				}).distinct("_id"),
			},
		});
		return res.status(200).json({
			vehicles: {
				total: totalVehicles,
				active: activeVehicles,
				inactive: inactiveVehicles,
				available: availableVehicles,
				assigned: assignedVehicles,
				addedByManagers: vehiclesAddedByManagers,
			},
			drivers: {
				total: totalDrivers,
				active: activeDrivers,
				inactive: inactiveDrivers,
				assigned: assignedDrivers,
				unassigned: unassignedDrivers,
				addedByManagers: driversAddedByManagers,
			},
			managers: {
				total: totalManagers,
				active: activeManagers,
				inactive: inactiveManagers,
				invitedNotJoined: managersInvitedNotJoined,
			},
		});
	} catch (error) {
		console.error("getAdminDashboard error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};