import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	// =========================
	// Common User Information
	// =========================

	name: {
		type: String,
		required: true,
		trim: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},

	password: {
		type: String,
		required: true,
	},

	dateOfBirth: {
		type: Date,
	},

	profilePicture: {
		type: String,
	},

	// =========================
	// Role
	// =========================

	role: {
		type: String,
		enum: ["driver", "manager", "admin"],
		default: "driver",
	},

	// =========================
	// Account Status
	// =========================

	isVerified: {
		type: Boolean,
		default: false,
	},

	active: {
		type: Boolean,
		default: false,
	},

	joinedOn: {
		type: Date,
		default: null,
	},

	// =========================
	// Driver Specific Information
	// =========================

	drivingLicense: {
		type: String,
	},

	licenseExpiry: {
		type: Date,
	},

	driverAddress: {
		type: String,
	},

	experience: {
		type: Number,
	},

	vehicleAssigned: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vehicle",
		default: null,
	},

	vehicleAssignedOn: {
		type: Date,
		default: null,
	},

	// =========================
	// OTP / Email Verification
	// =========================

	otp: {
		type: String,
		default: null,
	},

	otpExpiry: {
		type: Date,
		default: null,
	},

	// =========================
	// Password Reset
	// =========================

	passwordResetVerified: {
		type: Boolean,
		default: false,
	},

	passwordResetExpires: {
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

const User = mongoose.model("User", userSchema);

export default User;
