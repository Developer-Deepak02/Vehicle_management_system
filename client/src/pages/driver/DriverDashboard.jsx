import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
	User,
	ShieldCheck,
	Truck,
	Calendar,
	Mail,
	MapPin,
	BriefcaseBusiness,
	ArrowRight,
	AlertCircle,
} from "lucide-react";
import { getCurrentUser } from "../../services/userService";
import { getMyVehicle } from "../../services/vehicleService";

const DriverDashboard = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [vehicle, setVehicle] = useState(null);
	const [loading, setLoading] = useState(true);

	const loadDashboard = async () => {
		try {
			setLoading(true);
			const [userData, vehicleData] = await Promise.all([
				getCurrentUser(),
				getMyVehicle(),
			]);
			setUser(userData);
			setVehicle(vehicleData);
		} catch (error) {
			console.error("Driver dashboard error:", error);
			if (error.response?.status === 404) {
				try {
					const userData = await getCurrentUser();
					setUser(userData);
					setVehicle(null);
				} catch (userError) {
					console.error("Get driver information error:", userError);
					toast.error("Failed to load dashboard");
				}
			} else {
				toast.error(
					error.response?.data?.message || "Failed to load dashboard",
				);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadDashboard();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
					<p className="text-gray-600 mt-3">
						Unable to load driver information.
					</p>
				</div>
			</div>
		);
	}

	const licenseVerified = user.licenseVerified === true;

	const licenseRejected =
		user.licenseVerified === false && Boolean(user.licenseRejectionReason);

	const licensePending =
		user.licenseVerified === false &&
		!user.licenseRejectionReason &&
		Boolean(user.drivingLicense);

	const licenseExpiry = user.licenseExpiry
		? new Date(user.licenseExpiry)
		: null;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const daysUntilExpiry = licenseExpiry
		? Math.ceil((licenseExpiry - today) / (1000 * 60 * 60 * 24))
		: null;

	const licenseExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

	const licenseExpiringSoon =
		daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

	return (
		<div className="space-y-6">
			{/* PAGE HEADER */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
				<p className="text-sm text-gray-500 mt-1">Welcome back, {user.name}</p>
			</div>

			{/* LICENSE EXPIRY ALERT */}
			{licenseExpired && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
					<div>
						<p className="text-sm font-semibold text-red-800">
							Driving License Expired
						</p>
						<p className="text-sm text-red-700 mt-1">
							Your driving license expired on{" "}
							{licenseExpiry.toLocaleDateString()}. Please update your license
							immediately.
						</p>
					</div>
				</div>
			)}

			{licenseExpiringSoon && (
				<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
					<div>
						<p className="text-sm font-semibold text-amber-800">
							Driving License Expiring Soon
						</p>
						<p className="text-sm text-amber-700 mt-1">
							Your driving license expires in {daysUntilExpiry}{" "}
							{daysUntilExpiry === 1 ? "day" : "days"} on{" "}
							{licenseExpiry.toLocaleDateString()}.
						</p>
					</div>
				</div>
			)}

			{/* LICENSE VERIFICATION ALERTS */}
			{!licenseVerified && user.licenseRejectionReason && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
					<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-sm font-semibold text-red-800">
							Driving License Rejected
						</p>
						<p className="text-sm text-red-700 mt-1">
							Your driving license verification was rejected.
						</p>
						<div className="mt-2 bg-white/60 border border-red-100 rounded-lg p-3">
							<p className="text-xs font-medium text-red-800">Reason</p>
							<p className="text-sm text-red-700 mt-1">
								{user.licenseRejectionReason}
							</p>
						</div>
						<button
							onClick={() => navigate("/profile")}
							className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-red-700 hover:text-red-800"
						>
							Update License
							<ArrowRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			)}

			{!licenseVerified &&
				!user.licenseRejectionReason &&
				!user.drivingLicense && (
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
						<div className="flex-1">
							<p className="text-sm font-semibold text-amber-800">
								Driving License Not Submitted
							</p>
							<p className="text-sm text-amber-700 mt-1">
								Please submit your driving license to complete driver
								verification.
							</p>
							<button
								onClick={() => navigate("/profile")}
								className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-amber-700 hover:text-amber-800"
							>
								Submit License
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}

			{!licenseVerified &&
				!user.licenseRejectionReason &&
				!!user.drivingLicense && (
					<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-semibold text-amber-800">
								Driving License Verification Pending
							</p>
							<p className="text-sm text-amber-700 mt-1">
								Your driving license has been submitted and is waiting for
								verification by an administrator or manager.
							</p>
						</div>
					</div>
				)}

			{/* VEHICLE STATUS ALERT */}
			{vehicle && vehicle.active === false && (
				<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
					<AlertCircle className="text-red-600 mt-0.5" size={22} />
					<div>
						<h3 className="font-semibold text-red-800">
							Assigned Vehicle is Inactive
						</h3>
						<p className="text-sm text-red-700 mt-1">
							Your assigned vehicle is currently inactive. Please contact the
							administrator or manager before using the vehicle.
						</p>
						<button
							onClick={() => navigate("/driver/my-vehicle")}
							className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900"
						>
							View Vehicle Details
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
			)}

			{/* SUMMARY CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{/* ACCOUNT */}
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Account Status</p>
							<p className="text-lg font-semibold text-gray-900 mt-1">Active</p>
						</div>
						<div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
							<ShieldCheck className="w-5 h-5 text-green-600" />
						</div>
					</div>

					<div className="mt-4">
						<span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
							{user.isVerified ? "Verified" : "Not Verified"}
						</span>
					</div>
				</div>

				{/* LICENSE */}
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">License Status</p>
							<p
								className={`text-lg font-semibold mt-1 ${
									licenseVerified
										? "text-green-600"
										: licenseRejected
											? "text-red-600"
											: licensePending
												? "text-amber-600"
												: "text-gray-600"
								}`}
							>
								{licenseVerified
									? "Verified"
									: licenseRejected
										? "Rejected"
										: licensePending
											? "Pending"
											: "Not Submitted"}
							</p>
						</div>

						<div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
							<ShieldCheck className="w-5 h-5 text-violet-600" />
						</div>
					</div>

					<div className="mt-4">
						<span
							className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
								licenseVerified
									? "bg-green-50 text-green-700"
									: licenseRejected
										? "bg-red-50 text-red-700"
										: licensePending
											? "bg-amber-50 text-amber-700"
											: "bg-gray-100 text-gray-600"
							}`}
						>
							{licenseVerified
								? "License Verified"
								: licenseRejected
									? "License Rejected"
									: licensePending
										? "Verification Pending"
										: "License Not Submitted"}
						</span>
					</div>
				</div>

				{/* VEHICLE */}
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-500">Vehicle</p>
							<p className="text-lg font-semibold text-gray-900 mt-1">
								{vehicle ? vehicle.vehicleName : "Not Assigned"}
							</p>
						</div>
						<div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
							<Truck className="w-5 h-5 text-blue-600" />
						</div>
					</div>

					<div className="mt-4">
						<span
							className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
								vehicle
									? "bg-green-50 text-green-700"
									: "bg-amber-50 text-amber-700"
							}`}
						>
							{vehicle ? "Assigned" : "Not Assigned"}
						</span>
					</div>
				</div>
			</div>

			{/* MY VEHICLE */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
				<div className="p-6 border-b border-gray-100 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
							<Truck className="w-5 h-5 text-violet-700" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-900">
								My Vehicle
							</h2>
							<p className="text-sm text-gray-500">
								Vehicle currently assigned to you.
							</p>
						</div>
					</div>

					{vehicle && (
						<button
							onClick={() => navigate("/driver/my-vehicle")}
							className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
						>
							View Details
							<ArrowRight className="w-4 h-4" />
						</button>
					)}
				</div>

				{vehicle ? (
					<div className="p-6">
						<div className="flex flex-col md:flex-row gap-6">
							{/* VEHICLE IMAGE */}
							<div className="w-full md:w-64 h-40 rounded-xl overflow-hidden bg-gray-100 shrink-0">
								{vehicle.vehiclePhotos?.length > 0 ? (
									<img
										src={vehicle.vehiclePhotos[0]}
										alt={vehicle.vehicleName}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<Truck className="w-10 h-10 text-gray-300" />
									</div>
								)}
							</div>

							{/* VEHICLE DETAILS */}
							<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div>
									<p className="text-xs text-gray-500">Vehicle</p>
									<p className="text-sm font-medium text-gray-900 mt-1">
										{vehicle.vehicleName}
									</p>
								</div>

								<div>
									<p className="text-xs text-gray-500">Model / Year</p>
									<p className="text-sm font-medium text-gray-900 mt-1">
										{vehicle.vehicleModel} • {vehicle.vehicleYear}
									</p>
								</div>

								<div>
									<p className="text-xs text-gray-500">Registration Number</p>
									<p className="text-sm font-medium text-gray-900 mt-1">
										{vehicle.registrationNumber}
									</p>
								</div>

								<div>
									<p className="text-xs text-gray-500">Vehicle Type</p>
									<p className="text-sm font-medium text-gray-900 mt-1">
										{vehicle.vehicleType}
									</p>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="p-8 text-center">
						<AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
						<p className="text-sm font-medium text-gray-900 mt-3">
							No vehicle assigned
						</p>
						<p className="text-sm text-gray-500 mt-1">
							Contact your manager or administrator for vehicle assignment.
						</p>
					</div>
				)}
			</div>

			{/* DRIVER INFORMATION */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
				<div className="p-6 border-b border-gray-100 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
							<User className="w-5 h-5 text-violet-700" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-gray-900">
								Driver Information
							</h2>
							<p className="text-sm text-gray-500">
								Your personal and driving information.
							</p>
						</div>
					</div>

					<button
						onClick={() => navigate("/profile")}
						className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
					>
						View Profile
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>

				<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
					<div className="flex items-start gap-3">
						<User className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Full Name</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{user.name}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Mail className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Email</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{user.email}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<BriefcaseBusiness className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Experience</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{user.experience ?? 0} years
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Driving License</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{user.drivingLicense || "Not submitted"}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">License Expiry</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{licenseExpiry
									? licenseExpiry.toLocaleDateString()
									: "Not available"}
							</p>
							{licenseExpiry && (
								<p
									className={`text-xs font-medium mt-1 ${
										licenseExpired
											? "text-red-600"
											: licenseExpiringSoon
												? "text-amber-600"
												: "text-green-600"
									}`}
								>
									{licenseExpired
										? "Expired"
										: licenseExpiringSoon
											? `Expires in ${daysUntilExpiry} ${
													daysUntilExpiry === 1 ? "day" : "days"
												}`
											: "Valid"}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-start gap-3">
						<MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
						<div>
							<p className="text-xs text-gray-500">Address</p>
							<p className="text-sm font-medium text-gray-900 mt-1">
								{user.driverAddress || "Not available"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DriverDashboard;
