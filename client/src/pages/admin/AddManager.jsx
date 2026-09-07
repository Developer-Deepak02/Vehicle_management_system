import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createManager } from "../../services/userService";

const AddManager = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name.trim() || !formData.email.trim()) {
			toast.error("Name and email are required");
			return;
		}

		try {
			setLoading(true);

			await createManager({
				name: formData.name.trim(),
				email: formData.email.trim(),
			});

			toast.success("Manager invitation sent successfully");

			navigate("/admin/managers");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create manager");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<Link
					to="/admin/managers"
					className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
				>
					<ArrowLeft className="size-4" />
					Back to Managers
				</Link>

				<h1 className="text-2xl font-bold text-gray-900">Add Manager</h1>
				<p className="text-sm text-gray-500 mt-1">
					Create a manager account and send an invitation email.
				</p>
			</div>

			{/* Form Card */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="size-11 rounded-lg bg-violet-100 flex items-center justify-center">
						<UserPlus className="size-5 text-violet-700" />
					</div>

					<div>
						<h2 className="font-semibold text-gray-900">Manager Information</h2>
						<p className="text-sm text-gray-500">
							Enter the basic details of the manager.
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Full Name
						</label>

						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter manager name"
							className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Email Address
						</label>

						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="manager@example.com"
							className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Invitation Info */}
					<div className="rounded-lg bg-violet-50 border border-violet-100 p-4">
						<p className="text-sm font-medium text-violet-900">
							How manager invitation works
						</p>

						<p className="text-sm text-violet-700 mt-1">
							An invitation email will be sent to this email address. The
							manager can use the invitation to complete their account setup.
						</p>
					</div>

					{/* Buttons */}
					<div className="flex justify-end gap-3 pt-2">
						<Link
							to="/admin/managers"
							className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</Link>

						<button
							type="submit"
							disabled={loading}
							className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Sending..." : "Create Manager"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddManager;
