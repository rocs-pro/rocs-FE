import api from "../../services/api";

// ===== Admin Dashboard API Service =====

/**
 * Get today's total sales across all branches
 */
export const getTodaysSales = async () => {
  const response = await api.get("/admin/dashboard/today-sales");
  return response.data;
};

/**
 * Get user statistics by role
 */
export const getUserStatsByRole = async () => {
  const response = await api.get("/admin/dashboard/user-stats");
  return response.data;
};

/**
 * Get all branches with detailed info
 */
export const getAllBranches = async () => {
  const response = await api.get("/admin/branches");
  return response.data;
};

/**
 * Get branch summary by ID (for modal)
 */
export const getBranchSummary = async (branchId) => {
  const response = await api.get(`/admin/branches/${branchId}/summary`);
  return response.data;
};

/**
 * Search branches by query
 */
export const searchBranches = async (query) => {
  const response = await api.get("/admin/branches/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Get top performing branches by sales
 */
export const getTopBranchesBySales = async () => {
  const response = await api.get("/admin/dashboard/top-branches");
  return response.data;
};

/**
 * Get customer recurrence rate by branch
 */
export const getCustomerRecurrenceByBranch = async () => {
  const response = await api.get("/admin/dashboard/customer-recurrence");
  return response.data;
};

/**
 * Get top performing managers
 */
export const getTopManagers = async () => {
  const response = await api.get("/admin/dashboard/top-managers");
  return response.data;
};

/**
 * Get weekly sales trend
 */
export const getWeeklySalesTrend = async () => {
  const response = await api.get("/admin/dashboard/weekly-trend");
  return response.data;
};

/**
 * Get real-time branch sales (for live updates)
 */
export const getBranchRealTimeSales = async (branchId) => {
  const response = await api.get(`/admin/branches/${branchId}/realtime-sales`);
  return response.data;
};

/**
 * Get dashboard overview stats
 */
export const getDashboardOverview = async () => {
  const response = await api.get("/admin/dashboard/overview");
  return response.data;
};

// ===== User Management API =====

/**
 * Get all users
 */
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

/**
 * Search users by employee ID or name
 */
export const searchUsers = async (query) => {
  const response = await api.get("/admin/users/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Register a new manager (Admin can only register managers)
 */
export const registerManager = async (userData) => {
  const response = await api.post("/admin/users/register-manager", userData);
  return response.data;
};

/**
 * Update user details
 */
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

/**
 * Toggle user status (Active/Inactive)
 */
export const toggleUserStatus = async (userId) => {
  const response = await api.patch(`/admin/users/${userId}/toggle-status`);
  return response.data;
};

// ===== Branch Management API =====

/**
 * Create a new branch
 */
export const createBranch = async (branchData) => {
  const response = await api.post("/admin/branches", branchData);
  return response.data;
};

/**
 * Update branch details
 */
export const updateBranch = async (branchId, branchData) => {
  const response = await api.put(`/admin/branches/${branchId}`, branchData);
  return response.data;
};

/**
 * Delete a branch
 */
export const deleteBranch = async (branchId) => {
  const response = await api.delete(`/admin/branches/${branchId}`);
  return response.data;
};

/**
 * Toggle branch status (Active/Inactive)
 */
export const toggleBranchStatus = async (branchId) => {
  const response = await api.patch(`/admin/branches/${branchId}/toggle-status`);
  return response.data;
};

/**
 * Get managers list (for branch assignment)
 */
export const getManagers = async () => {
  const response = await api.get("/admin/users/managers");
  return response.data;
};

/**
 * Get users by branch
 */
export const getUsersByBranch = async (branchId) => {
  const response = await api.get(`/admin/branches/${branchId}/users`);
  return response.data;
};

// ===== Terminal Management API =====

/**
 * Get all terminals
 */
export const getAllTerminals = async () => {
  const response = await api.get("/admin/terminals");
  return response.data;
};

/**
 * Search terminals
 */
export const searchTerminals = async (query) => {
  const response = await api.get("/admin/terminals/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Create a new terminal
 */
export const createTerminal = async (terminalData) => {
  const response = await api.post("/admin/terminals", terminalData);
  return response.data;
};

/**
 * Update terminal details
 */
export const updateTerminal = async (terminalId, terminalData) => {
  const response = await api.put(`/admin/terminals/${terminalId}`, terminalData);
  return response.data;
};

/**
 * Delete a terminal
 */
export const deleteTerminal = async (terminalId) => {
  const response = await api.delete(`/admin/terminals/${terminalId}`);
  return response.data;
};

/**
 * Toggle terminal status (Active/Inactive)
 */
export const toggleTerminalStatus = async (terminalId) => {
  const response = await api.patch(`/admin/terminals/${terminalId}/toggle-status`);
  return response.data;
};

/**
 * Get terminal by ID
 */
export const getTerminalById = async (terminalId) => {
  const response = await api.get(`/admin/terminals/${terminalId}`);
  return response.data;
};

// ===== System Activity Log API =====

/**
 * Get all activity logs
 */
export const getActivityLogs = async (filters = {}) => {
  const response = await api.get("/admin/activity-logs", { params: filters });
  return response.data;
};

/**
 * Search activity logs
 */
export const searchActivityLogs = async (query, filters = {}) => {
  const response = await api.get("/admin/activity-logs/search", {
    params: { q: query, ...filters },
  });
  return response.data;
};

// ===== Password Reset API =====

/**
 * Get user for password reset
 */
export const getUserForPasswordReset = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/password-info`);
  return response.data;
};

/**
 * Issue password reset for a user
 */
export const issuePasswordReset = async (userId, tempPassword) => {
  const response = await api.post(`/admin/users/${userId}/password-reset`, {
    tempPassword,
  });
  return response.data;
};

/**
 * Generate temporary password (server-side)
 */
export const generateTempPassword = async () => {
  const response = await api.get("/admin/users/generate-temp-password");
  return response.data;
};
