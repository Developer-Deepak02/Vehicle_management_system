import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TruckElectric } from "lucide-react";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your email");
			return;
		}
		try {
			setLoading(true);
			const data = await forgotPassword(email);
			toast.success(data.message);
			navigate("/verify-reset-otp", {
				state: {
					email,
				},
			});
		} catch (error) {
			console.error("Forgot password error:", error);
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
						Forgot Password?
					</h2>

					<p className="text-sm text-gray-500 mt-2">
						Enter your email and we'll send you an OTP to reset your password.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Email */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Email
						</label>

						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
					>
						{loading ? "Sending OTP..." : "Send OTP"}
					</button>
				</form>

				{/* Back to Login */}
				<div className="text-center mt-6">
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

export default ForgotPassword;
