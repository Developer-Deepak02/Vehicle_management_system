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
		const {
			search,
			role,
			active,
			page = 1,
			limit = 10,
			sort = "newest",
		} = req.query;
		const filter = {};
		// Search by name or email
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}
		if (role) {
			filter.role = role;
		}
		if (active !== undefined) {
			filter.active = active === "true";
		}
		const pageNumber = Number(page);
		const limitNumber = Number(limit);
		const skip = (pageNumber - 1) * limitNumber;
		const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
		const totalUsers = await User.countDocuments(filter);
		const users = await User.find(filter)
			.select(
				"-password -otp -otpExpiry -passwordResetVerified -passwordResetExpires",
			)
			.sort(sortOption)
			.skip(skip)
			.limit(limitNumber);
		const totalPages = Math.ceil(totalUsers / limitNumber);
		return res.status(200).json({
			users,
			pagination: {
				currentPage: pageNumber,
				limit: limitNumber,
				totalUsers,
				totalPages,
			},
		});
	} catch (error) {
		console.error("getUsers error:", error);
		return res.status(500).json({
			message: "Server error",
		});
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
			// driver info
			...(user.role === "driver" && {
				drivingLicense: user.drivingLicense,
				licenseExpiry: user.licenseExpiry,
				driverAddress: user.driverAddress,
				experience: user.experience,
				vehicleAssigned: user.vehicleAssigned,
				vehicleAssignedOn: user.vehicleAssignedOn,
			}),
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
			return res.status(404).json({
				message: "User not found",
			});
		}
		// Common user fields
		if (req.body.name !== undefined) {
			user.name = req.body.name;
		}
		if (req.body.dateOfBirth !== undefined) {
			user.dateOfBirth = req.body.dateOfBirth;
		}
		if (req.body.profilePicture !== undefined) {
			user.profilePicture = req.body.profilePicture;
		}
		// Driver-specific fields
		if (user.role === "driver") {
			if (req.body.drivingLicense !== undefined) {
				user.drivingLicense = req.body.drivingLicense;
			}
			if (req.body.licenseExpiry !== undefined) {
				user.licenseExpiry = req.body.licenseExpiry;
			}
			if (req.body.driverAddress !== undefined) {
				user.driverAddress = req.body.driverAddress;
			}
			if (req.body.experience !== undefined) {
				if (Number(req.body.experience) < 0) {
					return res.status(400).json({
						message: "Experience cannot be negative",
					});
				}
				user.experience = Number(req.body.experience);
			}
		}
		user.updatedOn = Date.now();
		user.updatedBy = req.user._id;
		await user.save();
		return res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			dateOfBirth: user.dateOfBirth,
			profilePicture: user.profilePicture,
			// Driver information
			...(user.role === "driver" && {
				drivingLicense: user.drivingLicense,
				licenseExpiry: user.licenseExpiry,
				driverAddress: user.driverAddress,
				experience: user.experience,
			}),
			message: "Profile updated",
		});
	} catch (error) {
		console.error("updateCurrentUser error:", error);
		return res.status(500).json({
			message: "Server error",
		});
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
		const invitationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
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
		const emailContent = driverInvitationEmail(name, invitationLink);
		await sendEmail(email, emailContent.subject, emailContent.text);
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
			return res.status(404).json({
				message: "User not found",
			});
		}
		if (req.user.role === "manager" && user.role !== "driver") {
			return res.status(403).json({
				message: "Managers can only update drivers",
			});
		}
		const { name, dateOfBirth, driverAddress } = req.body;
		if (
			name === undefined &&
			dateOfBirth === undefined &&
			driverAddress === undefined
		) {
			return res.status(400).json({
				message: "Please provide a field to update",
			});
		}
		if (name !== undefined) {
			user.name = name;
		}
		if (dateOfBirth !== undefined) {
			user.dateOfBirth = dateOfBirth;
		}
		if (driverAddress !== undefined) {
			if (user.role !== "driver") {
				return res.status(400).json({
					message: "Driver address can only be updated for drivers",
				});
			}
			user.driverAddress = driverAddress;
		}
		user.updatedOn = Date.now();
		user.updatedBy = req.user._id;
		await user.save();
		return res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			dateOfBirth: user.dateOfBirth,
			driverAddress: user.driverAddress,
			message: "Profile updated",
		});
	} catch (error) {
		console.error("updateUser error:", error);
		return res.status(500).json({
			message: "Server error",
		});
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

// get drivers
export const getDrivers = async (req, res) => {
	try {
		const {
			search,
			active,
			createdBy,
			available,
			page = 1,
			limit = 10,
		} = req.query;
		const filter = {
			role: "driver",
		};
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}
		if (active !== undefined) {
			filter.active = active === "true";
		}
		if (createdBy) {
			filter.createdBy = createdBy;
		}
		if (available === "true") {
			filter.vehicleAssigned = null;
			filter.isVerified = true;
			filter.active = true;
		}
		const pageNumber = Number(page);
		const limitNumber = Number(limit);
		const skip = (pageNumber - 1) * limitNumber;
		const totalDrivers = await User.countDocuments(filter);
		const drivers = await User.find(filter)
			.select(
				"-password -otp -otpExpiry -passwordResetVerified -passwordResetExpires",
			)
			.sort({ updatedOn: -1 })
			.skip(skip)
			.limit(limitNumber);
		const totalPages = Math.ceil(totalDrivers / limitNumber);
		return res.status(200).json({
			drivers,
			pagination: {
				currentPage: pageNumber,
				limit: limitNumber,
				totalDrivers,
				totalPages,
			},
		});
	} catch (error) {
		console.error("getDrivers error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};

// get one driver
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

// change password
export const changePassword = async (req, res) => {
	try {
		const { oldPassword, newPassword, confirmPassword } = req.body;
		if (!oldPassword || !newPassword || !confirmPassword) {
			return res.status(400).json({
				message: "All password fields are required",
			});
		}
		if (newPassword.length < 6) {
			return res.status(400).json({
				message: "New password must be at least 6 characters",
			});
		}
		if (newPassword !== confirmPassword) {
			return res.status(400).json({
				message: "New password and confirm password do not match",
			});
		}
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({
				message: "Old password is incorrect",
			});
		}
		const isSamePassword = await bcrypt.compare(newPassword, user.password);
		if (isSamePassword) {
			return res.status(400).json({
				message: "New password cannot be the same as old password",
			});
		}
		const hashPassword = await bcrypt.hash(
			newPassword,
			Number(process.env.BCRYPT_SALT_ROUNDS),
		);
		user.password = hashPassword;
		user.updatedOn = Date.now();
		user.updatedBy = req.user._id;
		await user.save();
		return res.status(200).json({
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("changePassword error:", error);
		return res.status(500).json({
			message: "Server error",
		});
	}
};
