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

// Update current user profile
export const updateCurrentUser = async (data) => {
	const response = await api.put("/users/update-me", data);
	return response.data;
};

// Update profile picture
export const updateProfilePicture = async (formData) => {
	const response = await api.put("/users/profile-picture", formData);
	return response.data;
};