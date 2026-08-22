import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Truck,
	Users,
	UserRound,
	CheckCircle2,
	CircleAlert,
	CarFront,
	UserCheck,
	UserX,
	Clock3,
} from "lucide-react";
import { getAdminDashboard } from "../../services/dashboardService";

const StatCard = ({ title, value, description, icon: Icon }) => {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-medium text-gray-500">{title}</p>
					<p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
					{description && (
						<p className="text-xs text-gray-500 mt-2">{description}</p>
					)}
				</div>
				<div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
					<Icon className="w-5 h-5 text-violet-700" />
				</div>
			</div>
		</div>
	);
};

const OverviewItem = ({ label, value, icon: Icon }) => {
	return (
		<div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
			<div className="flex items-center gap-3">
				<div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
					<Icon className="w-4 h-4 text-gray-600" />
				</div>
				<span className="text-sm text-gray-600">{label}</span>
			</div>
			<span className="font-semibold text-gray-900">{value}</span>
		</div>
	);
};

const AdminDashboard = () => {
	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				setLoading(true);
				const data = await getAdminDashboard();
				setDashboard(data);
			} catch (error) {
				console.error("Admin dashboard error:", error);
				const message =
					error.response?.data?.message || "Failed to load dashboard";
				toast.error(message);
			} finally {
				setLoading(false);
			}
		};
		fetchDashboard();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading dashboard...</p>
				</div>
			</div>
		);
	}
	if (!dashboard) {
		return (
			<div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
				<p className="text-gray-500">Unable to load dashboard data.</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
					<p className="text-sm text-gray-500 mt-1">
						Monitor your vehicles, drivers and managers from one place.
					</p>
				</div>
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<div className="w-2 h-2 rounded-full bg-green-500" />
					System overview
				</div>
			</div>
			{/* Main Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
				<StatCard
					title="Total Vehicles"
					value={dashboard.vehicles.total}
					description={`${dashboard.vehicles.active} currently active`}
					icon={Truck}
				/>
				<StatCard
					title="Total Drivers"
					value={dashboard.drivers.total}
					description={`${dashboard.drivers.active} currently active`}
					icon={UserRound}
				/>
				<StatCard
					title="Total Managers"
					value={dashboard.managers.total}
					description={`${dashboard.managers.active} currently active`}
					icon={Users}
				/>
				<StatCard
					title="Available Vehicles"
					value={dashboard.vehicles.available}
					description={`${dashboard.vehicles.assigned} currently assigned`}
					icon={CarFront}
				/>
			</div>
			{/* Vehicle + Driver Overview */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{/* Vehicle Overview */}
				<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="font-semibold text-gray-900">Vehicle Overview</h2>
							<p className="text-xs text-gray-500 mt-1">
								Current vehicle status
							</p>
						</div>
						<div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
							<Truck className="w-5 h-5 text-violet-700" />
						</div>
					</div>
					<OverviewItem
						label="Active Vehicles"
						value={dashboard.vehicles.active}
						icon={CheckCircle2}
					/>
					<OverviewItem
						label="Available Vehicles"
						value={dashboard.vehicles.available}
						icon={CarFront}
					/>
					<OverviewItem
						label="Assigned Vehicles"
						value={dashboard.vehicles.assigned}
						icon={UserCheck}
					/>
					<OverviewItem
						label="Inactive Vehicles"
						value={dashboard.vehicles.inactive}
						icon={CircleAlert}
					/>
				</div>
				{/* Driver Overview */}
				<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="font-semibold text-gray-900">Driver Overview</h2>
							<p className="text-xs text-gray-500 mt-1">
								Current driver status
							</p>
						</div>
						<div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
							<UserRound className="w-5 h-5 text-violet-700" />
						</div>
					</div>
					<OverviewItem
						label="Active Drivers"
						value={dashboard.drivers.active}
						icon={CheckCircle2}
					/>
					<OverviewItem
						label="Assigned Drivers"
						value={dashboard.drivers.assigned}
						icon={UserCheck}
					/>
					<OverviewItem
						label="Unassigned Drivers"
						value={dashboard.drivers.unassigned}
						icon={UserX}
					/>
					<OverviewItem
						label="Inactive Drivers"
						value={dashboard.drivers.inactive}
						icon={CircleAlert}
					/>
				</div>
			</div>
			{/* Manager Overview */}
			<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
				<div className="flex items-center justify-between mb-5">
					<div>
						<h2 className="font-semibold text-gray-900">Manager Overview</h2>
						<p className="text-xs text-gray-500 mt-1">Manager account status</p>
					</div>
					<div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
						<Users className="w-5 h-5 text-violet-700" />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<CheckCircle2 className="w-5 h-5 text-green-600" />
							<span className="text-sm text-gray-600">Active</span>
						</div>
						<p className="text-2xl font-bold text-gray-900 mt-3">
							{dashboard.managers.active}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<CircleAlert className="w-5 h-5 text-red-500" />
							<span className="text-sm text-gray-600">Inactive</span>
						</div>
						<p className="text-2xl font-bold text-gray-900 mt-3">
							{dashboard.managers.inactive}
						</p>
					</div>
					<div className="bg-gray-50 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<Clock3 className="w-5 h-5 text-amber-500" />
							<span className="text-sm text-gray-600">Invited</span>
						</div>
						<p className="text-2xl font-bold text-gray-900 mt-3">
							{dashboard.managers.invitedNotJoined}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
