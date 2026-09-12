import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createDriver } from "../../services/userService";

const AddDriver = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/drivers" : "/admin/drivers";

	const [formData, setFormData] = useState({
		name: "",
		email: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name.trim() || !formData.email.trim()) {
			toast.error("Name and email are required");
			return;
		}

		try {
			setLoading(true);

			await createDriver({
				name: formData.name.trim(),
				email: formData.email.trim(),
			});

			toast.success("Driver invitation sent successfully");

			navigate(basePath);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create driver");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<Link
					to={basePath}
					className="p-2 rounded-lg text-gray-500 hover:text-violet-700 hover:bg-violet-50"
				>
					<ArrowLeft className="size-5" />
				</Link>

				<div>
					<h1 className="text-2xl font-bold text-gray-900">Add Driver</h1>
					<p className="text-sm text-gray-500 mt-1">
						Create a driver account and send an invitation.
					</p>
				</div>
			</div>

			{/* Form */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Driver Name
						</label>

						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter driver name"
							className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							disabled={loading}
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
							placeholder="Enter driver email"
							className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							disabled={loading}
						/>
					</div>

					{/* Information */}
					<div className="rounded-lg bg-violet-50 border border-violet-100 p-4">
						<p className="text-sm text-violet-800">
							An invitation will be sent to this email address. The driver can
							use the invitation to create their password and activate their
							account.
						</p>
					</div>

					{/* Buttons */}
					<div className="flex justify-end gap-3 pt-2">
						<Link
							to={basePath}
							className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</Link>

						<button
							type="submit"
							disabled={loading}
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<UserPlus className="size-4" />
							{loading ? "Creating..." : "Add Driver"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddDriver;
