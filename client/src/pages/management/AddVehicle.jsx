import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Upload, X, ImagePlus } from "lucide-react";
import { createVehicle } from "../../services/vehicleService";
import toast from "react-hot-toast";

const AddVehicle = () => {
	const navigate = useNavigate();
	const [vehicleName, setVehicleName] = useState("");
	const [vehicleModel, setVehicleModel] = useState("");
	const [vehicleYear, setVehicleYear] = useState("");
	const [vehicleType, setVehicleType] = useState("");
	const [registrationNumber, setRegistrationNumber] = useState("");
	const [chassisNumber, setChassisNumber] = useState("");
	const [vehicleDescription, setVehicleDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [photos, setPhotos] = useState([]);

	const handlePhotoChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		if (photos.length + selectedFiles.length > 5) {
			alert("You can upload a maximum of 5 photos.");
			return;
		}
		setPhotos((previousPhotos) => [...previousPhotos, ...selectedFiles]);
		e.target.value = "";
	};

	const removePhoto = (indexToRemove) => {
		setPhotos((previousPhotos) =>
			previousPhotos.filter((_, index) => index !== indexToRemove),
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (photos.length === 0) {
			toast.error("Please upload at least one vehicle photo");
			return;
		}
		try {
			setSubmitting(true);
			const formData = new FormData();
			formData.append("vehicleName", vehicleName);
			formData.append("vehicleModel", vehicleModel);
			formData.append("vehicleYear", vehicleYear);
			formData.append("vehicleType", vehicleType);
			formData.append("registrationNumber", registrationNumber);
			formData.append("chassisNumber", chassisNumber);
			formData.append("vehicleDescription", vehicleDescription);
			photos.forEach((photo) => {
				formData.append("vehiclePhotos", photo);
			});
			const data = await createVehicle(formData);
			console.log("Vehicle created:", data);
			toast.success("Vehicle added successfully");
			navigate("/admin/vehicles");
		} catch (error) {
			console.error("Create vehicle error:", error);
			const message =
				error.response?.data?.message || "Failed to create vehicle";
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link
					to="/admin/vehicles"
					className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
				>
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Add Vehicle</h1>
					<p className="text-sm text-gray-500 mt-1">
						Add a new vehicle to your fleet.
					</p>
				</div>
			</div>
			{/* Form */}
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
								Enter the basic information about the vehicle.
							</p>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{/* Vehicle Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Name
								<span className="text-red-500 ml-1">*</span>
							</label>
							<input
								type="text"
								value={vehicleName}
								onChange={(e) => setVehicleName(e.target.value)}
								placeholder="e.g. Tata Ace"
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						{/* Vehicle Model */}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Model
								<span className="text-red-500 ml-1">*</span>
							</label>
							<input
								type="text"
								value={vehicleModel}
								onChange={(e) => setVehicleModel(e.target.value)}
								placeholder="e.g. Ace Gold"
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						{/* Vehicle Year */}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Year
								<span className="text-red-500 ml-1">*</span>
							</label>
							<input
								type="number"
								value={vehicleYear}
								onChange={(e) => setVehicleYear(e.target.value)}
								placeholder="e.g. 2024"
								min="1900"
								max={new Date().getFullYear() + 1}
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						{/* Vehicle Type */}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vehicle Type
								<span className="text-red-500 ml-1">*</span>
							</label>
							<select
								value={vehicleType}
								onChange={(e) => setVehicleType(e.target.value)}
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none bg-white transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							>
								<option value="">Select vehicle type</option>
								<option value="LMV">LMV</option>
								<option value="HMV">HMV</option>
							</select>
						</div>

						{/* Registration Number */}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Registration Number
								<span className="text-red-500 ml-1">*</span>
							</label>
							<input
								type="text"
								value={registrationNumber}
								onChange={(e) =>
									setRegistrationNumber(e.target.value.toUpperCase())
								}
								placeholder="e.g. HP34A0001"
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm uppercase outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>

						{/* Chassis Number */}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Chassis Number
								<span className="text-red-500 ml-1">*</span>
							</label>
							<input
								type="text"
								value={chassisNumber}
								onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
								placeholder="Enter chassis number"
								className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm uppercase outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
							/>
						</div>
					</div>

					{/* Description */}

					<div className="mt-5">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Vehicle Description
							<span className="text-gray-400 font-normal ml-1">(Optional)</span>
						</label>
						<textarea
							value={vehicleDescription}
							onChange={(e) => setVehicleDescription(e.target.value)}
							rows={4}
							placeholder="Add any additional information about this vehicle..."
							className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none resize-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>
				</div>

				{/* Vehicle Photos */}

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
							{photos.length}/5
						</span>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{/* Upload button */}
						{photos.length < 5 && (
							<label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50/50 transition cursor-pointer flex flex-col items-center justify-center">
								<ImagePlus className="w-7 h-7 text-gray-400" />
								<span className="text-xs font-medium text-gray-600 mt-2">
									Add Photo
								</span>
								<span className="text-[11px] text-gray-400 mt-1">
									{5 - photos.length} remaining
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

						{/* Selected photos */}

						{photos.map((photo, index) => (
							<div
								key={`${photo.name}-${index}`}
								className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
							>
								<img
									src={URL.createObjectURL(photo)}
									alt={`Vehicle ${index + 1}`}
									className="w-full h-full object-cover"
								/>
								{/* Remove */}
								<button
									type="button"
									onClick={() => removePhoto(index)}
									className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>
				</div>

				{/* form action */}
				<div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
					<Link
						to="/admin/vehicles"
						className="w-full sm:w-auto px-5 py-2.5 text-center border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
					>
						Cancel
					</Link>
					<button
						type="submit"
						disabled={submitting}
						className="w-full sm:w-auto min-w-[140px] px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{submitting ? (
							<>
								<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Adding...
							</>
						) : (
							"Add Vehicle"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddVehicle;
