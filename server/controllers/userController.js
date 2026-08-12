import User from "../model/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
	managerInvitationEmail,
	driverInvitationEmail,
} from "../templates/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

// get users
export const getUsers = async (req, res) => {
	try {
		const { role } = req.query;
		let filter = {};
		if (role) {
			filter.role = role;
		}
		const users = await User.find(filter).select(
			"-password -otp -otpExpiry -passwordResetVerified -passwordResetExpires",
		);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// get current user
export const getCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			dateOfBirth: user.dateOfBirth,
			profilePicture: user.profilePicture,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// update current user
export const updateCurrentUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (req.body.name) {
			user.name = req.body.name;
		}
		if (req.body.dateOfBirth) {
			user.dateOfBirth = req.body.dateOfBirth;
		}
		if (req.body.profilePicture) {
			user.profilePicture = req.body.profilePicture;
		}
		user.updatedOn = Date.now();
		user.updatedBy = req.user._id;
		await user.save();
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			dateOfBirth: user.dateOfBirth,
			profilePicture: user.profilePicture,
			message: "Profile updated",
		});
	} catch (error) {
		console.error("updateCurrentUser error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// create Manager
export const createManager = async (req, res) => {
	try {
		const { name, email } = req.body;
		if (!name || !email) {
			return res.status(400).json({ message: "Name and email are required" });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}
		const invitationToken = crypto.randomBytes(32).toString("hex");
		const invitationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const user = new User({
			name,
			email,
			isVerified: false,
			active: false,
			role: "manager",
			invitationToken,
			invitationTokenExpires,
			createdBy: req.user._id,
			joinedOn: null,
		});
		await user.save();
		const invitationLink = `http://localhost:3000/set-password?token=${invitationToken}`;
		const emailContent = managerInvitationEmail(name, invitationLink);
		await sendEmail(email, emailContent.subject, emailContent.text);
		res.status(201).json({ message: "Manager invitation sent successfully" });
	} catch (error) {
		console.error("createManager error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

//create driver
export const createDriver = async (req, res) => {
	try {
		const { name, email } = req.body;
		if (!name || !email) {
			return res.status(400).json({
				message: "Name and email are required",
			});
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				message: "User with this email already exists",
			});
		}
		const invitationToken = crypto.randomBytes(32).toString("hex");
		const invitationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000,);
		const user = new User({
			name,
			email,
			role: "driver",
			isVerified: false,
			active: false,
			invitationToken,
			invitationTokenExpires,
			createdBy: req.user._id,
			joinedOn: null,
		});
		await user.save();
		const invitationLink = `http://localhost:3000/set-password?token=${invitationToken}`;
		const emailContent = driverInvitationEmail(
			name,
			invitationLink,
		);
		await sendEmail(
			email,
			emailContent.subject,
			emailContent.text,
		);
		return res.status(201).json({
			message: "Driver invitation sent successfully",
		});
	} catch (error) {
		console.error("createDriver error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};

// active / deactive account

export const activateDeactivate = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (req.user._id.toString() === user._id.toString()) {
			return res
				.status(400)
				.json({ message: "You cannot change your own status" });
		}
		if (req.user.role === "manager" && user.role !== "driver") {
			return res
				.status(403)
				.json({ message: "Managers can only activate/deactivate drivers" });
		}
		if (user.active === true) {
			user.active = false;
		} else {
			user.active = true;
		}
		await user.save();
		res.status(200).json({ message: "User status updated" });
	} catch (error) {
		console.error("activateDeactivate error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// update another user

export const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (req.user.role === "manager" && user.role !== "driver") {
			return res.status(403).json({
				message: "Managers can only update drivers",
			});
		}
		if (!req.body.name && !req.body.dateOfBirth) {
			return res
				.status(400)
				.json({ message: "name and dateOfBirth are required" });
		}
		if (req.body.name) {
			user.name = req.body.name;
		}
		if (req.body.dateOfBirth) {
			user.dateOfBirth = req.body.dateOfBirth;
		}
		user.updatedOn = Date.now();
		user.updatedBy = req.user._id;
		await user.save();
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			dateOfBirth: user.dateOfBirth,
			message: "Profile updated",
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// delete user

export const deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (req.user._id.toString() === user._id.toString()) {
			return res
				.status(400)
				.json({ message: "You cannot delete your own account" });
		}
		await user.deleteOne();
		res.status(200).json({
			message: "User deleted successfully",
		});
	} catch (error) {
		return res.status(500).json({ message: "server error" });
	}
};

// get available drivers
export const getAvailableDrivers = async (req, res) => {
	try {
		const user = await User.find({
			role: "driver",
			active: true,
			isVerified: true,
			vehicleAssigned: null,
		}).select(
			"-password -otp -otpExpiry -passwordResetVerified -passwordResetExpires",
		);
		res.status(200).json(user);
	} catch (error) {
		console.log("getAvailableDrivers error:", error);
		return res.status(500).json({ message: "server error" });
	}
};

// get driver
export const getDriver = async (req, res) => {
	try {
		const driver = await User.findById(req.params.id)
			.select(
				"-password -otp -otpExpiry -passwordResetVerified -passwordResetExpires",
			)
			.populate("vehicleAssigned");
		if (!driver) {
			return res.status(404).json({ message: "Driver not found" });
		}
		if (driver.role !== "driver") {
			return res.status(403).json({ message: "User is not a driver" });
		}
		res.status(200).json(driver);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// accept manager/driver invitation
export const acceptInvitation = async (req, res) => {
	try {
		const { token, password } = req.body;
		if (!token || !password) {
			return res.status(400).json({
				message: "Token and password are required",
			});
		}
		if (password.length < 6) {
			return res.status(400).json({
				message: "Password must be at least 6 characters",
			});
		}
		const user = await User.findOne({
			invitationToken: token,
		});
		if (!user) {
			return res.status(404).json({
				message: "Invalid invitation token",
			});
		}
		if (
			!user.invitationTokenExpires ||
			user.invitationTokenExpires < Date.now()
		) {
			return res.status(400).json({
				message: "Invitation link has expired",
			});
		}
		if (user.isVerified || user.active) {
			return res.status(400).json({
				message: "Account has already been activated",
			});
		}
		const hashPassword = await bcrypt.hash(
			password,
			Number(process.env.BCRYPT_SALT_ROUNDS),
		);
		user.password = hashPassword;
		user.isVerified = true;
		user.active = true;
		user.joinedOn = Date.now();
		// Invitation can only be used once
		user.invitationToken = null;
		user.invitationTokenExpires = null;

		await user.save();
		return res.status(200).json({
			message: "Account activated successfully. You can now login.",
		});
	} catch (error) {
		console.error("acceptInvitation error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};
