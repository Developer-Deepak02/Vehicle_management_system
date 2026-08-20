import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");

		if (!email || !password) {
			setError("Email and password are required");
			return;
		}

		try {
			setLoading(true);

			const data = await loginUser(email, password);

			console.log("Login successful:", data);

			login(data);

			if (data.role === "admin") {
				navigate("/admin/dashboard");
			} else if (data.role === "manager") {
				navigate("/manager/dashboard");
			} else if (data.role === "driver") {
				navigate("/driver/dashboard");
			}
		} catch (error) {
			console.error("Login error:", error);

			const message = error.response?.data?.message || "Something went wrong";

			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-green-600">VMS</h1>
					<p className="text-sm text-gray-500 mt-1">
						Vehicle Management System
					</p>
				</div>
				{/* Title */}
				<div className="mb-6">
					<h2 className=" text-xl text-center font-semibold text-gray-900">
						Login to your account
					</h2>
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
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
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
							placeholder="Enter your password"
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
						/>
					</div>
					{/* Forgot Password */}
					<div className="text-right">
						<Link
							to="/forgot-password"
							className="text-sm font-medium text-green-600 hover:text-green-700"
						>
							Forgot password?
						</Link>
					</div>
					{/* Error */}
					{error && (
						<div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
							{error}
						</div>
					)}
					{/* Login Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				{/* Register */}
				<div className="text-center mt-6 text-sm text-gray-500">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="font-semibold text-green-600 hover:text-green-700"
					>
						Create here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
