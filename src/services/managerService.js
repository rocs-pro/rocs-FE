import api from "./api";

const MANAGER_API_BASE = "http://localhost:8080/api/v1/manager";

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Sales Data
export const getSalesData = async (period = "weekly") => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/sales?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

// Top Selling Products
export const getTopSellingProducts = async (limit = 5) => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/products/top-selling?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
};

// Pending GRNs
export const getPendingGrns = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/grns/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending GRNs:", error);
    throw error;
  }
};

// Staff Summary
export const getStaffSummary = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/staff/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff summary:", error);
    throw error;
  }
};

// Stock Alerts
export const getStockAlerts = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/inventory/alerts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock alerts:", error);
    throw error;
  }
};

// Expiry Alerts
export const getExpiryAlerts = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/inventory/expiry-alerts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expiry alerts:", error);
    throw error;
  }
};

// Branch Alerts
export const getBranchAlerts = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/alerts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching branch alerts:", error);
    throw error;
  }
};

// Approvals (Generic)
export const getApprovals = async (status = null) => {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await api.get(`${MANAGER_API_BASE}/approvals${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approvals:", error);
    throw error;
  }
};

export const updateApprovalStatus = async (approvalId, status, notes = "", role = null) => {
  try {
    const response = await api.patch(`${MANAGER_API_BASE}/approvals/${approvalId}`, { status, notes, role });
    return response.data;
  } catch (error) {
    console.error("Error updating approval status:", error);
    throw error;
  }
};

// Branch Activity Log
export const getBranchActivityLog = async (limit = 20) => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/activity-log?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity log:", error);
    throw error;
  }
};

// Chart of Accounts
export const getChartOfAccounts = async () => {
  try {
    // Keeping original path if not specified in ManagerController, or assuming it's under accounting
    const response = await api.get("/accounting/chart-of-accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching chart of accounts:", error);
    throw error;
  }
};

// Journal Entries
export const getJournalEntries = async (limit = 10) => {
  try {
    const response = await api.get(`/accounting/journal-entries?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    throw error;
  }
};

export const createJournalEntry = async (entryData) => {
  try {
    const response = await api.post("/accounting/journal-entries", entryData);
    return response.data;
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw error;
  }
};

// Profit & Loss Report
export const getProfitAndLoss = async (period = "monthly") => {
  try {
    const response = await api.get(`/accounting/profit-loss?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching P&L report:", error);
    throw error;
  }
};

// Sales Reports
export const getSalesReports = async (filters = {}) => {
  try {
    const response = await api.get("/reports/sales", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    throw error;
  }
};

// User Registration Approvals - MAPPED TO /approvals
export const getUserRegistrations = async (status = "PENDING") => {
  try {
    // Using the generic approvals endpoint which handles registration requests
    const response = await api.get(`${MANAGER_API_BASE}/approvals?status=${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }
};

export const updateRegistrationStatus = async (registrationId, status, role) => {
  try {
    // Maps to the generic approval update
    const response = await api.patch(`${MANAGER_API_BASE}/approvals/${registrationId}`, {
      status,
      role,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating registration status:", error);
    throw error;
  }
};

export const getRegisteredUsers = async () => {
  try {
    // Assuming this might be separate or handled elsewhere, but leaving as is relative to base or updating if I knew the endpoint.
    // The ManagerController didn't show /users. I will guess it is /api/v1/manager/users if existing was /manager/users
    // But since it wasn't in the provided snippet, I'll try to stick to the pattern or leave it if it's hitting a different controller.
    // Just to be safe, I'll assume it's NOT in this controller if not shown.
    // However, usually "User Management" is manager stuff.
    // PROPOSAL: Use the same base if possible, or fallback to the old path if not sure. 
    // I'll keep the old path for getRegisteredUsers unless I see it failed. 
    // OLD: /manager/users (base /api/inventory) = /api/inventory/manager/users
    // If I change it to `http://localhost:8080/api/v1/manager/users`, it might work.
    // I will try to use the generic API for this one for now to avoid breaking if it's in UserController.
    const response = await api.get("/manager/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`/manager/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const updateUserActiveStatus = async (userId, isActive) => {
  try {
    const response = await api.patch(`/manager/users/${userId}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error("Error updating user active status:", error);
    throw error;
  }
};
