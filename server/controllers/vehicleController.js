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
