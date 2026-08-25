import api from "./api";

export const getCurrentUser = async () => {
	const response = await api.get("/users/me");

	return response.data;
};

export const getAvailableDrivers = async () => {
	const response = await api.get("/users/drivers", {
		params: {
			available: "true",
			limit: 100,
		},
	});

	return response.data;
};