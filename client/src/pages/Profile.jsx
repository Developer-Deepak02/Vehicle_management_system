import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	UserRound,
	Mail,
	Calendar,
	ShieldCheck,
	ShieldX,
	Phone,
	MapPin,
	BriefcaseBusiness,
	Truck,
	Camera,
	Save,
	X,
} from "lucide-react";
import {
	getCurrentUser,
	updateCurrentUser,
	updateProfilePicture,
} from "../services/userService";

const Profile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploadingPicture, setUploadingPicture] = useState(false);
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		dateOfBirth: "",
		drivingLicense: "",
		licenseExpiry: "",
		driverAddress: "",
		experience: "",
	});

	// Get current user
	const loadProfile = async () => {
		try {
			setLoading(true);
			const data = await getCurrentUser();
			console.log("Current user:", data);
			setUser(data);
			setFormData({
				name: data.name || "",
				dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
				drivingLicense: data.drivingLicense || "",
				licenseExpiry: data.licenseExpiry
					? data.licenseExpiry.split("T")[0]
					: "",
				driverAddress: data.driverAddress || "",
				experience: data.experience ?? "",
			});
		} catch (error) {
			console.error("Get profile error:", error);
			const message = error.response?.data?.message || "Failed to load profile";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	// Initial load
	useEffect(() => {
		loadProfile();
	}, []);

	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Update profile
	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			const data = {
				name: formData.name,
				dateOfBirth: formData.dateOfBirth || null,
			};
			if (user.role === "driver") {
				data.drivingLicense = formData.drivingLicense;
				data.licenseExpiry = formData.licenseExpiry || null;
				data.driverAddress = formData.driverAddress;
				data.experience = formData.experience;
			}
			const response = await updateCurrentUser(data);
			setUser((prev) => ({
				...prev,
				...response,
			}));
			setEditing(false);
			toast.success(response.message || "Profile updated successfully");
		} catch (error) {
			console.error("Update profile error:", error);
			const message =
				error.response?.data?.message || "Failed to update profile";
			toast.error(message);
		} finally {
			setSaving(false);
		}
	};

	// Update profile picture
	const handleProfilePicture = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}
		try {
			setUploadingPicture(true);
			const imageData = new FormData();
			imageData.append("profilePicture", file);
			const response = await updateProfilePicture(imageData);
			setUser((prev) => ({
				...prev,
				profilePicture: response.profilePicture,
			}));
			toast.success(response.message || "Profile picture updated successfully");
		} catch (error) {
			console.error("Profile picture error:", error);
			const message =
				error.response?.data?.message || "Failed to update profile picture";
			toast.error(message);
		} finally {
			setUploadingPicture(false);
			e.target.value = "";
		}
	};

	// Cancel editing
	const handleCancelEdit = () => {
		setFormData({
			name: user.name || "",
			dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
			drivingLicense: user.drivingLicense || "",
			licenseExpiry: user.licenseExpiry ? user.licenseExpiry.split("T")[0] : "",
			driverAddress: user.driverAddress || "",
			experience: user.experience ?? "",
		});
		setEditing(false);
	};

	// Loading
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading profile...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<p className="text-sm text-gray-500">Unable to load profile.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* PAGE HEADER */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Profile</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage your personal information and account details.
					</p>
				</div>
				{!editing ? (
					<button
						onClick={() => setEditing(true)}
						className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
					>
						<UserRound className="w-4 h-4" />
						Edit Profile
					</button>
				) : (
					<div className="flex items-center gap-2">
						<button
							onClick={handleCancelEdit}
							disabled={saving}
							className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
						>
							<X className="w-4 h-4" />
							Cancel
						</button>
						<button
							onClick={handleUpdateProfile}
							disabled={saving}
							className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
						>
							{saving ? (
								<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				)}
			</div>

			{/* PROFILE HEADER */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
				<div className="h-28 bg-gradient-to-r from-violet-950 to-violet-700" />
				<div className="px-6 pb-6">
					<div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
						<div className="relative">
							<div className="w-24 h-24 rounded-2xl bg-violet-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
								{user.profilePicture ? (
									<img
										src={user.profilePicture}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								) : (
									<UserRound className="w-10 h-10 text-violet-600" />
								)}
							</div>
							<label
								className={`absolute bottom-1 right-1 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center border-2 border-white ${
									uploadingPicture
										? "opacity-50 cursor-not-allowed"
										: "cursor-pointer hover:bg-violet-700"
								}`}
							>
								{uploadingPicture ? (
									<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
								) : (
									<Camera className="w-4 h-4" />
								)}
								<input
									type="file"
									accept="image/*"
									onChange={handleProfilePicture}
									disabled={uploadingPicture}
									className="hidden"
								/>
							</label>
						</div>
						<div className="pb-1">
							<h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
							<p className="text-sm text-gray-500 capitalize">{user.role}</p>
						</div>
					</div>
				</div>
			</div>

			{/* PERSONAL INFORMATION */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
						<UserRound className="w-4 h-4 text-violet-600" />
					</div>
					<div>
						<h2 className="text-base font-semibold text-gray-900">
							Personal Information
						</h2>
						<p className="text-xs text-gray-500">
							Your basic account information.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Full Name
						</label>
						{editing ? (
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						) : (
							<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
								<UserRound className="w-4 h-4 text-gray-400" />
								<span className="text-sm text-gray-700">{user.name}</span>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Email
						</label>
						<div className="flex items-center gap-3 h-11 px-3 bg-gray-100 rounded-lg">
							<Mail className="w-4 h-4 text-gray-400" />
							<span className="text-sm text-gray-600">{user.email}</span>
						</div>
						<p className="text-xs text-gray-400 mt-1">
							Email cannot be changed.
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Date of Birth
						</label>
						{editing ? (
							<input
								type="date"
								name="dateOfBirth"
								value={formData.dateOfBirth}
								onChange={handleChange}
								className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						) : (
							<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
								<Calendar className="w-4 h-4 text-gray-400" />
								<span className="text-sm text-gray-700">
									{user.dateOfBirth
										? new Date(user.dateOfBirth).toLocaleDateString()
										: "Not provided"}
								</span>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Role
						</label>
						<div className="flex items-center gap-3 h-11 px-3 bg-gray-100 rounded-lg">
							<ShieldCheck className="w-4 h-4 text-violet-600" />
							<span className="text-sm text-gray-700 capitalize">
								{user.role}
							</span>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Account Verification
						</label>
						<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
							{user.isVerified ? (
								<>
									<ShieldCheck className="w-4 h-4 text-green-600" />
									<span className="text-sm font-medium text-green-600">
										Verified
									</span>
								</>
							) : (
								<>
									<ShieldX className="w-4 h-4 text-red-500" />
									<span className="text-sm font-medium text-red-500">
										Not Verified
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* DRIVER INFORMATION */}
			{user.role === "driver" && (
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
							<Truck className="w-4 h-4 text-violet-600" />
						</div>
						<div>
							<h2 className="text-base font-semibold text-gray-900">
								Driver Information
							</h2>
							<p className="text-xs text-gray-500">
								Your driving and professional information.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Driving License
							</label>
							{editing ? (
								<input
									type="text"
									name="drivingLicense"
									value={formData.drivingLicense}
									onChange={handleChange}
									className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
								/>
							) : (
								<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
									<BriefcaseBusiness className="w-4 h-4 text-gray-400" />
									<span className="text-sm text-gray-700">
										{user.drivingLicense || "Not provided"}
									</span>
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								License Expiry
							</label>
							{editing ? (
								<input
									type="date"
									name="licenseExpiry"
									value={formData.licenseExpiry}
									onChange={handleChange}
									className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
								/>
							) : (
								<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
									<Calendar className="w-4 h-4 text-gray-400" />
									<span className="text-sm text-gray-700">
										{user.licenseExpiry
											? new Date(user.licenseExpiry).toLocaleDateString()
											: "Not provided"}
									</span>
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Experience
							</label>
							{editing ? (
								<input
									type="number"
									min="0"
									name="experience"
									value={formData.experience}
									onChange={handleChange}
									className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
								/>
							) : (
								<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
									<BriefcaseBusiness className="w-4 h-4 text-gray-400" />
									<span className="text-sm text-gray-700">
										{user.experience !== undefined &&
										user.experience !== null &&
										user.experience !== ""
											? `${user.experience} years`
											: "Not provided"}
									</span>
								</div>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								License Status
							</label>
							<div className="flex items-center gap-3 h-11 px-3 bg-gray-50 rounded-lg">
								{user.licenseVerified ? (
									<>
										<ShieldCheck className="w-4 h-4 text-green-600" />
										<span className="text-sm font-medium text-green-600">
											Verified
										</span>
									</>
								) : (
									<>
										<ShieldX className="w-4 h-4 text-amber-500" />
										<span className="text-sm font-medium text-amber-600">
											Pending Verification
										</span>
									</>
								)}
							</div>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Address
							</label>
							{editing ? (
								<textarea
									name="driverAddress"
									value={formData.driverAddress}
									onChange={handleChange}
									rows="3"
									className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm outline-none resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
								/>
							) : (
								<div className="flex items-start gap-3 px-3 py-3 bg-gray-50 rounded-lg">
									<MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
									<span className="text-sm text-gray-700">
										{user.driverAddress || "Not provided"}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
