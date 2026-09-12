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

// Change password
export const changePassword = async (data) => {
	const response = await api.put("/users/change-password", data);
	return response.data;
};

// Get managers
export const getManagers = async (params = {}) => {
	const response = await api.get("/users/all-users", {
		params: {
			...params,
			role: "manager",
		},
	});
	return response.data;
};

// Create manager
export const createManager = async (data) => {
	const response = await api.post("/users/create-manager", data);
	return response.data;
};

// Activate / deactivate user
export const activateDeactivateUser = async (userId) => {
	const response = await api.patch(`/users/status/${userId}`);
	return response.data;
};

// Update user
export const updateUser = async (userId, data) => {
	const response = await api.put(`/users/update-user/${userId}`, data);
	return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
	const response = await api.delete(`/users/delete-user/${userId}`);
	return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
	const response = await api.get(`/users/user/${userId}`);
	return response.data;
};

// Get drivers
export const getDrivers = async (params = {}) => {
	const response = await api.get("/users/all-users", {
		params: {
			...params,
			role: "driver",
		},
	});
	return response.data;
};

// Get one driver
export const getDriver = async (driverId) => {
	const response = await api.get(`/users/drivers/${driverId}`);
	return response.data;
};

// Verify / reject driver license
export const verifyDriverLicense = async (driverId, data) => {
	const response = await api.patch(
		`/users/driver-license/${driverId}/verify`,
		data,
	);
	return response.data;
};

// Submit / update driving license
export const submitDriverLicense = async (formData) => {
	const response = await api.put("/users/driver-license", formData);
	return response.data;
};

export const createDriver = async (data) => {
	const response = await api.post("/users/create-driver", data);
	return response.data;
};