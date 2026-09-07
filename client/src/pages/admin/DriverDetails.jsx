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
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDriver, verifyDriverLicense } from "../../services/userService";

const DriverDetails = () => {
	const { id } = useParams();
	const [driver, setDriver] = useState(null);
	const [loading, setLoading] = useState(true);
  const [verificationLoading, setVerificationLoading] = useState(false);
	const [showRejectForm, setShowRejectForm] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");

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
					to="/admin/drivers"
					className="text-sm text-violet-600 hover:text-violet-700"
				>
					Back to Drivers
				</Link>
			</div>
		);
	}

  const licenseRejected = Boolean(driver.licenseRejectionReason);
	const licenseVerified = driver.licenseVerified === true && !licenseRejected;
	const vehicle = driver.vehicleAssigned;

	return (
		<div className="max-w-6xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<Link
					to="/admin/drivers"
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
						to={`/admin/drivers/${driver._id}/edit`}
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
									<span className="text-gray-500">Make</span>
									<span className="font-medium text-gray-900">
										{vehicle.make || "—"}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Model</span>
									<span className="font-medium text-gray-900">
										{vehicle.model || "—"}
									</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Assigned On</span>
									<span className="font-medium text-gray-900">
										{formatDate(driver.vehicleAssignedOn)}
									</span>
								</div>
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DriverDetails;
