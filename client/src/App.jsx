import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
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
import Vehicles from "./pages/management/Vehicles";
import AddVehicle from "./pages/management/AddVehicle";
import VehicleDetails from "./pages/management/VehicleDetails";
import EditVehicle from "./pages/management/EditVehicle";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Managers from "./pages/admin/Managers";
import AddManager from "./pages/admin/AddManager";
import EditManager from "./pages/admin/EditManager";
import Drivers from "./pages/management/Drivers";
import DriverDetails from "./pages/management/DriverDetails";
import EditDriver from "./pages/management/EditDriver";
import AddDriver from "./pages/management/AddDriver";
import MyVehicle from "./pages/driver/MyVehicle";

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

				{/* Profile route */}
				<Route
					element={
						<ProtectedRoute allowedRoles={["admin", "manager", "driver"]} />
					}
				>
					<Route element={<MainLayout />}>
						<Route path="/profile" element={<Profile />} />
						<Route path="/change-password" element={<ChangePassword />} />
					</Route>
				</Route>

				{/* Admin routes */}
				<Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
					<Route element={<MainLayout />}>
						<Route path="/admin/dashboard" element={<AdminDashboard />} />
						<Route path="/admin/managers" element={<Managers />} />
						<Route path="/admin/managers/add" element={<AddManager />} />
						<Route path="/admin/managers/:id/edit" element={<EditManager />} />
					</Route>
				</Route>

				{/* Driver and Vehicle management routes - Admin + Manager */}
				<Route element={<ProtectedRoute allowedRoles={["admin", "manager"]} />}>
					<Route element={<MainLayout />}>
						{/* Admin vehicle routes */}
						<Route path="/admin/vehicles" element={<Vehicles />} />
						<Route path="/admin/vehicles/add" element={<AddVehicle />} />
						<Route path="/admin/vehicles/:id" element={<VehicleDetails />} />
						<Route path="/admin/vehicles/:id/edit" element={<EditVehicle />} />

						{/* Manager vehicle routes */}
						<Route path="/manager/vehicles" element={<Vehicles />} />
						<Route path="/manager/vehicles/add" element={<AddVehicle />} />
						<Route path="/manager/vehicles/:id" element={<VehicleDetails />} />
						<Route
							path="/manager/vehicles/:id/edit"
							element={<EditVehicle />}
						/>

						{/* Admin driver routes */}
						<Route path="/admin/drivers" element={<Drivers />} />
						<Route path="/admin/drivers/add" element={<AddDriver />} />
						<Route path="/admin/drivers/:id/edit" element={<EditDriver />} />
						<Route path="/admin/drivers/:id" element={<DriverDetails />} />

						{/* Manager driver routes */}
						<Route path="/manager/drivers" element={<Drivers />} />
						<Route path="/manager/drivers/add" element={<AddDriver />} />
						<Route path="/manager/drivers/:id/edit" element={<EditDriver />} />
						<Route path="/manager/drivers/:id" element={<DriverDetails />} />
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
						<Route path="/driver/my-vehicle" element={<MyVehicle />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
