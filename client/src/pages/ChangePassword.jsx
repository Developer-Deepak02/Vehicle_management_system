import { useState } from "react";
import toast from "react-hot-toast";
import { LockKeyhole, Eye, EyeOff, Save } from "lucide-react";
import { changePassword } from "../services/userService";

const ChangePassword = () => {
	const [formData, setFormData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState({
		oldPassword: false,
		newPassword: false,
		confirmPassword: false,
	});
	const [loading, setLoading] = useState(false);

	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Toggle password visibility
	const togglePassword = (field) => {
		setShowPassword((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	// Change password
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!formData.oldPassword ||
			!formData.newPassword ||
			!formData.confirmPassword
		) {
			toast.error("All password fields are required");
			return;
		}

		if (formData.newPassword.length < 6) {
			toast.error("New password must be at least 6 characters");
			return;
		}

		if (formData.newPassword !== formData.confirmPassword) {
			toast.error("New password and confirm password do not match");
			return;
		}

		try {
			setLoading(true);

			const data = await changePassword(formData);

			toast.success(data.message || "Password changed successfully");

			setFormData({
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			console.error("Change password error:", error);
			const message =
				error.response?.data?.message || "Failed to change password";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* PAGE HEADER */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
				<p className="text-sm text-gray-500 mt-1">
					Update your account password to keep your account secure.
				</p>
			</div>

			{/* CHANGE PASSWORD FORM */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
						<LockKeyhole className="w-5 h-5 text-violet-600" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Password Security
						</h2>
						<p className="text-xs text-gray-500">
							Enter your current password and choose a new one.
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Current Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Current Password
						</label>
						<div className="relative">
							<input
								type={showPassword.oldPassword ? "text" : "password"}
								name="oldPassword"
								value={formData.oldPassword}
								onChange={handleChange}
								placeholder="Enter current password"
								className="w-full h-11 pl-3 pr-11 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
							<button
								type="button"
								onClick={() => togglePassword("oldPassword")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
							>
								{showPassword.oldPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					{/* New Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							New Password
						</label>
						<div className="relative">
							<input
								type={showPassword.newPassword ? "text" : "password"}
								name="newPassword"
								value={formData.newPassword}
								onChange={handleChange}
								placeholder="Enter new password"
								className="w-full h-11 pl-3 pr-11 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
							<button
								type="button"
								onClick={() => togglePassword("newPassword")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
							>
								{showPassword.newPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
						<p className="text-xs text-gray-400 mt-1">
							Password must be at least 6 characters.
						</p>
					</div>

					{/* Confirm Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Confirm New Password
						</label>
						<div className="relative">
							<input
								type={showPassword.confirmPassword ? "text" : "password"}
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirm new password"
								className="w-full h-11 pl-3 pr-11 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
							<button
								type="button"
								onClick={() => togglePassword("confirmPassword")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
							>
								{showPassword.confirmPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					{/* Submit */}
					<div className="pt-2">
						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							{loading ? "Changing..." : "Change Password"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
