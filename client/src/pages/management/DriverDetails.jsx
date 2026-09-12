import { useEffect, useState } from "react";
import {
	ArrowLeft,
	UserRound,
	Mail,
	CalendarDays,
	MapPin,
	Car,
	ShieldCheck,
	ShieldAlert,
	IdCard,
	Clock,
	Check,
	X,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDriver, verifyDriverLicense } from "../../services/userService";
import {
	getAvailableVehicles,
	assignVehicle,
	unassignVehicle,
} from "../../services/vehicleService";

const DriverDetails = () => {
	const { id } = useParams();
	const location = useLocation();

	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/drivers" : "/admin/drivers";

	const [driver, setDriver] = useState(null);
	const [loading, setLoading] = useState(true);
	const [verificationLoading, setVerificationLoading] = useState(false);
	const [showRejectForm, setShowRejectForm] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const [availableVehicles, setAvailableVehicles] = useState([]);
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [selectedVehicle, setSelectedVehicle] = useState("");
	const [assignmentLoading, setAssignmentLoading] = useState(false);
	const [unassignLoading, setUnassignLoading] = useState(false);
	const [showUnassignModal, setShowUnassignModal] = useState(false);
	const [changeVehicleMode, setChangeVehicleMode] = useState(false);

	useEffect(() => {
		const loadDriver = async () => {
			try {
				setLoading(true);

				const data = await getDriver(id);
				setDriver(data);
			} catch (error) {
				toast.error(error.response?.data?.message || "Failed to load driver");
			} finally {
				setLoading(false);
			}
		};

		loadDriver();
	}, [id]);

	const formatDate = (date) => {
		if (!date) return "—";

		return new Date(date).toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const handleLicenseVerification = async (verified) => {
		if (!driver) return;

		if (!verified && !rejectionReason.trim()) {
			toast.error("Rejection reason is required");
			return;
		}

		try {
			setVerificationLoading(true);

			await verifyDriverLicense(driver._id, {
				verified,
				...(verified
					? {}
					: {
							rejectionReason: rejectionReason.trim(),
						}),
			});

			toast.success(
				verified
					? "Driver license verified successfully"
					: "Driver license rejected",
			);

			const updatedDriver = await getDriver(id);
			setDriver(updatedDriver);

			setShowRejectForm(false);
			setRejectionReason("");
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to update license status",
			);
		} finally {
			setVerificationLoading(false);
		}
	};

	const loadAvailableVehicles = async () => {
		try {
			const data = await getAvailableVehicles();
			setAvailableVehicles(data || []);
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to load available vehicles",
			);
		}
	};

	const handleOpenAssignModal = async () => {
		await loadAvailableVehicles();
		setSelectedVehicle("");
		setChangeVehicleMode(Boolean(driver?.vehicleAssigned));
		setShowAssignModal(true);
	};

	const handleCloseAssignModal = () => {
		if (assignmentLoading) return;

		setShowAssignModal(false);
		setSelectedVehicle("");
		setChangeVehicleMode(false);
	};

	const handleAssignVehicle = async () => {
		if (!selectedVehicle) {
			toast.error("Please select a vehicle");
			return;
		}

		try {
			setAssignmentLoading(true);

			if (changeVehicleMode && driver.vehicleAssigned) {
				await unassignVehicle(driver.vehicleAssigned._id);
			}

			await assignVehicle(selectedVehicle, driver._id);

			toast.success(
				changeVehicleMode
					? "Vehicle changed successfully"
					: "Vehicle assigned successfully",
			);

			const updatedDriver = await getDriver(id);
			setDriver(updatedDriver);

			setShowAssignModal(false);
			setSelectedVehicle("");
			setChangeVehicleMode(false);
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					(changeVehicleMode
						? "Failed to change vehicle"
						: "Failed to assign vehicle"),
			);

			const updatedDriver = await getDriver(id).catch(() => null);

			if (updatedDriver) {
				setDriver(updatedDriver);
			}
		} finally {
			setAssignmentLoading(false);
		}
	};

	const handleUnassignVehicle = async () => {
		if (!driver?.vehicleAssigned) return;

		try {
			setUnassignLoading(true);

			await unassignVehicle(driver.vehicleAssigned._id);

			toast.success("Vehicle unassigned successfully");

			const updatedDriver = await getDriver(id);
			setDriver(updatedDriver);

			setShowUnassignModal(false);
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to unassign vehicle",
			);
		} finally {
			setUnassignLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-sm text-gray-500">Loading driver...</p>
			</div>
		);
	}

	if (!driver) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<p className="text-gray-500 mb-4">Driver not found.</p>

				<Link
					to={basePath}
					className="text-sm text-violet-600 hover:text-violet-700"
				>
					Back to Drivers
				</Link>
			</div>
		);
	}

	const licenseVerified = driver.licenseVerified === true;
	const licenseRejected =
		driver.licenseVerified === false && Boolean(driver.licenseRejectionReason);
	const vehicle = driver.vehicleAssigned;

	return (
		<div className="max-w-6xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<Link
					to={basePath}
					className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
				>
					<ArrowLeft className="size-4" />
					Back to Drivers
				</Link>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="size-16 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden">
							{driver.profilePicture ? (
								<img
									src={driver.profilePicture}
									alt={driver.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<UserRound className="size-7 text-violet-700" />
							)}
						</div>

						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{driver.name}
							</h1>

							<div className="flex items-center gap-2 mt-1">
								<span className="text-sm text-gray-500">Driver</span>

								<span
									className={`px-2.5 py-1 rounded-full text-xs font-medium ${
										driver.active
											? "bg-green-100 text-green-700"
											: "bg-gray-100 text-gray-600"
									}`}
								>
									{driver.active ? "Active" : "Inactive"}
								</span>
							</div>
						</div>
					</div>

					<Link
						to={`${basePath}/${driver._id}/edit`}
						className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
					>
						Edit Driver
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
				{/* Personal Information */}
				<div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-5">
						Personal Information
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						<div className="flex items-start gap-3">
							<Mail className="size-5 text-gray-400 mt-0.5" />

							<div>
								<p className="text-xs text-gray-500">Email</p>
								<p className="text-sm font-medium text-gray-900 mt-1">
									{driver.email}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<CalendarDays className="size-5 text-gray-400 mt-0.5" />

							<div>
								<p className="text-xs text-gray-500">Date of Birth</p>
								<p className="text-sm font-medium text-gray-900 mt-1">
									{formatDate(driver.dateOfBirth)}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<MapPin className="size-5 text-gray-400 mt-0.5" />

							<div>
								<p className="text-xs text-gray-500">Address</p>
								<p className="text-sm font-medium text-gray-900 mt-1">
									{driver.driverAddress || "—"}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<Clock className="size-5 text-gray-400 mt-0.5" />

							<div>
								<p className="text-xs text-gray-500">Experience</p>
								<p className="text-sm font-medium text-gray-900 mt-1">
									{driver.experience !== undefined && driver.experience !== null
										? `${driver.experience} years`
										: "—"}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Account Information */}
				<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-5">Account</h2>

					<div className="space-y-4">
						<div>
							<p className="text-xs text-gray-500">Account Status</p>

							<span
								className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${
									driver.active
										? "bg-green-100 text-green-700"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								{driver.active ? "Active" : "Inactive"}
							</span>
						</div>

						<div>
							<p className="text-xs text-gray-500">Email Verification</p>

							<div className="flex items-center gap-2 mt-1">
								{driver.isVerified ? (
									<>
										<ShieldCheck className="size-4 text-green-600" />
										<span className="text-sm font-medium text-green-700">
											Verified
										</span>
									</>
								) : (
									<>
										<ShieldAlert className="size-4 text-yellow-600" />
										<span className="text-sm font-medium text-yellow-700">
											Not Verified
										</span>
									</>
								)}
							</div>
						</div>

						<div>
							<p className="text-xs text-gray-500">Joined On</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{formatDate(driver.joinedOn)}
							</p>
						</div>
					</div>
				</div>

				{/* Driving License */}
				<div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-lg font-semibold text-gray-900">
							Driving License
						</h2>

						<span
							className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
								licenseRejected
									? "bg-red-100 text-red-700"
									: licenseVerified
										? "bg-green-100 text-green-700"
										: "bg-yellow-100 text-yellow-700"
							}`}
						>
							{licenseRejected ? (
								<>
									<ShieldAlert className="size-3.5" />
									Rejected
								</>
							) : licenseVerified ? (
								<>
									<ShieldCheck className="size-3.5" />
									Verified
								</>
							) : (
								<>
									<ShieldAlert className="size-3.5" />
									Pending
								</>
							)}
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
						<div className="flex items-start gap-3">
							<IdCard className="size-5 text-gray-400 mt-0.5" />

							<div>
								<p className="text-xs text-gray-500">License Number</p>

								<p className="text-sm font-medium text-gray-900 mt-1">
									{driver.drivingLicense || "—"}
								</p>
							</div>
						</div>

						<div>
							<p className="text-xs text-gray-500">License Expiry</p>

							<p className="text-sm font-medium text-gray-900 mt-1">
								{formatDate(driver.licenseExpiry)}
							</p>
						</div>
					</div>

					{driver.drivingLicensePicture ? (
						<div>
							<p className="text-xs text-gray-500 mb-2">License Document</p>

							<a
								href={driver.drivingLicensePicture}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block"
							>
								<img
									src={driver.drivingLicensePicture}
									alt="Driving license"
									className="max-w-sm max-h-64 rounded-lg border border-gray-200 object-contain hover:opacity-90"
								/>
							</a>
						</div>
					) : (
						<div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-500">
							No driving license document uploaded.
						</div>
					)}

					{driver.licenseRejectionReason && (
						<div className="mt-4 rounded-lg bg-red-50 border border-red-100 p-4">
							<p className="text-xs font-medium text-red-700">
								Rejection Reason
							</p>

							<p className="text-sm text-red-600 mt-1">
								{driver.licenseRejectionReason}
							</p>
						</div>
					)}

					{/* License Verification Actions */}
					{driver.drivingLicensePicture &&
						!licenseVerified &&
						!licenseRejected && (
							<div className="mt-5 pt-5 border-t border-gray-200">
								<p className="text-sm font-medium text-gray-900 mb-3">
									License Verification
								</p>

								<div className="flex flex-wrap gap-3">
									<button
										onClick={() => handleLicenseVerification(true)}
										disabled={verificationLoading}
										className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Check className="size-4" />
										{verificationLoading ? "Processing..." : "Approve License"}
									</button>

									<button
										onClick={() => setShowRejectForm(true)}
										disabled={verificationLoading}
										className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<X className="size-4" />
										Reject License
									</button>
								</div>
							</div>
						)}

					{showRejectForm && (
						<div className="mt-5 pt-5 border-t border-gray-200">
							<p className="text-sm font-medium text-gray-900 mb-3">
								Rejection Reason
							</p>

							<textarea
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								placeholder="Enter the reason for rejecting this license..."
								rows="3"
								className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none resize-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
							/>

							<div className="flex justify-end gap-3 mt-3">
								<button
									onClick={() => {
										setShowRejectForm(false);
										setRejectionReason("");
									}}
									disabled={verificationLoading}
									className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
								>
									Cancel
								</button>

								<button
									onClick={() => handleLicenseVerification(false)}
									disabled={verificationLoading}
									className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<X className="size-4" />
									{verificationLoading ? "Rejecting..." : "Confirm Rejection"}
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Assigned Vehicle */}
				<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-5">
						Assigned Vehicle
					</h2>

					{vehicle ? (
						<div>
							<div className="size-11 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
								<Car className="size-5 text-violet-700" />
							</div>

							<p className="font-semibold text-gray-900">
								{vehicle.registrationNumber || "Vehicle"}
							</p>

							<p className="text-sm text-gray-500 mt-1">
								{vehicle.vehicleType || "—"}
							</p>

							<div className="mt-4 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Vehicle Name</span>

									<span className="font-medium text-gray-900">
										{vehicle.vehicleName || "—"}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Model</span>

									<span className="font-medium text-gray-900">
										{vehicle.vehicleModel || "—"}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Year</span>

									<span className="font-medium text-gray-900">
										{vehicle.vehicleYear || "—"}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Assigned On</span>

									<span className="font-medium text-gray-900">
										{formatDate(driver.vehicleAssignedOn)}
									</span>
								</div>
							</div>

							<div className="flex gap-2 mt-5 pt-5 border-t border-gray-200">
								<button
									onClick={handleOpenAssignModal}
									className="flex-1 px-3 py-2 rounded-lg border border-violet-200 text-violet-700 text-sm font-medium hover:bg-violet-50"
								>
									Change Vehicle
								</button>

								<button
									onClick={() => setShowUnassignModal(true)}
									disabled={unassignLoading}
									className="flex-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
								>
									Unassign
								</button>
							</div>
						</div>
					) : (
						<div className="text-center py-6">
							<div className="size-11 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
								<Car className="size-5 text-gray-400" />
							</div>

							<p className="text-sm font-medium text-gray-700">
								No vehicle assigned
							</p>

							<p className="text-xs text-gray-500 mt-1">
								This driver currently has no vehicle.
							</p>

							<button
								onClick={handleOpenAssignModal}
								className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
							>
								Assign Vehicle
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Assign / Change Vehicle Modal */}
			{showAssignModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="w-full max-w-md bg-white rounded-xl shadow-xl">
						<div className="flex items-center justify-between p-5 border-b border-gray-200">
							<div>
								<h2 className="text-lg font-semibold text-gray-900">
									{changeVehicleMode ? "Change Vehicle" : "Assign Vehicle"}
								</h2>

								<p className="text-sm text-gray-500 mt-1">
									Select an available vehicle for {driver.name}.
								</p>
							</div>

							<button
								onClick={handleCloseAssignModal}
								disabled={assignmentLoading}
								className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
							>
								<X className="size-5" />
							</button>
						</div>

						<div className="p-5">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Select Vehicle
							</label>

							{availableVehicles.length > 0 ? (
								<select
									value={selectedVehicle}
									onChange={(e) => setSelectedVehicle(e.target.value)}
									disabled={assignmentLoading}
									className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-gray-100"
								>
									<option value="">Select a vehicle</option>

									{availableVehicles.map((item) => (
										<option key={item._id} value={item._id}>
											{item.registrationNumber} - {item.vehicleName}{" "}
											{item.vehicleModel ? `(${item.vehicleModel})` : ""}
										</option>
									))}
								</select>
							) : (
								<div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
									<p className="text-sm text-gray-500">
										No available vehicles found.
									</p>
								</div>
							)}

							{selectedVehicle && (
								<div className="mt-4 rounded-lg bg-violet-50 border border-violet-100 p-4">
									<p className="text-xs font-medium text-violet-700 mb-2">
										Selected Vehicle
									</p>

									{(() => {
										const selected = availableVehicles.find(
											(item) => item._id === selectedVehicle,
										);

										if (!selected) return null;

										return (
											<div className="space-y-1">
												<p className="text-sm font-semibold text-gray-900">
													{selected.vehicleName || "Vehicle"}
												</p>

												<p className="text-sm text-gray-600">
													Registration: {selected.registrationNumber || "—"}
												</p>

												<p className="text-sm text-gray-600">
													Model: {selected.vehicleModel || "—"}
												</p>

												<p className="text-sm text-gray-600">
													Type: {selected.vehicleType || "—"}
												</p>

												<p className="text-sm text-gray-600">
													Year: {selected.vehicleYear || "—"}
												</p>
											</div>
										);
									})()}
								</div>
							)}
						</div>

						<div className="flex justify-end gap-3 p-5 border-t border-gray-200">
							<button
								onClick={handleCloseAssignModal}
								disabled={assignmentLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={handleAssignVehicle}
								disabled={
									assignmentLoading ||
									!selectedVehicle ||
									availableVehicles.length === 0
								}
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Car className="size-4" />

								{assignmentLoading
									? changeVehicleMode
										? "Changing..."
										: "Assigning..."
									: changeVehicleMode
										? "Change Vehicle"
										: "Assign Vehicle"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Unassign Vehicle Confirmation Modal */}
			{showUnassignModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="w-full max-w-md bg-white rounded-xl shadow-xl">
						<div className="p-5">
							<div className="size-11 rounded-full bg-red-100 flex items-center justify-center mb-4">
								<ShieldAlert className="size-5 text-red-600" />
							</div>

							<h2 className="text-lg font-semibold text-gray-900">
								Unassign Vehicle?
							</h2>

							<p className="text-sm text-gray-500 mt-2">
								Are you sure you want to unassign{" "}
								<span className="font-medium text-gray-700">
									{vehicle?.registrationNumber || "this vehicle"}
								</span>{" "}
								from {driver.name}?
							</p>
						</div>

						<div className="flex justify-end gap-3 p-5 border-t border-gray-200">
							<button
								onClick={() => setShowUnassignModal(false)}
								disabled={unassignLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={handleUnassignVehicle}
								disabled={unassignLoading}
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<X className="size-4" />
								{unassignLoading ? "Unassigning..." : "Unassign Vehicle"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DriverDetails;
