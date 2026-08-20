import { createContext, useContext, useState, useEffect } from "react";

import { getCurrentUser } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");

		return storedUser ? JSON.parse(storedUser) : null;
	});

	const [token, setToken] = useState(() => {
		return localStorage.getItem("token");
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verifyUser = async () => {
			const storedToken = localStorage.getItem("token");

			if (!storedToken) {
				setLoading(false);
				return;
			}

			try {
				const currentUser = await getCurrentUser();

				setUser(currentUser);

				localStorage.setItem("user", JSON.stringify(currentUser));
			} catch (error) {
				console.error("Authentication verification failed:", error);

				localStorage.removeItem("token");
				localStorage.removeItem("user");

				setToken(null);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		verifyUser();
	}, []);

	const login = (userData) => {
		localStorage.setItem("token", userData.token);
		localStorage.setItem("user", JSON.stringify(userData));

		setToken(userData.token);
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
				loading,
				isAuthenticated: !!token,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
