import api from "./api";

export const getAdminDashboard = async () => {
	const response = await api.get("/dashboard/admin-dashboard");
	return response.data;
};

export const getManagerDashboard = async () => {
	const response = await api.get("/dashboard/manager-dashboard");
	return response.data;
};
