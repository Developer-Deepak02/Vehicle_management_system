import api from "./api";

// Get all vehicles
export const getAllVehicles = async (params = {}) => {
	const response = await api.get("/vehicles/all-vehicles", {
		params,
	});

	return response.data;
};

// Create vehicle
export const createVehicle = async (formData) => {
	const response = await api.post("/vehicles/create-vehicle", formData);

	return response.data;
};
