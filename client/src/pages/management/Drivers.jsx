import { useEffect, useState } from "react";
import {
	Search,
	Plus,
	Edit,
	Trash2,
	Power,
	ChevronLeft,
	ChevronRight,
	X,
	UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
	getDrivers,
	activateDeactivateUser,
	deleteUser,
} from "../../services/userService";

const Drivers = () => {
	const location = useLocation();
	const isManager = location.pathname.startsWith("/manager");
	const basePath = isManager ? "/manager/drivers" : "/admin/drivers";

	const [drivers, setDrivers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [active, setActive] = useState("");
	const [actionLoading, setActionLoading] = useState(false);

	const [selectedDriver, setSelectedDriver] = useState(null);
	const [modalType, setModalType] = useState("");

	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalDrivers: 0,
	});

	const loadDrivers = async (params = {}) => {
		try {
			setLoading(true);

			const requestParams = {
				search: params.search ?? search,
				page: params.page ?? pagination.currentPage,
				limit: 10,
			};

			const activeValue = params.active ?? active;

			if (activeValue !== "") {
				requestParams.active = activeValue;
			}

			const data = await getDrivers(requestParams);

			setDrivers(data.users || []);

			setPagination(
				data.pagination || {
					currentPage: 1,
					totalPages: 1,
					totalUsers: 0,
				},
			);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load drivers");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadDrivers();
	}, []);

	const handleSearch = async () => {
		await loadDrivers({
			search,
			active,
			page: 1,
		});
	};

	const handleClearFilters = async () => {
		setSearch("");
		setActive("");

		await loadDrivers({
			search: "",
			active: "",
			page: 1,
		});
	};

	const openModal = (driver, type) => {
		setSelectedDriver(driver);
		setModalType(type);
	};

	const closeModal = () => {
		if (actionLoading) return;

		setSelectedDriver(null);
		setModalType("");
	};

	const handleStatusChange = async () => {
		if (!selectedDriver) return;

		try {
			setActionLoading(true);

			await activateDeactivateUser(selectedDriver._id);

			toast.success(
				selectedDriver.active
					? "Driver deactivated successfully"
					: "Driver activated successfully",
			);

			setSelectedDriver(null);
			setModalType("");

			await loadDrivers();
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Failed to update driver status",
			);
		} finally {
			setActionLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedDriver) return;

		try {
			setActionLoading(true);

			await deleteUser(selectedDriver._id);

			toast.success("Driver deleted successfully");

			setSelectedDriver(null);
			setModalType("");

			const currentPage = pagination.currentPage;

			if (drivers.length === 1 && currentPage > 1) {
				await loadDrivers({
					page: currentPage - 1,
				});
			} else {
				await loadDrivers();
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete driver");
		} finally {
			setActionLoading(false);
		}
	};

	const handlePageChange = async (page) => {
		if (page < 1 || page > pagination.totalPages) return;

		await loadDrivers({
			page,
		});
	};

	const formatDate = (date) => {
		if (!date) return "—";

		return new Date(date).toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-sm text-gray-500">Loading drivers...</p>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage drivers and their accounts.
					</p>
				</div>

				<Link
					to={`${basePath}/add`}
					className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
				>
					<Plus className="size-4" />
					Add Driver
				</Link>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
				<div className="flex flex-col md:flex-row gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
							placeholder="Search by name or email..."
							className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					<select
						value={active}
						onChange={async (e) => {
							const value = e.target.value;
							setActive(value);

							await loadDrivers({
								search,
								active: value,
								page: 1,
							});
						}}
						className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
					>
						<option value="">All Status</option>
						<option value="true">Active</option>
						<option value="false">Inactive</option>
					</select>

					<button
						onClick={handleSearch}
						className="px-4 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
					>
						Search
					</button>

					<button
						onClick={handleClearFilters}
						className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
					>
						<X className="size-4" />
						Clear
					</button>
				</div>
			</div>

			{/* Drivers Table */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="text-left px-5 py-3 font-medium text-gray-600">
									Driver
								</th>
								<th className="text-left px-5 py-3 font-medium text-gray-600">
									Email
								</th>
								<th className="text-left px-5 py-3 font-medium text-gray-600">
									Status
								</th>
								<th className="text-left px-5 py-3 font-medium text-gray-600">
									License
								</th>
								<th className="text-left px-5 py-3 font-medium text-gray-600">
									Joined
								</th>
								<th className="text-right px-5 py-3 font-medium text-gray-600">
									Action
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-100">
							{drivers.length === 0 ? (
								<tr>
									<td
										colSpan="6"
										className="px-5 py-12 text-center text-gray-500"
									>
										No drivers found.
									</td>
								</tr>
							) : (
								drivers.map((driver) => (
									<tr key={driver._id} className="hover:bg-gray-50">
										<td className="px-5 py-4">
											<div className="flex items-center gap-3">
												<div className="size-9 rounded-full bg-violet-100 flex items-center justify-center">
													<UserRound className="size-4 text-violet-700" />
												</div>

												<div>
													<p className="font-medium text-gray-900">
														{driver.name}
													</p>
													<p className="text-xs text-gray-500">Driver</p>
												</div>
											</div>
										</td>

										<td className="px-5 py-4 text-gray-600">{driver.email}</td>

										<td className="px-5 py-4">
											<span
												className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
													driver.active
														? "bg-green-100 text-green-700"
														: "bg-gray-100 text-gray-600"
												}`}
											>
												{driver.active ? "Active" : "Inactive"}
											</span>
										</td>

										<td className="px-5 py-4">
											<span
												className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
													driver.licenseVerified
														? "bg-green-100 text-green-700"
														: "bg-yellow-100 text-yellow-700"
												}`}
											>
												{driver.licenseVerified ? "Verified" : "Pending"}
											</span>
										</td>

										<td className="px-5 py-4 text-gray-600">
											{formatDate(driver.joinedOn)}
										</td>

										<td className="px-5 py-4">
											<div className="flex justify-end items-center gap-2">
												<Link
													to={`${basePath}/${driver._id}`}
													className="px-3 py-1.5 rounded-lg text-xs font-medium text-violet-700 hover:bg-violet-50"
												>
													View
												</Link>

												<Link
													to={`${basePath}/${driver._id}/edit`}
													className="p-2 rounded-lg text-gray-500 hover:text-violet-700 hover:bg-violet-50"
													title="Edit"
												>
													<Edit className="size-4" />
												</Link>

												<button
													onClick={() => openModal(driver, "status")}
													className={`p-2 rounded-lg ${
														driver.active
															? "text-orange-500 hover:bg-orange-50"
															: "text-green-600 hover:bg-green-50"
													}`}
													title={driver.active ? "Deactivate" : "Activate"}
												>
													<Power className="size-4" />
												</button>

												<button
													onClick={() => openModal(driver, "delete")}
													className="p-2 rounded-lg text-red-500 hover:bg-red-50"
													title="Delete"
												>
													<Trash2 className="size-4" />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
						<p className="text-sm text-gray-500">
							Showing page {pagination.currentPage} of {pagination.totalPages}
						</p>

						<div className="flex items-center gap-2">
							<button
								onClick={() => handlePageChange(pagination.currentPage - 1)}
								disabled={pagination.currentPage === 1}
								className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
							>
								<ChevronLeft className="size-4" />
							</button>

							<span className="text-sm text-gray-600 px-2">
								{pagination.currentPage}
							</span>

							<button
								onClick={() => handlePageChange(pagination.currentPage + 1)}
								disabled={pagination.currentPage === pagination.totalPages}
								className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
							>
								<ChevronRight className="size-4" />
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Confirmation Modal */}
			{selectedDriver && modalType && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
						<h2 className="text-lg font-semibold text-gray-900">
							{modalType === "delete"
								? "Delete Driver"
								: selectedDriver.active
									? "Deactivate Driver"
									: "Activate Driver"}
						</h2>

						<p className="text-sm text-gray-500 mt-2">
							{modalType === "delete"
								? `Are you sure you want to delete ${selectedDriver.name}? This action cannot be undone.`
								: `Are you sure you want to ${
										selectedDriver.active ? "deactivate" : "activate"
									} ${selectedDriver.name}?`}
						</p>

						<div className="flex justify-end gap-3 mt-6">
							<button
								onClick={closeModal}
								disabled={actionLoading}
								className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={
									modalType === "delete" ? handleDelete : handleStatusChange
								}
								disabled={actionLoading}
								className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${
									modalType === "delete"
										? "bg-red-600 hover:bg-red-700"
										: selectedDriver.active
											? "bg-orange-500 hover:bg-orange-600"
											: "bg-green-600 hover:bg-green-700"
								}`}
							>
								{actionLoading
									? "Processing..."
									: modalType === "delete"
										? "Delete"
										: selectedDriver.active
											? "Deactivate"
											: "Activate"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Drivers;
