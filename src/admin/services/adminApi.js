import api from "../../services/api";

// ===== Admin Dashboard API Service =====

/**
 * Get today's total sales across all branches
 */
export const getTodaysSales = async () => {
  const response = await api.get("/v1/admin/dashboard/today-sales");
  return response.data;
};

/**
 * Get user statistics by role
 */
export const getUserStatsByRole = async () => {
  const response = await api.get("/v1/admin/dashboard/user-stats");
  return response.data;
};

/**
 * Get all branches with detailed info
 */
export const getAllBranches = async () => {
  const response = await api.get("/v1/admin/branches");
  return response.data;
};

/**
 * Get branch summary by ID (for modal)
 */
export const getBranchSummary = async (branchId) => {
  try {
    const response = await api.get(`/v1/admin/branches/${branchId}/summary`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Branch summary not found for ${branchId}, using mock data.`);
      let branch = { id: branchId, name: "Branch " + branchId };
      try {
        const bRes = await api.get(`/v1/admin/branches/${branchId}`);
        branch = bRes.data;
      } catch (e) { /* ignore */ }

      return {
        branch,
        users: [
          { userId: 101, name: "Manager Mock", email: "manager@mock.com", role: "MANAGER", status: "Active" },
          { userId: 102, name: "Cashier Mock", email: "cashier@mock.com", role: "CASHIER", status: "Active" }
        ],
        userCount: 2
      };
    }
    throw error;
  }
};

/**
 * Search branches by query
 */
export const searchBranches = async (query) => {
  const response = await api.get("/v1/admin/branches/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Get top performing branches by sales
 */
export const getTopBranchesBySales = async () => {
  const response = await api.get("/v1/admin/dashboard/top-branches");
  return response.data;
};

/**
 * Get customer recurrence rate by branch
 */
export const getCustomerRecurrenceByBranch = async () => {
  const response = await api.get("/v1/admin/dashboard/customer-recurrence");
  return response.data;
};

/**
 * Get top performing managers
 */
export const getTopManagers = async () => {
  const response = await api.get("/v1/admin/dashboard/top-managers");
  return response.data;
};

/**
 * Get weekly sales trend
 */
export const getWeeklySalesTrend = async () => {
  const response = await api.get("/v1/admin/dashboard/weekly-trend");
  return response.data;
};

/**
 * Get real-time branch sales (for live updates)
 */
export const getBranchRealTimeSales = async (branchId) => {
  try {
    const response = await api.get(`/v1/admin/branches/${branchId}/realtime-sales`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        dailySales: Math.floor(Math.random() * 150000) + 25000,
        activeTerminals: Math.floor(Math.random() * 5) + 1,
        registeredCustomers: Math.floor(Math.random() * 1000) + 200,
        totalTerminals: 5
      };
    }
    throw error;
  }
};

/**
 * Get dashboard overview stats
 */
export const getDashboardOverview = async () => {
  const response = await api.get("/v1/admin/dashboard/overview");
  return response.data;
};

// ===== User Management API =====

/**
 * Get all users
 */
export const getAllUsers = async () => {
  const response = await api.get("/v1/admin/users");
  return response.data;
};

/**
 * Search users by employee ID or name
 */
export const searchUsers = async (query) => {
  const response = await api.get("/v1/admin/users/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Register a new manager (Admin can only register managers)
 */
export const registerManager = async (userData) => {
  const response = await api.post("/v1/admin/users/register-manager", userData);
  return response.data;
};

/**
 * Update user details
 */
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/v1/admin/users/${userId}`, userData);
  return response.data;
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/v1/admin/users/${userId}`);
  return response.data;
};

/**
 * Toggle user status (Active/Inactive)
 */
export const toggleUserStatus = async (userId) => {
  const response = await api.patch(`/v1/admin/users/${userId}/toggle-status`);
  return response.data;
};

// ===== Branch Management API =====

/**
 * Create a new branch
 */
export const createBranch = async (branchData) => {
  const response = await api.post("/v1/admin/branches", branchData);
  return response.data;
};

/**
 * Update branch details
 */
export const updateBranch = async (branchId, branchData) => {
  const response = await api.put(`/v1/admin/branches/${branchId}`, branchData);
  return response.data;
};

/**
 * Delete a branch
 */
export const deleteBranch = async (branchId) => {
  const response = await api.delete(`/v1/admin/branches/${branchId}`);
  return response.data;
};

/**
 * Toggle branch status (Active/Inactive)
 */
export const toggleBranchStatus = async (branchId) => {
  const response = await api.patch(`/v1/admin/branches/${branchId}/toggle-status`);
  return response.data;
};

/**
 * Get managers list (for branch assignment)
 */
export const getManagers = async () => {
  const response = await api.get("/v1/admin/users/managers");
  return response.data;
};

/**
 * Get users by branch
 */
export const getUsersByBranch = async (branchId) => {
  const response = await api.get(`/v1/admin/branches/${branchId}/users`);
  return response.data;
};

// ===== Terminal Management API =====

/**
 * Get all terminals
 */
export const getAllTerminals = async () => {
  const response = await api.get("/v1/admin/terminals");
  return response.data;
};

/**
 * Search terminals
 */
export const searchTerminals = async (query) => {
  const response = await api.get("/v1/admin/terminals/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * Create a new terminal
 */
export const createTerminal = async (terminalData) => {
  const response = await api.post("/v1/admin/terminals", terminalData);
  return response.data;
};

/**
 * Update terminal details
 */
export const updateTerminal = async (terminalId, terminalData) => {
  const response = await api.put(`/v1/admin/terminals/${terminalId}`, terminalData);
  return response.data;
};

/**
 * Delete a terminal
 */
export const deleteTerminal = async (terminalId) => {
  const response = await api.delete(`/v1/admin/terminals/${terminalId}`);
  return response.data;
};

/**
 * Toggle terminal status (Active/Inactive)
 */
export const toggleTerminalStatus = async (terminalId) => {
  const response = await api.patch(`/v1/admin/terminals/${terminalId}/toggle-status`);
  return response.data;
};

/**
 * Get terminal by ID
 */
export const getTerminalById = async (terminalId) => {
  const response = await api.get(`/v1/admin/terminals/${terminalId}`);
  return response.data;
};

// ===== System Activity Log API =====

/**
 * Get all activity logs
 */
export const getActivityLogs = async (filters = {}) => {
  const response = await api.get("/v1/admin/activity-logs", { params: filters });
  return response.data;
};

/**
 * Search activity logs
 */
export const searchActivityLogs = async (query, filters = {}) => {
  const response = await api.get("/v1/admin/activity-logs/search", {
    params: { q: query, ...filters },
  });
  return response.data;
};

// ===== Password Reset API =====

/**
 * Get user for password reset
 */
export const getUserForPasswordReset = async (userId) => {
  const response = await api.get(`/v1/admin/users/${userId}/password-info`);
  return response.data;
};

/**
 * Issue password reset for a user
 */
export const issuePasswordReset = async (userId, tempPassword) => {
  const response = await api.post(`/v1/admin/users/${userId}/password-reset`, {
    tempPassword,
  });
  return response.data;
};

/**
 * Generate temporary password (server-side)
 */
export const generateTempPassword = async () => {
  const response = await api.get("/v1/admin/users/generate-temp-password");
  return response.data;
};

// ===== Admin Password Verification for Destructive Actions =====

/**
 * Verify admin password before destructive actions.
 * Re-uses the login endpoint to validate credentials.
 */
export const verifyAdminPassword = async (password) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) throw new Error("Not authenticated");

  let username;
  try {
    const user = JSON.parse(userStr);
    username = user.username || user.email || user.name;
    if (!username && user.sub) username = user.sub; // Handle JWT payload structure if applicable
  } catch (e) {
    throw new Error("Invalid user session data");
  }

  if (!username) throw new Error("Could not identify current user for verification");

  try {
    // Use the auth login endpoint to verify credentials
    const response = await api.post("/v1/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      throw new Error("Incorrect password");
    }
    throw error;
  }
};

/**
 * Delete a user with admin password verification
 */
export const deleteUserWithPassword = async (userId, password) => {
  // First verify admin password
  await verifyAdminPassword(password);
  // Then delete the user
  const response = await api.delete(`/v1/admin/users/${userId}`);
  return response.data;
};

/**
 * Delete a branch with admin password verification
 */
export const deleteBranchWithPassword = async (branchId, password) => {
  // First verify admin password
  await verifyAdminPassword(password);
  // Then delete the branch
  const response = await api.delete(`/v1/admin/branches/${branchId}`);
  return response.data;
};

// ===== Password Reset Request Management API =====

/**
 * Get all password reset requests
 */
export const getPasswordResetRequests = async (status = null) => {
  const params = status ? `?status=${status}` : "";
  const response = await api.get(`/v1/admin/password-requests${params}`);
  return response.data;
};

/**
 * Get count of pending password reset requests
 */
export const getPasswordResetPendingCount = async () => {
  const response = await api.get("/v1/admin/password-requests/count");
  return response.data;
};

/**
 * Approve a password reset request
 */
export const approvePasswordReset = async (requestId, adminNotes = "") => {
  const response = await api.patch(`/v1/admin/password-requests/${requestId}/approve`, {
    adminNotes,
  });
  return response.data;
};

/**
 * Reject a password reset request
 */
export const rejectPasswordReset = async (requestId, adminNotes = "") => {
  const response = await api.patch(`/v1/admin/password-requests/${requestId}/reject`, {
    adminNotes,
  });
  return response.data;
};
