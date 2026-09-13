import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Truck, Loader2, ImagePlus, X } from "lucide-react";
import { getVehicle, updateVehicle } from "../../services/vehicleService";

const EditVehicle = () => {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/vehicles" : "/admin/vehicles";
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [vehicleName, setVehicleName] = useState("");
	const [vehicleModel, setVehicleModel] = useState("");
	const [vehicleYear, setVehicleYear] = useState("");
	const [vehicleType, setVehicleType] = useState("");
	const [registrationNumber, setRegistrationNumber] = useState("");
	const [chassisNumber, setChassisNumber] = useState("");
	const [vehicleDescription, setVehicleDescription] = useState("");
	const [existingPhotos, setExistingPhotos] = useState([]);
	const [newPhotos, setNewPhotos] = useState([]);

	useEffect(() => {
		const fetchVehicle = async () => {
			try {
				setLoading(true);
				const data = await getVehicle(id);
				setVehicleName(data.vehicleName || "");
				setVehicleModel(data.vehicleModel || "");
				setVehicleYear(data.vehicleYear || "");
				setVehicleType(data.vehicleType || "");
				setRegistrationNumber(data.registrationNumber || "");
				setChassisNumber(data.chassisNumber || "");
				setVehicleDescription(data.vehicleDescription || "");
				setExistingPhotos(data.vehiclePhotos || []);
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

	const handlePhotoChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		const totalPhotos = existingPhotos.length + newPhotos.length;
		if (totalPhotos + selectedFiles.length > 5) {
			toast.error("You can have a maximum of 5 photos");
			return;
		}
		setNewPhotos((previousPhotos) => [...previousPhotos, ...selectedFiles]);
		e.target.value = "";
	};

	const removeExistingPhoto = (indexToRemove) => {
		if (existingPhotos.length + newPhotos.length <= 1) {
			toast.error("At least one vehicle photo is required");
			return;
		}
		setExistingPhotos((previousPhotos) =>
			previousPhotos.filter((_, index) => index !== indexToRemove),
		);
	};

	const removeNewPhoto = (indexToRemove) => {
		if (existingPhotos.length + newPhotos.length <= 1) {
			toast.error("At least one vehicle photo is required");
			return;
		}
		setNewPhotos((previousPhotos) =>
			previousPhotos.filter((_, index) => index !== indexToRemove),
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const totalPhotos = existingPhotos.length + newPhotos.length;
		if (totalPhotos === 0) {
			toast.error("At least one vehicle photo is required");
			return;
		}
		try {
			setUpdating(true);
			const formData = new FormData();
			formData.append("vehicleName", vehicleName);
			formData.append("vehicleModel", vehicleModel);
			formData.append("vehicleYear", vehicleYear);
			formData.append("vehicleType", vehicleType);
			formData.append("vehicleDescription", vehicleDescription);
			formData.append("keepPhotos", JSON.stringify(existingPhotos));
			newPhotos.forEach((photo) => {
				formData.append("vehiclePhotos", photo);
			});
			const data = await updateVehicle(id, formData);
			console.log("Vehicle updated:", data);
			toast.success("Vehicle updated successfully");
			navigate(`${basePath}/${id}`);
		} catch (error) {
			console.error("Update vehicle error:", error);
			const message =
				error.response?.data?.message || "Failed to update vehicle";
			toast.error(message);
		} finally {
			setUpdating(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<Loader2 className="w-8 h-8 text-violet-600 animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading vehicle...</p>
				</div>
			</div>
		);
	}

	const totalPhotos = existingPhotos.length + newPhotos.length;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Link
					to={`${basePath}/${id}`}
					className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
					<p className="text-sm text-gray-500 mt-1">
						Update vehicle information.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
							<Truck className="w-5 h-5 text-violet-600" />
						</div>
						<div>
							<h2 className="text-base font-semibold text-gray-900">
								Vehicle Information
							</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								Update the vehicle information.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Name
							</label>
							<input
								type="text"
								value={vehicleName}
								onChange={(e) => setVehicleName(e.target.value)}
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Model
							</label>
							<input
								type="text"
								value={vehicleModel}
								onChange={(e) => setVehicleModel(e.target.value)}
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Year
							</label>
							<input
								type="number"
								value={vehicleYear}
								onChange={(e) => setVehicleYear(e.target.value)}
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Type
							</label>
							<select
								value={vehicleType}
								onChange={(e) => setVehicleType(e.target.value)}
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							>
								<option value="">Select vehicle type</option>
								<option value="LMV">LMV</option>
								<option value="HMV">HMV</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Registration Number
							</label>
							<input
								type="text"
								value={registrationNumber}
								disabled
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm uppercase bg-gray-100 text-gray-500 cursor-not-allowed"
							/>
							<p className="text-xs text-gray-400 mt-1">
								Registration number cannot be changed.
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Chassis Number
							</label>
							<input
								type="text"
								value={chassisNumber}
								disabled
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm uppercase bg-gray-100 text-gray-500 cursor-not-allowed"
							/>
							<p className="text-xs text-gray-400 mt-1">
								Chassis number cannot be changed.
							</p>
						</div>
					</div>

					<div className="mt-5">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Vehicle Description
						</label>
						<textarea
							value={vehicleDescription}
							onChange={(e) => setVehicleDescription(e.target.value)}
							rows={4}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>
				</div>

				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
					<div className="flex items-center justify-between mb-5">
						<div>
							<h2 className="text-base font-semibold text-gray-900">
								Vehicle Photos
								<span className="text-red-500 ml-1">*</span>
							</h2>
							<p className="text-xs text-gray-500 mt-1">
								Upload between 1 and 5 photos.
							</p>
						</div>
						<span className="text-xs font-medium text-gray-500">
							{totalPhotos}/5
						</span>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{totalPhotos < 5 && (
							<label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50/50 transition cursor-pointer flex flex-col items-center justify-center">
								<ImagePlus className="w-7 h-7 text-gray-400" />
								<span className="text-xs font-medium text-gray-600 mt-2">
									Add Photo
								</span>
								<span className="text-[11px] text-gray-400 mt-1">
									{5 - totalPhotos} remaining
								</span>
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={handlePhotoChange}
									className="hidden"
								/>
							</label>
						)}

						{existingPhotos.map((photo, index) => (
							<div
								key={`existing-${index}`}
								className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
							>
								<img
									src={photo}
									alt={`Vehicle ${index + 1}`}
									className="w-full h-full object-cover"
								/>
								<button
									type="button"
									onClick={() => removeExistingPhoto(index)}
									className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
								>
									<X className="w-4 h-4" />
								</button>
								<div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
									<p className="text-[10px] text-white">Existing</p>
								</div>
							</div>
						))}

						{newPhotos.map((photo, index) => (
							<div
								key={`new-${photo.name}-${index}`}
								className="relative aspect-square rounded-xl overflow-hidden border border-violet-200 group"
							>
								<img
									src={URL.createObjectURL(photo)}
									alt={`New vehicle ${index + 1}`}
									className="w-full h-full object-cover"
								/>
								<button
									type="button"
									onClick={() => removeNewPhoto(index)}
									className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
								>
									<X className="w-4 h-4" />
								</button>
								<div className="absolute bottom-0 left-0 right-0 bg-violet-600/70 px-2 py-1">
									<p className="text-[10px] text-white">New</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
					<Link
						to={`${basePath}/${id}`}
						className="w-full sm:w-auto px-5 py-2.5 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						Cancel
					</Link>

					<button
						type="submit"
						disabled={updating}
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{updating && <Loader2 className="w-4 h-4 animate-spin" />}
						{updating ? "Updating..." : "Update Vehicle"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditVehicle;
