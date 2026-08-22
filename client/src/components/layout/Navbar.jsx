import { Bell, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
	const { user } = useAuth();
	return (
		<header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
			{/* Page heading */}
			<div>
				<h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
				<p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
			</div>
			{/* Right side */}
			<div className="flex items-center gap-5">
				{/* Notifications */}
				<button className="relative p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
					<Bell className="size-5" />
					<span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
				</button>
				{/* User */}
				<div className="flex items-center gap-3">
					<div className="size-10 rounded-full bg-violet-100 flex items-center justify-center">
						<UserRound className="size-5 text-violet-700" />
					</div>
					<div className="hidden sm:block">
						<p className="text-sm font-medium text-gray-900">{user?.name}</p>
						<p className="text-xs text-gray-500 capitalize">{user?.role}</p>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
