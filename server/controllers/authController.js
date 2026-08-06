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
				otp: otp, // only for testing purpose
				otpExpiry: otpExpiry, // only for testing purpose
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
			return res.status(400).json({ message: "email and password are required" });
		}
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		if(!user.isVerified){
			return res.status(401).json({ message: "user not verified , please verify your email" });
		}
		res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				token: generateToken(user._id),
			});
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

// get users
export const getUsers = async (req, res) => {
	try {
		const users = await User.find({}).select("-password -otp -otpExpiry");
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
			res.status(200).json({ message: "otp verified successfully", token });
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
		const user = await User.findOne({email});
		if (!user){
			return res.status(404).json({ message: "user not found" });
		}
		if (user.isVerified){
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
		res.status(500).json({ message: "server error" });
	}
};
