import User from "../model/User.js";

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
