import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Truck,
	Calendar,
	Hash,
	FileText,
	Car,
	AlertCircle,
} from "lucide-react";
import { getMyVehicle } from "../../services/vehicleService";

const MyVehicle = () => {
	const [vehicle, setVehicle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [notAssigned, setNotAssigned] = useState(false);

	const loadVehicle = async () => {
		try {
			setLoading(true);
			setNotAssigned(false);
			const data = await getMyVehicle();
			setVehicle(data);
		} catch (error) {
			console.error("Get my vehicle error:", error);
			if (error.response?.status === 404) {
				setVehicle(null);
				setNotAssigned(true);
			} else {
				const message =
					error.response?.data?.message || "Failed to load vehicle";
				toast.error(message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadVehicle();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading your vehicle...</p>
				</div>
			</div>
		);
	}

	if (notAssigned) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
					<div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
						<AlertCircle className="w-7 h-7 text-amber-600" />
					</div>
					<h1 className="text-xl font-semibold text-gray-900 mt-5">
						No Vehicle Assigned
					</h1>
					<p className="text-sm text-gray-500 mt-2 leading-6">
						You currently do not have a vehicle assigned to you. Please contact
						your manager or administrator.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* PAGE HEADER */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">My Vehicle</h1>
				<p className="text-sm text-gray-500 mt-1">
					View the vehicle currently assigned to you.
				</p>
			</div>

			{/* VEHICLE PHOTOS */}
			{vehicle.vehiclePhotos?.length > 0 && (
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
					<div className="p-6 border-b border-gray-100">
						<h2 className="text-lg font-semibold text-gray-900">
							Vehicle Photos
						</h2>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
						{vehicle.vehiclePhotos.map((photo, index) => (
							<div
								key={index}
								className="aspect-video rounded-xl overflow-hidden bg-gray-100"
							>
								<img
									src={photo}
									alt={`${vehicle.vehicleName} ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>
			)}

			{/* VEHICLE INFORMATION */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
				<div className="p-6 border-b border-gray-100 flex items-center gap-3">
					<div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
						<Truck className="w-5 h-5 text-violet-700" />
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							{vehicle.vehicleName}
						</h2>
						<p className="text-sm text-gray-500">
							{vehicle.vehicleModel} • {vehicle.vehicleYear}
						</p>
					</div>
				</div>

				<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="flex items-start gap-3">
						<Car className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Vehicle Type</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{vehicle.vehicleType || "—"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Hash className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Registration Number</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{vehicle.registrationNumber || "—"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Hash className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Chassis Number</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{vehicle.chassisNumber || "—"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Assigned On</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{vehicle.driverAssignedOn
									? new Date(vehicle.driverAssignedOn).toLocaleDateString()
									: "—"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<FileText className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Description</p>
							<p className="text-sm text-gray-700 mt-1 leading-6">
								{vehicle.vehicleDescription || "No description available"}
							</p>
						</div>
					</div>

					<div>
						<p className="text-xs text-gray-500">Status</p>
						<span className="inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
							{vehicle.status === "assigned" ? "Assigned" : vehicle.status}
						</span>
					</div>
				</div>
			</div>

			{/* READ ONLY NOTICE */}
			<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
				<p className="text-sm text-blue-700">
					Vehicle information is read-only. Contact your manager or
					administrator if any vehicle information needs to be changed.
				</p>
			</div>
		</div>
	);
};

export default MyVehicle;
