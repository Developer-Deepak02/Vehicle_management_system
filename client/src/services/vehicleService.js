import api from "./api";

// Get all vehicles
export const getAllVehicles = async (params = {}) => {
	const response = await api.get("/vehicles/all-vehicles", {
		params,
	});

	return response.data;
};

// Get single vehicle
export const getVehicle = async (vehicleId) => {
	const response = await api.get(`/vehicles/${vehicleId}`);

	return response.data;
};

// Create vehicle
export const createVehicle = async (formData) => {
	const response = await api.post("/vehicles/create-vehicle", formData);

	return response.data;
};

// Update vehicle
export const updateVehicle = async (vehicleId, formData) => {
	const response = await api.put(
		`/vehicles/update-vehicle/${vehicleId}`,
		formData,
	);
	return response.data;
};

// Get available vehicles
export const getAvailableVehicles = async () => {
	const response = await api.get("/vehicles/available-vehicle");

	return response.data;
};

// assignVehicle
export const assignVehicle = async (vehicleId, driverId) => {
	const response = await api.put(`/vehicles/${vehicleId}/assign`, {
		driverId,
	});

	return response.data;
};

// unassignVehicle
export const unassignVehicle = async (vehicleId) => {
	const response = await api.put(`/vehicles/${vehicleId}/unassign`);

	return response.data;
};