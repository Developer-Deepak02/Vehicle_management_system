import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Users,
	Plus,
	Search,
	SlidersHorizontal,
	RotateCcw,
	ShieldCheck,
	ShieldX,
	Power,
	Trash2,
	Edit,
} from "lucide-react";
import {
	getManagers,
	activateDeactivateUser,
	deleteUser,
} from "../../services/userService";
import { Link } from "react-router-dom";

const Managers = () => {
	const [managers, setManagers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [active, setActive] = useState("");
	const [actionLoading, setActionLoading] = useState(false);
	const [selectedManager, setSelectedManager] = useState(null);
	const [modalType, setModalType] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		limit: 10,
		totalUsers: 0,
		totalPages: 0,
	});

	// Get managers
	const handleSearch = async (pageNumber = 1) => {
		try {
			setLoading(true);
			const params = {
				page: pageNumber,
				limit: 10,
			};
			if (search.trim()) {
				params.search = search.trim();
			}
			if (active !== "") {
				params.active = active;
			}
			const data = await getManagers(params);
			console.log("Managers response:", data);
			setManagers(data.users);
			setPagination(data.pagination);
		} catch (error) {
			console.error("Get managers error:", error);
			const message =
				error.response?.data?.message || "Failed to load managers";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	// Initial load
	useEffect(() => {
		handleSearch(1);
	}, []);

	// Clear filters
	const handleClearFilters = () => {
		setSearch("");
		setActive("");
		setTimeout(() => {
			handleSearch(1);
		}, 0);
	};

	// Open confirmation modal
	const openModal = (manager, type) => {
		setSelectedManager(manager);
		setModalType(type);
	};

	// Close confirmation modal
	const closeModal = () => {
		if (actionLoading) return;
		setSelectedManager(null);
		setModalType("");
	};

	// Activate / deactivate manager
	const handleStatusChange = async () => {
		if (!selectedManager) return;
		try {
			setActionLoading(true);
			const data = await activateDeactivateUser(selectedManager._id);
			toast.success(data.message || "Manager status updated");
			closeModal();
			handleSearch(pagination.currentPage);
		} catch (error) {
			console.error("Manager status error:", error);
			const message =
				error.response?.data?.message || "Failed to update manager status";
			toast.error(message);
		} finally {
			setActionLoading(false);
		}
	};

	// Delete manager
	const handleDelete = async () => {
		if (!selectedManager) return;
		try {
			setActionLoading(true);
			const data = await deleteUser(selectedManager._id);
			toast.success(data.message || "Manager deleted successfully");
			closeModal();
			handleSearch(
				managers.length === 1 && pagination.currentPage > 1
					? pagination.currentPage - 1
					: pagination.currentPage,
			);
		} catch (error) {
			console.error("Delete manager error:", error);
			const message =
				error.response?.data?.message || "Failed to delete manager";
			toast.error(message);
		} finally {
			setActionLoading(false);
		}
	};

	// Loading
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="text-center">
					<div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
					<p className="text-sm text-gray-500 mt-3">Loading managers...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* PAGE HEADER */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Managers</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage managers and their account access.
					</p>
				</div>
				<Link
					to="/admin/managers/add"
					className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
				>
					<Plus className="w-4 h-4" />
					Add Manager
				</Link>
			</div>

			{/* SEARCH + FILTERS */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
				{/* Filter header */}
				<div className="flex items-center gap-2 mb-4">
					<div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
						<SlidersHorizontal className="w-4 h-4 text-violet-600" />
					</div>
					<div>
						<h2 className="text-sm font-semibold text-gray-900">
							Search & Filters
						</h2>
						<p className="text-xs text-gray-500">
							Find managers using search and filters.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
					{/* Search */}
					<div className="relative lg:col-span-8">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch(1);
								}
							}}
							placeholder="Search manager name or email..."
							className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						/>
					</div>

					{/* Activity */}
					<div className="lg:col-span-3">
						<select
							value={active}
							onChange={(e) => setActive(e.target.value)}
							className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
						>
							<option value="">All Activity</option>
							<option value="true">Active</option>
							<option value="false">Inactive</option>
						</select>
					</div>

					{/* Search Button */}
					<div className="lg:col-span-1">
						<button
							onClick={() => handleSearch(1)}
							className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
						>
							Search
						</button>
					</div>
				</div>

				{/* Bottom filter actions */}
				<div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
					<p className="text-xs text-gray-500">
						{pagination.totalUsers} manager
						{pagination.totalUsers !== 1 ? "s" : ""} found
					</p>
					<button
						onClick={handleClearFilters}
						className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 transition cursor-pointer"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						Clear filters
					</button>
				</div>
			</div>

			{/* MANAGER TABLE */}
			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
				{managers.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-50 border-b border-gray-200">
									<tr>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Manager
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Email
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Status
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Verification
										</th>
										<th className="text-left px-6 py-4 font-semibold text-gray-600">
											Joined
										</th>
										<th className="text-right px-6 py-4 font-semibold text-gray-600">
											Action
										</th>
									</tr>
								</thead>

								<tbody className="divide-y divide-gray-100">
									{managers.map((manager) => (
										<tr
											key={manager._id}
											className="hover:bg-gray-50 transition"
										>
											{/* Manager */}
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
														<Users className="w-5 h-5 text-violet-700" />
													</div>
													<div>
														<p className="font-medium text-gray-900">
															{manager.name}
														</p>
														<p className="text-xs text-gray-500 capitalize">
															{manager.role}
														</p>
													</div>
												</div>
											</td>

											{/* Email */}
											<td className="px-6 py-4 text-gray-700">
												{manager.email}
											</td>

											{/* Status */}
											<td className="px-6 py-4">
												<span
													className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
														manager.active
															? "bg-green-100 text-green-700"
															: "bg-gray-100 text-gray-600"
													}`}
												>
													{manager.active ? "Active" : "Inactive"}
												</span>
											</td>

											{/* Verification */}
											<td className="px-6 py-4">
												{manager.isVerified ? (
													<span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium">
														<ShieldCheck className="w-4 h-4" />
														Verified
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-medium">
														<ShieldX className="w-4 h-4" />
														Pending
													</span>
												)}
											</td>

											{/* Joined */}
											<td className="px-6 py-4 text-gray-600">
												{manager.joinedOn
													? new Date(manager.joinedOn).toLocaleDateString()
													: "Not joined"}
											</td>

											{/* Action */}
											<td className="px-6 py-4 text-right">
												<div className="flex items-center justify-end gap-1">
													<Link
														to={`/admin/managers/${manager._id}/edit`}
														className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
														title="Edit manager"
													>
														<Edit className="w-4 h-4" />
													</Link>

													<button
														onClick={() =>
															openModal(
																manager,
																manager.active ? "deactivate" : "activate",
															)
														}
														className={`p-2 rounded-lg transition cursor-pointer ${
															manager.active
																? "text-amber-600 hover:bg-amber-50"
																: "text-green-600 hover:bg-green-50"
														}`}
														title={
															manager.active
																? "Deactivate manager"
																: "Activate manager"
														}
													>
														<Power className="w-4 h-4" />
													</button>

													<button
														onClick={() => openModal(manager, "delete")}
														className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
														title="Delete manager"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* PAGINATION */}
						{pagination.totalPages > 0 && (
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
								<p className="text-sm text-gray-500">
									Showing page{" "}
									<span className="font-medium text-gray-700">
										{pagination.currentPage}
									</span>{" "}
									of{" "}
									<span className="font-medium text-gray-700">
										{pagination.totalPages}
									</span>
								</p>

								<div className="flex items-center gap-2">
									<button
										onClick={() => handleSearch(pagination.currentPage - 1)}
										disabled={pagination.currentPage === 1}
										className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										Previous
									</button>

									<div className="min-w-10 h-9 flex items-center justify-center px-3 bg-violet-600 text-white rounded-lg text-sm font-medium">
										{pagination.currentPage}
									</div>

									<button
										onClick={() => handleSearch(pagination.currentPage + 1)}
										disabled={pagination.currentPage === pagination.totalPages}
										className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
									>
										Next
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					/* EMPTY STATE */
					<div className="py-20 text-center">
						<div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
							<Users className="w-7 h-7 text-gray-400" />
						</div>
						<p className="text-gray-700 font-medium mt-4">No managers found</p>
						<p className="text-sm text-gray-400 mt-1">
							Try changing your search or filters.
						</p>
					</div>
				)}
			</div>

			{/* CONFIRMATION MODAL */}
			{selectedManager && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={closeModal}
					/>

					<div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
						<div className="flex items-start gap-4">
							<div
								className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
									modalType === "delete"
										? "bg-red-50"
										: modalType === "deactivate"
											? "bg-amber-50"
											: "bg-green-50"
								}`}
							>
								{modalType === "delete" ? (
									<Trash2 className="w-5 h-5 text-red-600" />
								) : (
									<Power
										className={`w-5 h-5 ${
											modalType === "deactivate"
												? "text-amber-600"
												: "text-green-600"
										}`}
									/>
								)}
							</div>

							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									{modalType === "delete"
										? "Delete Manager?"
										: modalType === "deactivate"
											? "Deactivate Manager?"
											: "Activate Manager?"}
								</h3>

								<p className="text-sm text-gray-500 mt-1">
									{modalType === "delete"
										? `Are you sure you want to delete ${selectedManager.name}? This action cannot be undone.`
										: modalType === "deactivate"
											? `Are you sure you want to deactivate ${selectedManager.name}? They will no longer be able to access the system.`
											: `Are you sure you want to activate ${selectedManager.name}? They will regain access to the system.`}
								</p>
							</div>
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<button
								onClick={closeModal}
								disabled={actionLoading}
								className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								onClick={
									modalType === "delete" ? handleDelete : handleStatusChange
								}
								disabled={actionLoading}
								className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white transition cursor-pointer disabled:opacity-50 ${
									modalType === "delete"
										? "bg-red-600 hover:bg-red-700"
										: modalType === "deactivate"
											? "bg-amber-600 hover:bg-amber-700"
											: "bg-green-600 hover:bg-green-700"
								}`}
							>
								{actionLoading
									? "Processing..."
									: modalType === "delete"
										? "Delete Manager"
										: modalType === "deactivate"
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

export default Managers;
