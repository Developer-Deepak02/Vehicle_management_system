import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resendOtp, verifyOtp } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser } from "../../services/userService";
import { TruckElectric } from "lucide-react";

const VerifyEmail = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { login, setAuthToken } = useAuth();
	const email = location.state?.email;
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);

	const handleVerify = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Email not found. Please register again.");
			navigate("/register");
			return;
		}
		if (!otp) {
			toast.error("Please enter the OTP");
			return;
		}
		if (otp.length !== 6) {
			toast.error("OTP must be 6 digits");
			return;
		}
		try {
			setLoading(true);
			const data = await verifyOtp(email, otp);
			setAuthToken(data.token);
			const currentUser = await getCurrentUser();
			login({
				...currentUser,
				token: data.token,
			});
			toast.success("Email verified successfully");
			if (currentUser.role === "admin") {
				navigate("/admin/dashboard");
			} else if (currentUser.role === "manager") {
				navigate("/manager/dashboard");
			} else if (currentUser.role === "driver") {
				navigate("/driver/dashboard");
			}
		} catch (error) {
			console.error("OTP verification error:", error);
			const message = error.response?.data?.message || "Something went wrong";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	const handleResend = async () => {
		if (!email) {
			toast.error("Email not found. Please register again.");
			navigate("/register");
			return;
		}
		try {
			setResending(true);
			const data = await resendOtp(email);
			toast.success(data.message);
		} catch (error) {
			console.error("Resend OTP error:", error);
			const message = error.response?.data?.message || "Something went wrong";
			toast.error(message);
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center gap-2 justify-center">
						<TruckElectric className="text-violet-900 size-8" />
						<h1 className="text-3xl font-bold text-violet-900">VMS</h1>
					</div>
					<p className="text-sm text-gray-500 mt-1">
						Vehicle Management System
					</p>
				</div>

				{/* Title */}
				<div className="text-center mb-6">
					<h2 className="text-2xl font-semibold text-gray-900">
						Verify Your Email
					</h2>
					<p className="text-sm text-gray-500 mt-2">We sent a 6-digit OTP to</p>
					<p className="text-sm font-medium text-gray-900 mt-1">
						{email || "your email"}
					</p>
				</div>
				<form onSubmit={handleVerify} className="space-y-5">
					{/* OTP */}
					<div>
						<label
							htmlFor="otp"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Enter OTP
						</label>
						<input
							id="otp"
							type="text"
							inputMode="numeric"
							maxLength={6}
							value={otp}
							onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
							placeholder="Enter 6-digit OTP"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-[0.4em] text-lg outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>
					{/* Verify */}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
					>
						{loading ? "Verifying..." : "Verify Email"}
					</button>
				</form>
				{/* Resend */}
				<div className="text-center mt-6 text-sm text-gray-500">
					Didn't receive the OTP?{" "}
					<button
						type="button"
						onClick={handleResend}
						disabled={resending}
						className="font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-50 cursor-pointer"
					>
						{resending ? "Sending..." : "Resend OTP"}
					</button>
				</div>
				<div className="text-center mt-4">
					<Link
						to="/login"
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						Back to Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default VerifyEmail;
