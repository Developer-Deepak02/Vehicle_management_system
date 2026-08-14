import User from "../model/User.js";
import Vehicle from "../model/Vehicle.js";

// create a new vehicle
export const createVehicle = async (req, res) => {
	try {
		const {
			vehicleName,
			vehicleModel,
			vehicleYear,
			vehicleType,
			vehiclePhoto,
			vehicleDescription,
			registrationNumber,
			chassisNumber,
		} = req.body;
		if (
			!registrationNumber ||
			!vehicleType ||
			!vehicleModel ||
			!vehicleName ||
			!vehicleYear ||
			!chassisNumber
		) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields" });
		}
		const existingVehicle = await Vehicle.findOne({
			$or: [{ registrationNumber }, { chassisNumber }],
		});
		if (existingVehicle) {
			return res.status(400).json({
				message: "registration number or chassis number already exists",
			});
		}
		const vehicle = new Vehicle({
			vehicleName,
			vehicleModel,
			vehicleType,
			vehicleYear,
			registrationNumber,
			chassisNumber,
			vehiclePhoto,
			vehicleDescription,
			createdBy: req.user._id,
		});
		await vehicle.save();

		res.status(201).json(vehicle);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// get all vehicles
export const getAllVehicles = async (req, res) => {
	try {
		const {
			search,
			status,
			vehicleType,
			page = 1,
			limit = 10,
		} = req.query;
		const filter = {};
		// Search by vehicle name, model, registration number or chassis number
		if (search) {
			filter.$or = [
				{ vehicleName: { $regex: search, $options: "i" } },
				{ vehicleModel: { $regex: search, $options: "i" } },
				{ registrationNumber: { $regex: search, $options: "i" } },
				{ chassisNumber: { $regex: search, $options: "i" } },
			];
		}
		if (status) {
			filter.status = status;
		}
		if (vehicleType) {
			filter.vehicleType = vehicleType;
		}
		const pageNumber = Number(page);
		const limitNumber = Number(limit);
		const skip = (pageNumber - 1) * limitNumber;
		const totalVehicles = await Vehicle.countDocuments(filter);
		// Get vehicles
		const vehicles = await Vehicle.find(filter)
			.populate("driverAssigned", "name email")
			.sort({ updatedOn: -1 })
			.skip(skip)
			.limit(limitNumber);
		const totalPages = Math.ceil(totalVehicles / limitNumber);
		return res.status(200).json({
			vehicles,
			pagination: {
				currentPage: pageNumber,
				limit: limitNumber,
				totalVehicles,
				totalPages,
			},
		});
	} catch (error) {
		console.error("getAllVehicles error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};

// get vehicle

export const getVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findById(req.params.id);
		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found" });
		}
		res.status(200).json(vehicle);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// update vehicle
export const updateVehicle = async (req, res) => {
	const vehicleId = req.params.id;
	const {
		vehicleName,
		vehicleModel,
		vehicleYear,
		vehicleType,
		vehicleDescription,
		vehiclePhoto,
	} = req.body;

	try {
		const vehicle = await Vehicle.findById(vehicleId);
		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found" });
		}
		if (vehicleName !== undefined) {
			vehicle.vehicleName = vehicleName;
		}

		if (vehicleModel !== undefined) {
			vehicle.vehicleModel = vehicleModel;
		}
		if (vehicleYear !== undefined) {
			vehicle.vehicleYear = vehicleYear;
		}
		if (vehicleType !== undefined) {
			vehicle.vehicleType = vehicleType;
		}
		if (vehicleDescription !== undefined) {
			vehicle.vehicleDescription = vehicleDescription;
		}
		if (vehiclePhoto !== undefined) {
			vehicle.vehiclePhoto = vehiclePhoto;
		}
		vehicle.updatedBy = req.user._id;
		vehicle.updatedOn = Date.now();
		await vehicle.save();
		res.status(200).json(vehicle);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// delete vehicle

export const deleteVehicle = async (req, res) => {
	try {
		const vehicle = await Vehicle.findById(req.params.id);
		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found" });
		}
		if (vehicle.status === "assigned") {
			return res
				.status(400)
				.json({ message: "Vehicle is already assigned try again later" });
		}
		await vehicle.deleteOne();
		res.status(200).json({ message: "Vehicle deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// get available vehicles
export const getAvailableVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find({
			status: "available",
		});
		res.status(200).json(vehicles);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// assign vehicle

export const assignVehicle = async (req, res) => {
	try {
		const vehicleId = req.params.id;
		const { driverId } = req.body;
		const vehicle = await Vehicle.findById(vehicleId);
		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found" });
		}
		const driver = await User.findById(driverId);
		if (!driver) {
			return res.status(404).json({ message: "Driver not found" });
		}
		if (driver.role !== "driver") {
			return res
				.status(400)
				.json({ message: "Vehicle must be assigned to a driver" });
		}
		if (driver.vehicleAssigned) {
			return res
				.status(400)
				.json({ message: "Driver already has a vehicle assigned" });
		}
		if (!driver.active) {
			return res.status(400).json({ message: "Driver is inactive" });
		}
		if (!driver.isVerified) {
			return res.status(400).json({ message: "Driver is not verified" });
		}
		if (vehicle.status === "assigned") {
			return res.status(400).json({ message: "Vehicle is already assigned" });
		}
		vehicle.driverAssigned = driver._id;
		vehicle.driverAssignedOn = Date.now();
		vehicle.status = "assigned";
		driver.vehicleAssigned = vehicle._id;
		driver.vehicleAssignedOn = Date.now();
		await vehicle.save();
		await driver.save();
		return res.status(200).json({
			message: "Vehicle assigned successfully",
			vehicle,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// get my vehicle
export const getMyVehicle = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("vehicleAssigned");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!user.vehicleAssigned) {
			return res
				.status(404)
				.json({ message: "No vehicle assigned to this driver" });
		}
		res.status(200).json(user.vehicleAssigned);
	} catch (error) {
		console.error("getMyVehicle error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// unassign vehicle
export const unassignVehicle = async (req, res) => {
	try {
		const vehicleId = req.params.id;
		const vehicle = await Vehicle.findById(vehicleId);
		if (!vehicle) {
			return res.status(404).json({ message: "Vehicle not found" });
		}
    if(!vehicle.driverAssigned){
      return res.status(400).json({ message: "Vehicle is not assigned" });
    }
    const driver = await User.findById(vehicle.driverAssigned);
		if(!driver){
      return res.status(404).json({ message: "Driver not found" });
    }
    vehicle.driverAssigned = null;
		vehicle.driverAssignedOn = null;
		vehicle.status = "available";

    driver.vehicleAssigned = null;
		driver.vehicleAssignedOn = null;
		await vehicle.save();
    await driver.save();
    return res.status(200).json({
			message: "Vehicle unassigned successfully",
			vehicle,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
