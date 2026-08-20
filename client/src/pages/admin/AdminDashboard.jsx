import { useEffect } from "react";
import { getCurrentUser } from "../../services/userService";

const AdminDashboard = () => {
	useEffect(() => {
		const getUser = async () => {
			try {
				const data = await getCurrentUser();
				console.log("Current user:", data);
			} catch (error) {
				console.error("Get current user error:", error);
			}
		};

		getUser();
	}, []);

	return <h1>Admin Dashboard</h1>;
};

export default AdminDashboard;
