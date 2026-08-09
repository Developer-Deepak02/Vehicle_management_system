import User from "../model/User.js";
import bcrypt from "bcrypt";

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
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "Name, email, and password are required" });
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "password must be at least 6 characters" });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}
		// hash the password before saving
		const hashPassword = await bcrypt.hash(
			password,
			Number(process.env.BCRYPT_SALT_ROUNDS),
		);
		const user = new User({
			name,
			email,
			password: hashPassword,
			isVerified: true,
			active: true,
			role: "manager",
			createdBy: req.user._id,
			joinedOn: Date.now(),
		});
		await user.save();
		res.status(201).json({ message: "Manager created successfully" });
	} catch (error) {
		console.error("createManager error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const createDriver = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "Name, email, and password are required" });
		}
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "password must be at least 6 characters" });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}
		// hash password
		const hashPassword = await bcrypt.hash(
			password,
			Number(process.env.BCRYPT_SALT_ROUNDS),
		);
		const user = new User({
			name,
			email,
			password: hashPassword,
			isVerified: true,
			active: true,
			role: "driver",
			createdBy: req.user._id,
			joinedOn: Date.now(),
		});
		await user.save();
		res.status(201).json({ message: "driver created successfully" });
	} catch (error) {
		console.error("createDriver error:", error);
		res.status(500).json({ message: "Server error" });
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
