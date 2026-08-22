import { Link, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	TruckElectric,
  Truck,
	UserRound,
	Settings,
	LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
	const { user, logout } = useAuth();
	const location = useLocation();
	const isActive = (path) => {
		return location.pathname === path;
	};
	const adminLinks = [
		{
			name: "Dashboard",
			path: "/admin/dashboard",
			icon: LayoutDashboard,
		},
		{
			name: "Managers",
			path: "/admin/managers",
			icon: Users,
		},
		{
			name: "Drivers",
			path: "/admin/drivers",
			icon: UserRound,
		},
		{
			name: "Vehicles",
			path: "/admin/vehicles",
			icon: Truck,
		},
	];

	const managerLinks = [
		{
			name: "Dashboard",
			path: "/manager/dashboard",
			icon: LayoutDashboard,
		},
		{
			name: "Drivers",
			path: "/manager/drivers",
			icon: UserRound,
		},
		{
			name: "Vehicles",
			path: "/manager/vehicles",
			icon: Truck,
		},
	];

	const driverLinks = [
		{
			name: "Dashboard",
			path: "/driver/dashboard",
			icon: LayoutDashboard,
		},
		{
			name: "My Vehicle",
			path: "/driver/my-vehicle",
			icon: Truck,
		},
		{
			name: "Profile",
			path: "/driver/profile",
			icon: UserRound,
		},
	];

	let links = [];
	if (user?.role === "admin") {
		links = adminLinks;
	} else if (user?.role === "manager") {
		links = managerLinks;
	} else if (user?.role === "driver") {
		links = driverLinks;
	}

	const handleLogout = () => {
		logout();
	};

	return (
		<aside className="w-64 min-h-screen bg-violet-950 text-white flex flex-col">
			{/* Logo */}
			<div className="h-20 px-6 flex items-center border-b border-violet-800">
				<div className="flex items-center gap-3">
					<TruckElectric className="size-8 text-violet-300" />
					<div>
						<h1 className="text-xl font-bold">VMS</h1>
						<p className="text-xs text-violet-300">Vehicle Management System</p>
					</div>
				</div>
			</div>
			{/* Navigation */}
			<nav className="flex-1 px-4 py-6">
				<p className="text-xs uppercase tracking-wider text-violet-400 mb-3 px-3">
					Menu
				</p>
				<div className="space-y-1">
					{links.map((link) => {
						const Icon = link.icon;
						const active = isActive(link.path);
						return (
							<Link
								key={link.path}
								to={link.path}
								className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
									active
										? "bg-violet-600 text-white"
										: "text-violet-200 hover:bg-violet-900 hover:text-white"
								}`}
							>
								<Icon className="size-5" />
								<span>{link.name}</span>
							</Link>
						);
					})}
				</div>
			</nav>
			{/* User section */}
			<div className="border-t border-violet-800 p-4">
				<div className="flex items-center gap-3 mb-4">
					<div className="size-10 rounded-full bg-violet-700 flex items-center justify-center">
						<UserRound className="size-5" />
					</div>
					<div className="min-w-0">
						<p className="text-sm font-medium truncate">{user?.name}</p>

						<p className="text-xs text-violet-300 capitalize">{user?.role}</p>
					</div>
				</div>

				<button
					onClick={handleLogout}
					className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-violet-200 hover:bg-red-600 hover:text-white transition cursor-pointer"
				>
					<LogOut className="size-5" />
					<span>Logout</span>
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
