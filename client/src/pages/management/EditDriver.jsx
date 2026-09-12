import { useEffect, useState } from "react";
import { ArrowLeft, Save, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDriver, updateUser } from "../../services/userService";

const EditDriver = () => {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/drivers" : "/admin/drivers";

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		dateOfBirth: "",
		driverAddress: "",
	});

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const loadDriver = async () => {
			try {
				setLoading(true);

				const data = await getDriver(id);

				if (data.role !== "driver") {
					toast.error("User is not a driver");
					navigate(basePath);
					return;
				}

				setFormData({
					name: data.name || "",
					email: data.email || "",
					dateOfBirth: data.dateOfBirth
						? new Date(data.dateOfBirth).toISOString().split("T")[0]
						: "",
					driverAddress: data.driverAddress || "",
				});
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load driver");
				navigate(basePath);
			} finally {
				setLoading(false);
			}
		};

		loadDriver();
	}, [id, navigate, basePath]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}

		try {
			setSaving(true);

			await updateUser(id, {
				name: formData.name.trim(),
				dateOfBirth: formData.dateOfBirth || null,
				driverAddress: formData.driverAddress.trim(),
			});

			toast.success("Driver updated successfully");

			navigate(`${basePath}/${id}`);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update driver");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-sm text-gray-500">Loading driver...</p>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<Link
					to={`${basePath}/${id}`}
					className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
				>
					<ArrowLeft className="size-4" />
					Back to Driver
				</Link>

				<h1 className="text-2xl font-bold text-gray-900">Edit Driver</h1>

				<p className="text-sm text-gray-500 mt-1">
					Update the driver's personal information.
				</p>
			</div>

			{/* Form Card */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="size-11 rounded-lg bg-violet-100 flex items-center justify-center">
						<UserRound className="size-5 text-violet-700" />
					</div>

					<div>
						<h2 className="font-semibold text-gray-900">Driver Information</h2>

						<p className="text-sm text-gray-500">
							Change the driver's basic information.
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
							placeholder="Enter driver name"
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
							value={formData.email}
							disabled
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
						/>

						<p className="text-xs text-gray-400 mt-1.5">
							Email address cannot be changed.
						</p>
					</div>

					{/* Date of Birth */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Date of Birth
						</label>

						<input
							type="date"
							name="dateOfBirth"
							value={formData.dateOfBirth}
							onChange={handleChange}
							className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Driver Address */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5">
							Address
						</label>

						<textarea
							name="driverAddress"
							value={formData.driverAddress}
							onChange={handleChange}
							placeholder="Enter driver address"
							rows="4"
							className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Buttons */}
					<div className="flex justify-end gap-3 pt-2">
						<Link
							to={`${basePath}/${id}`}
							className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</Link>

						<button
							type="submit"
							disabled={saving}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Save className="size-4" />
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditDriver;
