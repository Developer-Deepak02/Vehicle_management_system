import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAvailableDrivers } from "../../services/userService";
import {
	getVehicle,
	assignVehicle,
	unassignVehicle,
	activateDeactivateVehicle,
	deleteVehicle,
} from "../../services/vehicleService";
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
	Search,
	X,
	Loader2,
	Edit,
	Power,
	PowerOff,
	CircleAlert,
} from "lucide-react";

const VehicleDetails = () => {
	const { id } = useParams();
	const location = useLocation();
	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/vehicles" : "/admin/vehicles";
	const driverBasePath = isManager ? "/manager/drivers" : "/admin/drivers";
	const [vehicle, setVehicle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [drivers, setDrivers] = useState([]);
	const [selectedDriver, setSelectedDriver] = useState(null);
	const [driverSearch, setDriverSearch] = useState("");
	const [loadingDrivers, setLoadingDrivers] = useState(false);
	const [assigning, setAssigning] = useState(false);
	const [unassigning, setUnassigning] = useState(false);
	const [showUnassignModal, setShowUnassignModal] = useState(false);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [statusLoading, setStatusLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	// Fetch vehicle
	const fetchVehicle = async (showLoader = false) => {
		try {
			if (showLoader) {
				setLoading(true);
			}
			const data = await getVehicle(id);
			console.log("Vehicle:", data);
			setVehicle(data);
		} catch (error) {
			console.error("Get vehicle error:", error);
			const message = error.response?.data?.message || "Failed to load vehicle";
			toast.error(message);
		} finally {
			if (showLoader) {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		fetchVehicle(true);
	}, [id]);

	// Open assign driver modal
	const handleOpenAssignModal = async () => {
		try {
			setShowAssignModal(true);
			setLoadingDrivers(true);
			setDriverSearch("");
			setSelectedDriver(null);
			const data = await getAvailableDrivers();
			console.log("Available drivers:", data);
			setDrivers(data.drivers || []);
		} catch (error) {
			console.error("Get available drivers error:", error);
			const message = error.response?.data?.message || "Failed to load drivers";
			toast.error(message);
			setShowAssignModal(false);
		} finally {
			setLoadingDrivers(false);
		}
	};

	// Assign vehicle
	const handleAssignVehicle = async () => {
		if (!selectedDriver) {
			toast.error("Please select a driver");
			return;
		}
		try {
			setAssigning(true);
			const data = await assignVehicle(vehicle._id, selectedDriver._id);
			toast.success(data.message);
			setShowAssignModal(false);
			setSelectedDriver(null);
			setDriverSearch("");
			await fetchVehicle();
		} catch (error) {
			console.error("Assign vehicle error:", error);
			const message =
				error.response?.data?.message || "Failed to assign vehicle";
			toast.error(message);
		} finally {
			setAssigning(false);
		}
	};

	// Unassign vehicle
	const handleUnassignVehicle = async () => {
		if (!vehicle?.driverAssigned) {
			toast.error("No driver is assigned to this vehicle");
			return;
		}
		try {
			setUnassigning(true);
			const data = await unassignVehicle(vehicle._id);
			toast.success(data.message);
			setShowUnassignModal(false);
			await fetchVehicle();
		} catch (error) {
			console.error("Unassign vehicle error:", error);
			const message =
				error.response?.data?.message || "Failed to unassign vehicle";
			toast.error(message);
		} finally {
			setUnassigning(false);
		}
	};

	// Activate / deactivate vehicle
	const handleStatusChange = async () => {
		if (!vehicle) return;
		try {
			setStatusLoading(true);
			const data = await activateDeactivateVehicle(vehicle._id);
			toast.success(data.message || "Vehicle status updated successfully");
			setShowStatusModal(false);
			await fetchVehicle();
		} catch (error) {
			console.error("Vehicle status update error:", error);
			const message =
				error.response?.data?.message || "Failed to update vehicle status";
			toast.error(message);
		} finally {
			setStatusLoading(false);
		}
	};

	// Delete vehicle
	const handleDeleteVehicle = async () => {
		if (!vehicle) return;
		try {
			setDeleteLoading(true);
			const data = await deleteVehicle(vehicle._id);
			toast.success(data.message || "Vehicle deleted successfully");
			setShowDeleteModal(false);
			window.location.href = basePath;
		} catch (error) {
			console.error("Delete vehicle error:", error);
			const message =
				error.response?.data?.message || "Failed to delete vehicle";
			toast.error(message);
		} finally {
			setDeleteLoading(false);
		}
	};

	// Filter drivers
	const filteredDrivers = drivers.filter((driver) => {
		const query = driverSearch.toLowerCase();
		return (
			driver.name?.toLowerCase().includes(query) ||
			driver.email?.toLowerCase().includes(query)
		);
	});

	// Loading
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

	// Vehicle not found
	if (!vehicle) {
		return (
			<div className="flex flex-col items-center justify-center min-h-96">
				<Truck className="w-12 h-12 text-gray-300" />
				<p className="text-gray-500 mt-3">Vehicle not found.</p>
				<Link
					to={basePath}
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
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div className="flex items-center gap-4">
					<Link
						to={basePath}
						className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition shrink-0"
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

				<div className="flex flex-wrap items-center gap-2">
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

					<Link
						to={`${basePath}/${vehicle._id}/edit`}
						className="inline-flex items-center gap-2 px-3.5 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
					>
						<Edit className="w-4 h-4" />
						Edit
					</Link>

					<button
						type="button"
						onClick={() => setShowStatusModal(true)}
						disabled={vehicle.active && vehicle.status === "assigned"}
						title={
							vehicle.active && vehicle.status === "assigned"
								? "Unassign the vehicle before deactivating it"
								: vehicle.active
									? "Deactivate vehicle"
									: "Activate vehicle"
						}
						className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition border ${
							vehicle.active
								? "border-red-200 text-red-600 hover:bg-red-50"
								: "border-green-200 text-green-600 hover:bg-green-50"
						} disabled:opacity-40 disabled:cursor-not-allowed`}
					>
						{vehicle.active ? (
							<PowerOff className="w-4 h-4" />
						) : (
							<Power className="w-4 h-4" />
						)}
						{vehicle.active ? "Deactivate" : "Activate"}
					</button>

					<button
						type="button"
						onClick={() => setShowDeleteModal(true)}
						disabled={vehicle.status === "assigned"}
						title={
							vehicle.status === "assigned"
								? "Unassign the vehicle before deleting it"
								: "Delete vehicle"
						}
						className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<CircleAlert className="w-4 h-4" />
						Delete
					</button>
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

			{/* Driver Assignment */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-base font-semibold text-gray-900">
						Driver Assignment
					</h2>

					{vehicle.status === "available" && vehicle.active && (
						<button
							onClick={handleOpenAssignModal}
							className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
						>
							<UserRound className="w-4 h-4" />
							Assign Driver
						</button>
					)}
				</div>

				{vehicle.driverAssigned ? (
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center">
								<User className="w-6 h-6 text-violet-600" />
							</div>

							<div>
								<Link
									to={`${driverBasePath}/${vehicle.driverAssigned._id}`}
									className="font-semibold text-violet-600 hover:text-violet-700 hover:underline"
								>
									{vehicle.driverAssigned.name}
								</Link>

								<p className="text-sm text-gray-500">
									{vehicle.driverAssigned.email}
								</p>

								{vehicle.driverAssignedOn && (
									<p className="text-xs text-gray-400 mt-1">
										Assigned on{" "}
										{new Date(vehicle.driverAssignedOn).toLocaleString()}
									</p>
								)}
							</div>
						</div>

						<button
							type="button"
							onClick={() => setShowUnassignModal(true)}
							disabled={unassigning}
							className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							{unassigning ? "Unassigning..." : "Unassign Driver"}
						</button>
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

			{/* Record Information */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<h2 className="text-base font-semibold text-gray-900 mb-5">
					Record Information
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					<InfoItem
						icon={<User />}
						label="Created By"
						value={
							vehicle.createdBy
								? `${vehicle.createdBy.name} (${vehicle.createdBy.email})`
								: "Unknown"
						}
					/>

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

			{/* Assign driver modal */}
			{showAssignModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
						<div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
							<div>
								<h2 className="text-lg font-semibold text-gray-900">
									Assign Driver
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									Select a driver for{" "}
									<span className="font-medium text-gray-700">
										{vehicle.vehicleName}
									</span>
								</p>
							</div>

							<button
								type="button"
								onClick={() => {
									if (!assigning) {
										setShowAssignModal(false);
										setSelectedDriver(null);
									}
								}}
								disabled={assigning}
								className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="px-6 pt-5">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

								<input
									type="text"
									value={driverSearch}
									onChange={(e) => setDriverSearch(e.target.value)}
									placeholder="Search driver by name or email..."
									disabled={assigning}
									className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
								/>
							</div>
						</div>

						<div className="px-6 py-4 max-h-80 overflow-y-auto">
							{loadingDrivers ? (
								<div className="flex justify-center py-10">
									<Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
								</div>
							) : filteredDrivers.length === 0 ? (
								<div className="text-center py-10">
									<UserRound className="w-10 h-10 text-gray-300 mx-auto" />
									<p className="text-sm text-gray-500 mt-3">
										No available drivers found.
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{filteredDrivers.map((driver) => {
										const isSelected = selectedDriver?._id === driver._id;

										return (
											<button
												key={driver._id}
												type="button"
												onClick={() => setSelectedDriver(driver)}
												disabled={assigning}
												className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition disabled:opacity-60 disabled:cursor-not-allowed ${
													isSelected
														? "border-violet-500 bg-violet-50"
														: "border-gray-200 hover:bg-gray-50"
												}`}
											>
												<div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
													<UserRound className="w-5 h-5 text-violet-600" />
												</div>

												<div className="flex-1 min-w-0">
													<p className="font-medium text-gray-900">
														{driver.name}
													</p>

													<p className="text-xs text-gray-500 truncate">
														{driver.email}
													</p>
												</div>

												<div
													className={`w-4 h-4 rounded-full border-2 shrink-0 ${
														isSelected
															? "border-violet-600 bg-violet-600"
															: "border-gray-300"
													}`}
												/>
											</button>
										);
									})}
								</div>
							)}
						</div>

						<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
							<button
								type="button"
								onClick={() => {
									if (!assigning) {
										setShowAssignModal(false);
										setSelectedDriver(null);
									}
								}}
								disabled={assigning}
								className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleAssignVehicle}
								disabled={!selectedDriver || assigning}
								className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
							>
								{assigning && <Loader2 className="w-4 h-4 animate-spin" />}
								{assigning ? "Assigning..." : "Assign Driver"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Unassign driver modal */}
			{showUnassignModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => {
							if (!unassigning) {
								setShowUnassignModal(false);
							}
						}}
					/>

					<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
						<div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
							<XCircle className="w-6 h-6 text-red-500" />
						</div>

						<h2 className="text-lg font-semibold text-gray-900">
							Unassign Driver?
						</h2>

						<p className="text-sm text-gray-500 mt-2 leading-6">
							Are you sure you want to unassign{" "}
							<span className="font-medium text-gray-700">
								{vehicle.driverAssigned?.name}
							</span>{" "}
							from this vehicle?
						</p>

						<div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
									<User className="w-4 h-4 text-violet-600" />
								</div>

								<div>
									<p className="text-sm font-medium text-gray-900">
										{vehicle.driverAssigned?.name}
									</p>

									<p className="text-xs text-gray-500">
										{vehicle.driverAssigned?.email}
									</p>
								</div>
							</div>
						</div>

						<p className="text-xs text-gray-400 mt-4">
							The vehicle will become available for another driver.
						</p>

						<div className="flex justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setShowUnassignModal(false)}
								disabled={unassigning}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleUnassignVehicle}
								disabled={unassigning}
								className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
							>
								{unassigning ? (
									<span className="flex items-center gap-2">
										<span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
										Unassigning...
									</span>
								) : (
									"Yes, Unassign"
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Status confirmation modal */}
			{showStatusModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => !statusLoading && setShowStatusModal(false)}
					/>

					<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
						<button
							type="button"
							onClick={() => !statusLoading && setShowStatusModal(false)}
							disabled={statusLoading}
							className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-40"
						>
							<X className="w-5 h-5" />
						</button>

						<div
							className={`w-12 h-12 rounded-xl flex items-center justify-center ${
								vehicle.active ? "bg-red-50" : "bg-green-50"
							}`}
						>
							{vehicle.active ? (
								<PowerOff className="w-6 h-6 text-red-600" />
							) : (
								<Power className="w-6 h-6 text-green-600" />
							)}
						</div>

						<h2 className="text-lg font-semibold text-gray-900 mt-4">
							{vehicle.active ? "Deactivate vehicle?" : "Activate vehicle?"}
						</h2>

						<p className="text-sm text-gray-500 mt-2 leading-6">
							Are you sure you want to{" "}
							{vehicle.active ? "deactivate" : "activate"}{" "}
							<span className="font-semibold text-gray-700">
								{vehicle.vehicleName}
							</span>
							?
						</p>

						{vehicle.active && vehicle.status === "assigned" && (
							<div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
								This vehicle is currently assigned to a driver. Unassign it
								before deactivating.
							</div>
						)}

						<div className="flex justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setShowStatusModal(false)}
								disabled={statusLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleStatusChange}
								disabled={
									statusLoading ||
									(vehicle.active && vehicle.status === "assigned")
								}
								className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
									vehicle.active
										? "bg-red-600 hover:bg-red-700"
										: "bg-green-600 hover:bg-green-700"
								}`}
							>
								{statusLoading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Updating...
									</>
								) : vehicle.active ? (
									"Deactivate"
								) : (
									"Activate"
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete confirmation modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => !deleteLoading && setShowDeleteModal(false)}
					/>

					<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
						<button
							type="button"
							onClick={() => !deleteLoading && setShowDeleteModal(false)}
							disabled={deleteLoading}
							className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-40"
						>
							<X className="w-5 h-5" />
						</button>

						<div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
							<CircleAlert className="w-6 h-6 text-red-600" />
						</div>

						<h2 className="text-lg font-semibold text-gray-900 mt-4">
							Delete vehicle?
						</h2>

						<p className="text-sm text-gray-500 mt-2 leading-6">
							Are you sure you want to delete{" "}
							<span className="font-semibold text-gray-700">
								{vehicle.vehicleName}
							</span>
							? This action cannot be undone.
						</p>

						<div className="flex justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setShowDeleteModal(false)}
								disabled={deleteLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleDeleteVehicle}
								disabled={deleteLoading}
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50"
							>
								{deleteLoading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Deleting...
									</>
								) : (
									"Delete Vehicle"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

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
