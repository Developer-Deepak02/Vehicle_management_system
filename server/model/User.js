import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
	},
	role: {
		type: String,
		enum: ["user", "admin", "manager"],
		default: "user",
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	otp: {
		type: String,
		default: null,
		require: true,
	},
	otpExpiry: {
		type: Date,
		default: null,
		require: true,
	},
	passwordResetVerified: {
		type: Boolean,
		default: false,
	},
	passwordResetExpires: {
		type: Date,
		default: null,
		require: true,
	}
});

export default mongoose.model("User", userSchema);
