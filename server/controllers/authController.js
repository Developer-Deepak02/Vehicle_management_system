import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOtp } from "../utils/generateOtp.js";

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register
export const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ message: "please fill all the fields" });
	}
	if (password.length < 6) {
		return res
			.status(400)
			.json({ message: "password must be at least 6 characters long" });
	}
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		// hash password
		const hashPassword = await bcrypt.hash(
			password,
			Number(process.env.BCRYPT_SALT_ROUNDS),
		);
		const [otp, otpExpiry] = generateOtp();
		// saving user
		const user = await User.create({
			name,
			email,
			password: hashPassword,
			otp: otp,
			otpExpiry: otpExpiry,
		});
		if (user) {
			const message = `welcome to VMS ,${name} . thank you for choosing us . ${otp} is your otp to compleate the registration process , please use this to verify your email. your otp will expire in 5 minutes`;
			// console.log(`sending email to ${email} with message: ${message}`);
			await sendEmail(
				email,
				"welcome to VMS - your OTP for registration ",
				message,
			);
			// console.log("email sent successfully");
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				token: generateToken(user._id),
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error.message });
	}
};

//login
export const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "email and password are required" });
		}
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		if (!user.isVerified) {
			return res
				.status(401)
				.json({ message: "user not verified , please verify your email" });
		}
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// get users
export const getUsers = async (req, res) => {
	try {
		const users = await User.find({}).select(
			"-password -otp -otpExpiry -passwordResetVerified -passwordResetExpires",
		);
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

//  verifyOtp
export const verifyOtp = async (req, res) => {
	const { email, otp } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user && user.otp === otp && user.otpExpiry > Date.now()) {
			user.isVerified = true;
			user.otp = null;
			user.otpExpiry = null;
			await user.save();
			const token = generateToken(user._id);
			res.status(200).json({ message: "otp verified successfully" });
		} else if (!user) {
			return res.status(404).json({ message: "user not found" });
		} else {
			return res.status(400).json({ message: "invalid otp" });
		}
	} catch (error) {
		res.status(500).json({ message: "server error" });
	}
};

// resendOtp
export const resendOtp = async (req, res) => {
	const email = req.body.email;
	try {
		if (!email) {
			return res.status(400).json({ message: "email is required" });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}
		if (user.isVerified) {
			return res.status(400).json({ message: "user already verified" });
		}
		const [otp, otpExpiry] = generateOtp();
		user.otp = otp;
		user.otpExpiry = otpExpiry;
		await user.save();
		const message = `your new otp is ${otp} , please use this to verify your email`;
		await sendEmail(email, "VMS - your new OTP for verification", message);
		res.status(200).json({ message: "otp resent successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "server error" });
	}
};

// forgot password
export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}
		// generate otp and save to user
		const [otp, otpExpiry] = generateOtp();
		user.otp = otp;
		user.otpExpiry = otpExpiry;
		user.passwordResetVerified = false;

		await user.save();
		// send email with otp
		const message = `your otp for password reset is ${otp} , please use this to reset your password. your otp will expire in 10 minutes`;
		await sendEmail(email, "VMS - your OTP for password reset", message);
		res.status(200).json({ message: "otp sent successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "server error" });
	}
};

// verify reset otp
export const verifyResetOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}
		if (user.otp !== otp || user.otpExpiry < Date.now()) {
			return res
				.status(400)
				.json({ message: "invalid or expired otp try again" });
		}
		const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
		user.passwordResetVerified = true;
		user.otp = null;
		user.otpExpiry = null;
		user.passwordResetExpires = passwordResetExpires;
		await user.save();
		res.status(200).json({ message: "otp verified successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "server error" });
	}
};

// reset password
export const resetPassword = async (req, res) => {
	try {
		const { email, newPassword } = req.body;
		const user = await User.findOne({ email });
		if (
			newPassword === undefined ||
			newPassword === null ||
			newPassword === ""
		) {
			return res.status(400).json({ message: "new password is required" });
		}
		if (newPassword.length < 6) {
			return res
				.status(400)
				.json({ message: "new password must be at least 6 characters long" });
		}
		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}
		if (!user.passwordResetVerified) {
			return res.status(400).json({ message: "otp not verified" });
		}
		if (user.passwordResetExpires < Date.now()) {
			return res.status(400).json({ message: "otp expired" });
		}
		// hash the new password before saving
		const hashPassword = await bcrypt.hash(
			newPassword,
			Number(process.env.BCRYPT_SALT_ROUNDS),
		);
		user.password = hashPassword;
		user.passwordResetVerified = false;
		user.passwordResetExpires = null;
		await user.save();
		res.status(200).json({ message: "password reset successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "server error" });
	}
};