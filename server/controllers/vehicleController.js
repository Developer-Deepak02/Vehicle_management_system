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

// get all vehicle
export const getAllVehicles = async (req, res) => {
	try {
		const vehicles = await Vehicle.find();
		res.status(200).json(vehicles);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
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
