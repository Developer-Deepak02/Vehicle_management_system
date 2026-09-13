import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Truck,
	Plus,
	Eye,
	Search,
	SlidersHorizontal,
	RotateCcw,
	Power,
	PowerOff,
	X,
	CircleAlert,
} from "lucide-react";
import {
	getAllVehicles,
	activateDeactivateVehicle,
	deleteVehicle,
} from "../../services/vehicleService";
import { Link, useLocation } from "react-router-dom";

const Vehicles = () => {
	const location = useLocation();
	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/vehicles" : "/admin/vehicles";
	const [vehicles, setVehicles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("");
	const [vehicleType, setVehicleType] = useState("");
	const [active, setActive] = useState("");
	const [selectedVehicle, setSelectedVehicle] = useState(null);
	const [statusLoading, setStatusLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalVehicles: 0,
		totalPages: 0,
	});

	// Get vehicles
	const handleSearch = async (pageNumber = 1) => {
		try {
			setLoading(true);
			const params = {
				page: pageNumber,
				limit: 10,
			};
			if (search.trim()) {
				params.search = search.trim();
			}
			if (status) {
				params.status = status;
			}
			if (vehicleType) {
				params.vehicleType = vehicleType;
			}
			if (active !== "") {
				params.active = active;
			}
			const data = await getAllVehicles(params);
			console.log("Vehicles response:", data);
			setVehicles(data.vehicles);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Get vehicles error:", error);
			const message =
				error.response?.data?.message || "Failed to load vehicles";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	// Initial load
	useEffect(() => {
		handleSearch(1);
	}, []);

	// Clear filters
	const handleClearFilters = () => {
		setSearch("");
		setStatus("");
		setVehicleType("");
		setActive("");
		setTimeout(() => {
			handleSearch(1);
		}, 0);
	};

	// Activate / deactivate vehicle
	const handleStatusChange = async () => {
		if (!selectedVehicle) return;
		try {
			setStatusLoading(true);
			const data = await activateDeactivateVehicle(selectedVehicle._id);
			toast.success(data.message || "Vehicle status updated successfully");
			setSelectedVehicle(null);
			await handleSearch(pagination.currentPage);
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
		if (!selectedVehicle) return;
		try {
			setDeleteLoading(true);
			const data = await deleteVehicle(selectedVehicle._id);
			toast.success(data.message || "Vehicle deleted successfully");
			setSelectedVehicle(null);
			setShowDeleteModal(false);
			await handleSearch(pagination.currentPage);
		} catch (error) {
			console.error("Delete vehicle error:", error);
			const message =
				error.response?.data?.message || "Failed to delete vehicle";
			toast.error(message);
		} finally {
			setDeleteLoading(false);
		}
	};

	// Loading
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading vehicles...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* PAGE HEADER */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage and monitor all vehicles in the system.
					</p>
				</div>
				<Link
					to={`${basePath}/add`}
					className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
				>
					<Plus className="w-4 h-4" />
					Add Vehicle
				</Link>
			</div>

			{/* SEARCH + FILTERS */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
				{/* Filter header */}
				<div className="flex items-center gap-2 mb-4">
					<div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
						<SlidersHorizontal className="w-4 h-4 text-violet-600" />
					</div>
					<div>
						<h2 className="text-sm font-semibold text-gray-900">
							Search & Filters
						</h2>
						<p className="text-xs text-gray-500">
							Find vehicles using search and filters.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
					{/* Search */}
					<div className="relative lg:col-span-5">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch(1);
								}
							}}
							placeholder="Search name, model, registration or chassis..."
							className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Status */}
					<div className="lg:col-span-2">
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						>
							<option value="">All Status</option>
							<option value="available">Available</option>
							<option value="assigned">Assigned</option>
						</select>
					</div>

					{/* Vehicle Type */}
					<div className="lg:col-span-2">
						<select
							value={vehicleType}
							onChange={(e) => setVehicleType(e.target.value)}
							className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						>
							<option value="">All Types</option>
							<option value="LMV">LMV</option>
							<option value="HMV">HMV</option>
						</select>
					</div>

					{/* Activity */}
					<div className="lg:col-span-2">
						<select
							value={active}
							onChange={(e) => setActive(e.target.value)}
							className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						>
							<option value="">All Activity</option>
							<option value="true">Active</option>
							<option value="false">Inactive</option>
						</select>
					</div>

					{/* Search Button */}
					<div className="lg:col-span-1">
						<button
							onClick={() => handleSearch(1)}
							className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
						>
							Search
						</button>
					</div>
				</div>

				{/* Bottom filter actions */}
				<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
					<p className="text-xs text-gray-500">
						{pagination.totalVehicles} vehicle
						{pagination.totalVehicles !== 1 ? "s" : ""} found
					</p>

					<button
						onClick={handleClearFilters}
						className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 transition cursor-pointer"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						Clear filters
					</button>
				</div>
			</div>

			{/* VEHICLE TABLE */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
				{vehicles.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-50 border-b border-gray-200">
									<tr>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Vehicle
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Registration
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Type
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Status
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Driver
										</th>
										<th className="text-right px-6 py-4 font-semibold text-gray-600">
											Action
										</th>
									</tr>
								</thead>

								<tbody className="divide-y divide-gray-100">
									{vehicles.map((vehicle) => (
										<tr
											key={vehicle._id}
											className="hover:bg-gray-50 transition"
										>
											{/* Vehicle */}
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
														<Truck className="w-5 h-5 text-violet-700" />
													</div>

													<div>
														<p className="font-medium text-gray-900">
															{vehicle.vehicleName}
														</p>

														<p className="text-xs text-gray-500">
															{vehicle.vehicleModel} • {vehicle.vehicleYear}
														</p>
													</div>
												</div>
											</td>

											{/* Registration */}
											<td className="px-6 py-4 text-gray-700">
												{vehicle.registrationNumber}
											</td>

											{/* Type */}
											<td className="px-6 py-4">
												<span className="text-gray-700">
													{vehicle.vehicleType}
												</span>
											</td>

											{/* Status */}
											<td className="px-6 py-4">
												<div className="flex flex-col items-start gap-1">
													<span
														className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
															vehicle.status === "assigned"
																? "bg-blue-100 text-blue-700"
																: "bg-green-100 text-green-700"
														}`}
													>
														{vehicle.status}
													</span>
												</div>
											</td>

											{/* Driver */}
											<td className="px-6 py-4">
												{vehicle.driverAssigned ? (
													<div>
														<p className="font-medium text-gray-900">
															{vehicle.driverAssigned.name}
														</p>

														<p className="text-xs text-gray-500">
															{vehicle.driverAssigned.email}
														</p>
													</div>
												) : (
													<span className="text-gray-400">Not assigned</span>
												)}
											</td>

											{/* Action */}
											<td className="px-6 py-4 text-right">
												<div className="inline-flex items-center gap-2">
													<Link
														to={`${basePath}/${vehicle._id}`}
														className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
													>
														<Eye className="w-4 h-4" />
														View
													</Link>

													<Link
														to={`${basePath}/${vehicle._id}/edit`}
														className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
													>
														Edit
													</Link>

													<button
														onClick={() => {
															setSelectedVehicle(vehicle);
															setShowDeleteModal(true);
														}}
														disabled={vehicle.status === "assigned"}
														title={
															vehicle.status === "assigned"
																? "Unassign the vehicle before deleting it"
																: "Delete vehicle"
														}
														className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
													>
														Delete
													</button>

													<button
														onClick={() => setSelectedVehicle(vehicle)}
														disabled={
															vehicle.active && vehicle.status === "assigned"
														}
														title={
															vehicle.active && vehicle.status === "assigned"
																? "Unassign the vehicle before deactivating it"
																: vehicle.active
																	? "Deactivate vehicle"
																	: "Activate vehicle"
														}
														className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
															vehicle.active
																? "text-red-600 hover:bg-red-50"
																: "text-green-600 hover:bg-green-50"
														} disabled:opacity-40 disabled:cursor-not-allowed`}
													>
														{vehicle.active ? (
															<>
																<PowerOff className="w-4 h-4" />
																Deactivate
															</>
														) : (
															<>
																<Power className="w-4 h-4" />
																Activate
															</>
														)}
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* PAGINATION */}
						{pagination.totalPages > 0 && (
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
								<p className="text-sm text-gray-500">
									Showing page{" "}
									<span className="font-medium text-gray-700">
										{pagination.currentPage}
									</span>{" "}
									of{" "}
									<span className="font-medium text-gray-700">
										{pagination.totalPages}
									</span>
								</p>

								<div className="flex items-center gap-2">
									<button
										onClick={() => handleSearch(pagination.currentPage - 1)}
										disabled={pagination.currentPage === 1}
										className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										Previous
									</button>

									<div className="min-w-10 h-9 flex items-center justify-center px-3 bg-violet-600 text-white rounded-lg text-sm font-medium">
										{pagination.currentPage}
									</div>

									<button
										onClick={() => handleSearch(pagination.currentPage + 1)}
										disabled={pagination.currentPage === pagination.totalPages}
										className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										Next
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					/* EMPTY STATE */
					<div className="py-20 text-center">
						<div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
							<Truck className="w-7 h-7 text-gray-400" />
						</div>

						<p className="text-gray-700 font-medium mt-4">No vehicles found</p>

						<p className="text-sm text-gray-400 mt-1">
							Try changing your search or filters.
						</p>
					</div>
				)}
			</div>

			{/* STATUS CONFIRMATION MODAL */}
			{selectedVehicle && !showDeleteModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => !statusLoading && setSelectedVehicle(null)}
					/>

					<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
						<button
							onClick={() => !statusLoading && setSelectedVehicle(null)}
							disabled={statusLoading}
							className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-40"
						>
							<X className="w-5 h-5" />
						</button>

						<div
							className={`w-12 h-12 rounded-xl flex items-center justify-center ${
								selectedVehicle.active ? "bg-red-50" : "bg-green-50"
							}`}
						>
							{selectedVehicle.active ? (
								<PowerOff className="w-6 h-6 text-red-600" />
							) : (
								<Power className="w-6 h-6 text-green-600" />
							)}
						</div>

						<h2 className="text-lg font-semibold text-gray-900 mt-4">
							{selectedVehicle.active
								? "Deactivate vehicle?"
								: "Activate vehicle?"}
						</h2>

						<p className="text-sm text-gray-500 mt-2 leading-6">
							Are you sure you want to{" "}
							{selectedVehicle.active ? "deactivate" : "activate"}{" "}
							<span className="font-semibold text-gray-700">
								{selectedVehicle.vehicleName}
							</span>
							?
						</p>

						{selectedVehicle.active &&
							selectedVehicle.status === "assigned" && (
								<div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
									This vehicle is currently assigned to a driver. Unassign it
									before deactivating.
								</div>
							)}

						<div className="flex justify-end gap-3 mt-6">
							<button
								onClick={() => setSelectedVehicle(null)}
								disabled={statusLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={handleStatusChange}
								disabled={
									statusLoading ||
									(selectedVehicle.active &&
										selectedVehicle.status === "assigned")
								}
								className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
									selectedVehicle.active
										? "bg-red-600 hover:bg-red-700"
										: "bg-green-600 hover:bg-green-700"
								}`}
							>
								{statusLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
										Updating...
									</>
								) : selectedVehicle.active ? (
									"Deactivate"
								) : (
									"Activate"
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* DELETE CONFIRMATION MODAL */}
			{showDeleteModal && selectedVehicle && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => !deleteLoading && setShowDeleteModal(false)}
					/>

					<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
						<button
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
								{selectedVehicle.vehicleName}
							</span>
							? This action cannot be undone.
						</p>

						<div className="flex justify-end gap-3 mt-6">
							<button
								onClick={() => {
									setShowDeleteModal(false);
									setSelectedVehicle(null);
								}}
								disabled={deleteLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={handleDeleteVehicle}
								disabled={deleteLoading}
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50"
							>
								{deleteLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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

export default Vehicles;
