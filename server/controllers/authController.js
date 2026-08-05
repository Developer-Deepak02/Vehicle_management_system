import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";

const genrateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		// hash password
		const hashPassword = await bcrypt.hash(password, 10);
		// saving user
		const user = User.create({ name, email, password: hashPassword });
		if (user) {
			const otp = Math.floor(100000 + Math.random() * 900000).toString();
			const message = `welcome to VMS ,${name} . thank you for choosing us . ${otp} is your otp to compleate the registration`;

			await sendEmail(
				email,
				"welcome to VMS - your OTP for registration ",
				message,
			);
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				token: genrateToken(user._id),
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error.message });
	}
};
