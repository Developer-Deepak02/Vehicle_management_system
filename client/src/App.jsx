import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register"
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import MainLayout from "./components/layout/MainLayout";

function App() {
	return (
		<BrowserRouter>
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3000,
				}}
			/>
			<Routes>
				{/* Public routes */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/unauthorized" element={<Unauthorized />} />

				{/* Admin routes */}
				<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
					<Route element={<MainLayout />}>
						<Route path="/admin/dashboard" element={<AdminDashboard />} />
					</Route>
				</Route>

				{/* Manager routes */}
				<Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
					<Route element={<MainLayout />}>
						<Route path="/manager/dashboard" element={<ManagerDashboard />} />
					</Route>
				</Route>

				{/* Driver routes */}
				<Route element={<ProtectedRoute allowedRoles={["driver"]} />}>
					<Route element={<MainLayout />}>
						<Route path="/driver/dashboard" element={<DriverDashboard />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
