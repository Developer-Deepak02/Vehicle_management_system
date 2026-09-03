import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
	return (
		<div className="h-screen bg-gray-100 flex overflow-hidden">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0 min-h-0">
				<Navbar />
				<main className="flex-1 min-h-0 p-6 overflow-y-auto overflow-x-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
