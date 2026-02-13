import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Eye, MoreVertical, Edit, Trash2, Power, User, Search, Loader2, UserPlus } from "lucide-react";
import {
    getAllUsers,
    searchUsers,
    registerManager,
    updateUser,
    deleteUserWithPassword,
    toggleUserStatus,
    getAllBranches,
} from "../services/adminApi";
import AdminPasswordModal from "../components/AdminPasswordModal";

export default function Users() {
    const [users, setUsersState] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form fields for Manager Registration
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [branch, setBranch] = useState("");

    // Search and UI state
    const [q, setQ] = useState("");
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [submitting, setSubmitting] = useState(false);
    const dropdownButtonRefs = useRef({});
    const searchTimeoutRef = useRef(null);

    // Delete confirmation with password
    const [deleteModal, setDeleteModal] = useState({ open: false, userId: null, userName: '' });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const toggleDropdown = (id) => {
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            const button = dropdownButtonRefs.current[id];
            if (button) {
                const rect = button.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX - 120
                });
            }
            setActiveDropdown(id);
        }
    };

    // Fetch users and branches on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [usersData, branchesData] = await Promise.all([
                    getAllUsers(),
                    getAllBranches(),
                ]);
                setUsersState(usersData || []);
                setBranches(branchesData || []);
                if (branchesData?.length > 0) {
                    // Do not auto-select branch
                    setBranch("");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Handle search with debounce - search by employee ID or name
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!q.trim()) {
            // If search is empty, fetch all users
            const fetchAllUsers = async () => {
                try {
                    const data = await getAllUsers();
                    setUsersState(data || []);
                } catch (err) {
                    console.error("Error fetching users:", err);
                }
            };
            fetchAllUsers();
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                setSearchLoading(true);
                const data = await searchUsers(q.trim());
                setUsersState(data || []);
            } catch (err) {
                console.error("Error searching users:", err);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [q]);

    function resetForm() {
        setFullName("");
        setUsername("");
        setEmail("");
        setEmployeeId("");
        // BranchDTO uses 'id'
        setBranch("");
        setEditUser(null);
    }

    function handleEditUser(user) {
        setEditUser(user);
        setFullName(user.fullName || user.full_name || "");
        setUsername(user.username || "");
        setEmail(user.email || "");
        setEmployeeId(user.employeeId || user.employee_id || "");
        // UserProfile has 'branch' object with 'branchId'. Logic: user.branch.branchId OR user.branchId (if flat)
        const bId = user.branch?.branchId || user.branch?.id || user.branchId || user.branch_id || "";
        setBranch(bId);
        setActiveDropdown(null);
    }

    async function handleSaveEdit(e) {
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) return alert("Full name and email are required");

        try {
            setSubmitting(true);
            const userId = editUser.userId || editUser.user_id || editUser.id;
            await updateUser(userId, {
                fullName: fullName.trim(),
                email: email.trim(),
                employeeId: employeeId.trim(),
                branchId: branch,
            });

            // Refresh users list
            const data = await getAllUsers();
            setUsersState(data || []);
            resetForm();
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    function handleDeleteUser(userId) {
        const user = users.find(u => (u.userId || u.id) === userId);
        setDeleteModal({ open: true, userId, userName: user?.fullName || user?.username || 'this user' });
        setActiveDropdown(null);
    }

    async function confirmDeleteUser(password) {
        try {
            setDeleteLoading(true);
            await deleteUserWithPassword(deleteModal.userId, password);
            const data = await getAllUsers();
            setUsersState(data || []);
            setDeleteModal({ open: false, userId: null, userName: '' });
        } catch (err) {
            console.error("Error deleting user:", err);
            alert(err?.response?.data?.message || err.message || "Incorrect password or failed to delete user.");
        } finally {
            setDeleteLoading(false);
        }
    }

    // Admin can only register Managers
    async function onRegisterManager(e) {
        e.preventDefault();
        const fn = fullName.trim();
        const un = username.trim();
        const em = email.trim();
        const empId = employeeId.trim();

        if (!fn || !un || !em) {
            alert("Full name, username and email are required.");
            return;
        }

        try {
            setSubmitting(true);
            await registerManager({
                fullName: fn,
                username: un,
                email: em,
                employeeId: empId,
                branchId: branch || null, // Use selected branch ID (or null)
                role: "BRANCH_MANAGER", // Admin can only register managers
                status: "ACTIVE", // default
            });

            // Refresh users list
            const data = await getAllUsers();
            setUsersState(data || []);
            resetForm();
        } catch (err) {
            console.error("Error registering manager:", err);
            const msg = err.response?.data?.message || err.message || "Unknown error";

            if (msg.toLowerCase().includes("username")) {
                alert("Username already exists. Please choose another.");
            } else if (msg.toLowerCase().includes("employee")) {
                alert("Employee ID already exists. Please use a different ID.");
            } else if (msg.toLowerCase().includes("email")) {
                alert("Email already exists. Please use a different email address.");
            } else {
                alert(`Failed to register manager: ${msg}`);
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleToggleStatus(userId) {
        try {
            await toggleUserStatus(userId);
            // Refresh users list
            const data = await getAllUsers();
            setUsersState(data || []);
            setActiveDropdown(null);
        } catch (err) {
            console.error("Error toggling status:", err);
            alert("Failed to update user status. Please try again.");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                {error}
            </div>
        );
    }

    const getUserId = (u) => u.userId || u.user_id || u.id;
    const getUserStatus = (u) => u.accountStatus || u.account_status || u.status || "INACTIVE";
    const isActive = (status) => status === "ACTIVE" || status === "Active";

    return (
        <div className="space-y-4" onClick={() => setActiveDropdown(null)}>
            <div>
                <h1 className="text-xl font-extrabold">User Management</h1>
                <p className="text-sm text-brand-muted">
                    Admin can register <span className="font-bold">Managers only</span>. New managers are created as <span className="font-bold">Active</span>. Search any user by Employee ID or Name.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Manager Registration Form */}
                <div className={`lg:col-span-1 bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${editUser ? 'border-blue-400 ring-2 ring-blue-100' : 'border-brand-border'}`}>
                    {editUser && (
                        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                            <Edit size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Editing: {editUser.fullName || editUser.full_name}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <UserPlus size={18} className="text-brand-primary" />
                            <span className="font-bold">{editUser ? "Edit User" : "Register New Manager"}</span>
                        </div>
                        {editUser && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    <form onSubmit={editUser ? handleSaveEdit : onRegisterManager} className="space-y-3">
                        <div>
                            <label className="text-sm font-bold">Full Name</label>
                            <input
                                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g., Nimal Perera"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Username</label>
                            <input
                                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-gray-100 disabled:text-gray-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g., nimal"
                                disabled={!!editUser}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Employee ID</label>
                            <input
                                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="e.g., EMP001"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g., nimal@smartretailpro.lk"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold">Branch</label>
                            <select
                                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                            >
                                <option value="">Select Branch (Optional)</option>
                                {branches.map((b) => (
                                    <option key={b.id || b.branchId || b.branch_id} value={b.id || b.branchId || b.branch_id}>
                                        {b.name || b.branchName || b.branch_name}
                                    </option>
                                ))}
                            </select>
                        </div>



                        {!editUser && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                                <p className="text-xs text-indigo-700">
                                    <span className="font-bold">Role:</span> Manager (Admin can only register Managers)
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {editUser ? "Save Changes" : "Register Manager"}
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl shadow-sm overflow-visible">
                    <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="font-bold">All Users</div>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by Employee ID or Name..."
                                className="w-full sm:w-80 pl-9 pr-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                            />
                            {searchLoading && (
                                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="text-left p-3">User</th>
                                    <th className="text-left p-3">Employee ID</th>
                                    <th className="text-left p-3">Role</th>
                                    <th className="text-left p-3">Branch</th>
                                    <th className="text-center p-3">Status</th>
                                    <th className="text-right p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => {
                                    const userId = getUserId(u);
                                    const status = getUserStatus(u);
                                    return (
                                        <tr key={userId} className="border-t hover:bg-slate-50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                                                        <User size={18} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">{u.fullName || u.full_name}</span>
                                                        <span className="text-xs text-gray-500">@{u.username} • {u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 font-mono text-gray-600">{u.employeeId || u.employee_id || "-"}</td>
                                            <td className="p-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${(u.role || "").toUpperCase() === "MANAGER" || (u.role || "").toUpperCase() === "BRANCH_MANAGER" ? "bg-purple-100 text-purple-700" :
                                                    (u.role || "").toUpperCase() === "CASHIER" ? "bg-blue-100 text-blue-700" :
                                                        (u.role || "").toUpperCase() === "ADMIN" ? "bg-red-100 text-red-700" :
                                                            "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {u.role || "N/A"}
                                                </span>
                                            </td>
                                            <td className="p-3">{u.branch?.name || u.branchName || u.branch_name || "-"}</td>
                                            <td className="p-3 text-center">
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${isActive(status)
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right relative">
                                                <button
                                                    ref={(el) => (dropdownButtonRefs.current[userId] = el)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleDropdown(userId);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-6 text-center text-brand-muted">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dropdown Portal */}
            {activeDropdown &&
                createPortal(
                    <div
                        className="fixed bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px] z-[200]"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                const user = users.find((u) => getUserId(u) === activeDropdown);
                                setSelectedUser(user);
                                setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Eye size={16} className="text-gray-500" />
                            View Details
                        </button>
                        <button
                            onClick={() => handleEditUser(users.find((u) => getUserId(u) === activeDropdown))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Edit size={16} className="text-blue-500" />
                            Edit User
                        </button>
                        <button
                            onClick={() => {
                                handleToggleStatus(activeDropdown);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Power size={16} className="text-orange-500" />
                            {isActive(getUserStatus(users.find((u) => getUserId(u) === activeDropdown)))
                                ? "Deactivate"
                                : "Activate"}
                        </button>
                        <button
                            onClick={() => handleDeleteUser(activeDropdown)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                            <Trash2 size={16} />
                            Delete User
                        </button>
                    </div>,
                    document.body
                )}

            {/* View Details Modal */}
            {selectedUser &&
                createPortal(
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300]">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">User Details</h3>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{selectedUser.fullName || selectedUser.full_name}</div>
                                        <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <div className="text-gray-500 text-xs">Employee ID</div>
                                        <div className="font-medium font-mono">{selectedUser.employeeId || selectedUser.employee_id || "-"}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <div className="text-gray-500 text-xs">Email</div>
                                        <div className="font-medium truncate">{selectedUser.email}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <div className="text-gray-500 text-xs">Role</div>
                                        <div className="font-medium">{selectedUser.role}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <div className="text-gray-500 text-xs">Branch</div>
                                        <div className="font-medium">{selectedUser.branch?.name || selectedUser.branchName || selectedUser.branch_name || "-"}</div>
                                    </div>
                                    <div className="col-span-2 bg-gray-50 p-3 rounded-xl">
                                        <div className="text-gray-500 text-xs">Status</div>
                                        <div className={`font-medium ${isActive(getUserStatus(selectedUser)) ? "text-green-600" : "text-red-600"
                                            }`}>
                                            {getUserStatus(selectedUser)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full mt-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
            {/* Admin Password Confirmation Modal for Deleting Users */}
            <AdminPasswordModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, userId: null, userName: '' })}
                onConfirm={confirmDeleteUser}
                actionLabel={`Delete user "${deleteModal.userName}"`}
                loading={deleteLoading}
            />
        </div>
    );
}
