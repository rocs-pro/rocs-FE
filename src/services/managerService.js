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
export const getBranchActivityLog = async (branchId = 1) => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/activity/recent?branchId=${branchId}`);
    return response.data.data; // ApiResponse wrapper
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

// Registered Users
export const getRegisteredUsers = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`${MANAGER_API_BASE}/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const updateUserActiveStatus = async (userId, isActive) => {
  try {
    const response = await api.patch(`${MANAGER_API_BASE}/users/${userId}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error("Error updating user active status:", error);
    throw error;
  }
};

// Loyalty & Customers
export const getLoyaltyStats = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/customers/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching loyalty stats:", error);
    throw error;
  }
};

export const getLoyaltyCustomers = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/customers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching loyalty customers:", error);
    throw error;
  }
};

export const updateCustomer = async (id, data) => {
  try {
    const response = await api.put(`${MANAGER_API_BASE}/customers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const adjustCustomerPoints = async (id, points, reason) => {
  try {
    const response = await api.post(`${MANAGER_API_BASE}/customers/${id}/adjust-points`, { points, reason });
    return response.data;
  } catch (error) {
    console.error("Error adjusting points:", error);
    throw error;
  }
};

export const getTierRules = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/customers/active-tier-rules`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tier rules:", error);
    throw error;
  }
};

export const updateTierRules = async (rules) => {
  try {
    const response = await api.post(`${MANAGER_API_BASE}/customers/active-tier-rules`, rules);
    return response.data;
  } catch (error) {
    console.error("Error updating tier rules:", error);
    throw error;
  }
};

export const getCustomerSales = async (id) => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/customers/${id}/sales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer sales:", error);
    throw error;
  }
};
