import user from "../model/User.js";
export const generateOtp = () => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
	user.otp = otp;
	user.otpExpiry = otpExpiry;
	// console.log("generated otp:", otp);
	return [otp, otpExpiry];
};
