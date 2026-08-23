import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
	ArrowLeft,
	Truck,
	User,
	Calendar,
	Hash,
	FileText,
	CheckCircle,
	XCircle,
	UserRound,
} from "lucide-react";
import { getVehicle } from "../../services/vehicleService";

const VehicleDetails = () => {
	const { id } = useParams();
	const [vehicle, setVehicle] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVehicle = async () => {
			try {
				setLoading(true);
				const data = await getVehicle(id);
				console.log("Vehicle:", data);
				setVehicle(data);
			} catch (error) {
				console.error("Get vehicle error:", error);
				const message =
					error.response?.data?.message || "Failed to load vehicle";
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};
		fetchVehicle();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading vehicle...</p>
				</div>
			</div>
		);
	}

	if (!vehicle) {
		return (
			<div className="flex flex-col items-center justify-center min-h-96">
				<Truck className="w-12 h-12 text-gray-300" />
				<p className="text-gray-500 mt-3">Vehicle not found.</p>
				<Link
					to="/admin/vehicles"
					className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700"
				>
					Back to Vehicles
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link
						to="/admin/vehicles"
						className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{vehicle.vehicleName}
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							{vehicle.vehicleModel} • {vehicle.vehicleYear}
						</p>
					</div>
				</div>

				{/* Status */}

				<div className="flex items-center gap-2">
					<span
						className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
							vehicle.status === "assigned"
								? "bg-blue-100 text-blue-700"
								: "bg-green-100 text-green-700"
						}`}
					>
						{vehicle.status}
					</span>

					<span
						className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
							vehicle.active
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-red-700"
						}`}
					>
						{vehicle.active ? (
							<CheckCircle className="w-3.5 h-3.5" />
						) : (
							<XCircle className="w-3.5 h-3.5" />
						)}
						{vehicle.active ? "Active" : "Inactive"}
					</span>
				</div>
			</div>

			{/* Photos */}

			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<div className="flex items-center gap-3 mb-5">
					<div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
						<Truck className="w-5 h-5 text-violet-600" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Vehicle Photos
						</h2>
						<p className="text-xs text-gray-500 mt-0.5">
							{vehicle.vehiclePhotos?.length || 0} photos
						</p>
					</div>
				</div>

				{vehicle.vehiclePhotos?.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{vehicle.vehiclePhotos.map((photo, index) => (
							<div
								key={index}
								className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
							>
								<img
									src={photo}
									alt={`${vehicle.vehicleName} ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				) : (
					<div className="py-10 text-center text-sm text-gray-400">
						No vehicle photos available.
					</div>
				)}
			</div>

			{/* Vehicle Information */}

			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<h2 className="text-base font-semibold text-gray-900 mb-5">
					Vehicle Information
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					<InfoItem
						icon={<Truck />}
						label="Vehicle Name"
						value={vehicle.vehicleName}
					/>
					<InfoItem
						icon={<Truck />}
						label="Vehicle Model"
						value={vehicle.vehicleModel}
					/>
					<InfoItem
						icon={<Calendar />}
						label="Vehicle Year"
						value={vehicle.vehicleYear}
					/>
					<InfoItem
						icon={<Truck />}
						label="Vehicle Type"
						value={vehicle.vehicleType}
					/>
					<InfoItem
						icon={<Hash />}
						label="Registration Number"
						value={vehicle.registrationNumber}
					/>
					<InfoItem
						icon={<Hash />}
						label="Chassis Number"
						value={vehicle.chassisNumber}
					/>
				</div>
			</div>

			{/* Driver */}

			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<h2 className="text-base font-semibold text-gray-900 mb-5">
					Driver Assignment
				</h2>
				{vehicle.driverAssigned ? (
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center">
							<User className="w-6 h-6 text-violet-600" />
						</div>
						<div>
							<p className="font-semibold text-gray-900">Driver Assigned</p>
							<p className="text-sm text-gray-500">
								Driver ID: {vehicle.driverAssigned}
							</p>
							{vehicle.driverAssignedOn && (
								<p className="text-xs text-gray-400 mt-1">
									Assigned on{" "}
									{new Date(vehicle.driverAssignedOn).toLocaleString()}
								</p>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
							<UserRound className="w-6 h-6 text-gray-400" />
						</div>
						<div>
							<p className="font-medium text-gray-900">No driver assigned</p>
							<p className="text-sm text-gray-500">
								This vehicle is currently available.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Description */}

			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<div className="flex items-center gap-3 mb-4">
					<FileText className="w-5 h-5 text-violet-600" />
					<h2 className="text-base font-semibold text-gray-900">Description</h2>
				</div>
				<p className="text-sm text-gray-600 leading-6">
					{vehicle.vehicleDescription || "No description provided."}
				</p>
			</div>
			{/* Audit Information */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<h2 className="text-base font-semibold text-gray-900 mb-5">
					Record Information
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<InfoItem
						icon={<Calendar />}
						label="Created On"
						value={
							vehicle.createdOn
								? new Date(vehicle.createdOn).toLocaleString()
								: "—"
						}
					/>
					<InfoItem
						icon={<Calendar />}
						label="Last Updated"
						value={
							vehicle.updatedOn
								? new Date(vehicle.updatedOn).toLocaleString()
								: "Never"
						}
					/>
				</div>
			</div>
		</div>
	);
};

/* Reusable information item */
const InfoItem = ({ icon, label, value }) => {
	return (
		<div className="flex items-start gap-3">
			<div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
				{icon && <div className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{icon}</div>}
			</div>
			<div className="min-w-0">
				<p className="text-xs text-gray-500">{label}</p>
				<p className="text-sm font-medium text-gray-900 mt-1 break-words">
					{value || "—"}
				</p>
			</div>
		</div>
	);
};

export default VehicleDetails;
