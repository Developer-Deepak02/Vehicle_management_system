import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
	return (
		<div className="min-h-screen bg-gray-100 flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Navbar />
				<main className="flex-1 p-6 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
