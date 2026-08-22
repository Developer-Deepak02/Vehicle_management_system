import api from "./api";

export const getAllVehicles = async (params = {}) => {
	const response = await api.get("/vehicles/all-vehicles", {
		params,
	});

	return response.data;
};
