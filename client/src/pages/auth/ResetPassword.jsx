import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TruckElectric } from "lucide-react";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const email = location.state?.email;
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email) {
			toast.error("Reset session not found. Please try again.");
			navigate("/forgot-password");
			return;
		}
		if (!newPassword || !confirmPassword) {
			toast.error("Please fill all the fields");
			return;
		}
		if (newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			setLoading(true);
			const data = await resetPassword(email, newPassword);
			toast.success(data.message);
			navigate("/login");
		} catch (error) {
			console.error("Reset password error:", error);
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
						Reset Password
					</h2>
					<p className="text-sm text-gray-500 mt-2">
						Create a new password for your account.
					</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* New Password */}
					<div>
						<label
							htmlFor="newPassword"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							New Password
						</label>
						<input
							id="newPassword"
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="Enter new password"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>
					{/* Confirm Password */}
					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm new password"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>
					{/* Submit */}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
					>
						{loading ? "Resetting..." : "Reset Password"}
					</button>
				</form>
				{/* Login */}
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

export default ResetPassword;
