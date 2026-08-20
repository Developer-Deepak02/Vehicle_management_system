import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public routes */}
				<Route path="/login" element={<Login />} />
				
				<Route path="/unauthorized" element={<Unauthorized />} />

				{/* Admin routes */}
				<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
					<Route path="/admin/dashboard" element={<AdminDashboard />} />
				</Route>

				{/* Manager routes */}
				<Route element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}>
					<Route path="/manager/dashboard" element={<ManagerDashboard />} />
				</Route>

				{/* Driver routes */}
				<Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
					<Route path="/driver/dashboard" element={<DriverDashboard />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
