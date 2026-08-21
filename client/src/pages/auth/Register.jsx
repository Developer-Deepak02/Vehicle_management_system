import { TruckElectric } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../services/authService";

const Register = () => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name || !email || !password || !confirmPassword) {
			toast.error("Please fill all the fields");
			return;
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			setLoading(true);
			const data = await registerUser(name, email, password);
			console.log("Registration successful:", data);
			toast.success(data.message);
			navigate("/verify-email", {
				state: {
					email,
				},
			});
		} catch (error) {
			console.error("Registration error:", error);
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
				<div className="mb-6">
					<h2 className=" text-xl text-center font-semibold text-gray-900">
						Create your account
					</h2>
				</div>
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* name */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>
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
					{/* Password */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Create a password"
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
							placeholder="Confirm your password"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Login Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
					>
						{loading ? "Creating account..." : "Create Account"}
					</button>
				</form>
				{/* Register */}
				<div className="text-center mt-6 text-sm text-gray-500">
					Already have an account ?{" "}
					<Link
						to="/login"
						className="font-semibold text-violet-600 hover:text-violet-700"
					>
						Login here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
