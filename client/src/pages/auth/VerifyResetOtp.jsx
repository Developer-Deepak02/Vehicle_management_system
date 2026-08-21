import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TruckElectric } from "lucide-react";
import { verifyResetOtp } from "../../services/authService";

const VerifyResetOtp = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const email = location.state?.email;
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);

	const handleVerify = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Email not found. Please try again.");
			navigate("/forgot-password");
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
			const data = await verifyResetOtp(email, otp);
			toast.success(data.message);
			navigate("/reset-password", {
				state: {
					email,
				},
			});
		} catch (error) {
			console.error("Reset OTP verification error:", error);
			const message = error.response?.data?.message || "Something went wrong";
			toast.error(message);
		} finally {
			setLoading(false);
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
						Verify Reset OTP
					</h2>
					<p className="text-sm text-gray-500 mt-2">
						Enter the 6-digit OTP sent to
					</p>
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
						{loading ? "Verifying..." : "Verify OTP"}
					</button>
				</form>
				{/* Back */}
				<div className="text-center mt-6">
					<Link
						to="/forgot-password"
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						Back to Forgot Password
					</Link>
				</div>
			</div>
		</div>
	);
};

export default VerifyResetOtp;
