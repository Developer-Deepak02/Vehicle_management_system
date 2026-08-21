import api from "./api";

export const loginUser = async (email, password) => {
	const response = await api.post("/auth/login", { email, password });
	return response.data;
};

export const registerUser = async (name, email, password) => {
	const response = await api.post("/auth/register", {
		name,
		email,
		password,
	});

	return response.data;
};

export const verifyOtp = async (email, otp) => {
	const response = await api.post("/auth/verify-otp", {
		email,
		otp,
	});

	return response.data;
};

export const resendOtp = async (email) => {
	const response = await api.post("/auth/resend-otp", {
		email,
	});

	return response.data;
};

export const forgotPassword = async (email) => {
	const response = await api.post("/auth/forgot-password", {
		email,
	});

	return response.data;
};

export const verifyResetOtp = async (email, otp) => {
	const response = await api.post("/auth/verify-reset-otp", {
		email,
		otp,
	});

	return response.data;
};

export const resetPassword = async (email, newPassword) => {
	const response = await api.post("/auth/reset-password", {
		email,
		newPassword,
	});

	return response.data;
};