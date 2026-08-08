import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
	// =========================
	// Vehicle Information
	// =========================

	vehicleName: {
		type: String,
		required: true,
		trim: true,
	},

	vehicleModel: {
		type: String,
		required: true,
		trim: true,
	},

	vehicleYear: {
		type: Number,
		required: true,
	},

	vehicleType: {
		type: String,
		enum: ["LTV", "HTV"],
		required: true,
	},

	vehiclePhoto: {
		type: String,
	},

	chassisNumber: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},

	registrationNumber: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},

	vehicleDescription: {
		type: String,
		trim: true,
	},

	// =========================
	// Vehicle Status
	// =========================

	status: {
		type: String,
		enum: ["active", "inactive"],
		default: "active",
	},

	// =========================
	// Driver Assignment
	// =========================

	driverAssigned: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},

	driverAssignedOn: {
		type: Date,
		default: null,
	},

	// =========================
	// Audit Information
	// =========================

	createdOn: {
		type: Date,
		default: Date.now,
	},

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},

	updatedOn: {
		type: Date,
		default: null,
	},

	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
