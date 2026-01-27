import api from "./api";

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/manager/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Sales Data
export const getSalesData = async (period = "weekly") => {
  try {
    const response = await api.get(`/manager/sales?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

// Top Selling Products
export const getTopSellingProducts = async (limit = 5) => {
  try {
    const response = await api.get(`/manager/products/top-selling?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    throw error;
  }
};

// Pending GRNs
export const getPendingGrns = async () => {
  try {
    const response = await api.get("/manager/grns/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending GRNs:", error);
    throw error;
  }
};

// Staff Summary
export const getStaffSummary = async () => {
  try {
    const response = await api.get("/manager/staff/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching staff summary:", error);
    throw error;
  }
};

// Stock Alerts
export const getStockAlerts = async () => {
  try {
    const response = await api.get("/manager/inventory/alerts");
    return response.data;
  } catch (error) {
    console.error("Error fetching stock alerts:", error);
    throw error;
  }
};

// Expiry Alerts
export const getExpiryAlerts = async () => {
  try {
    const response = await api.get("/manager/inventory/expiry-alerts");
    return response.data;
  } catch (error) {
    console.error("Error fetching expiry alerts:", error);
    throw error;
  }
};

// Branch Alerts
export const getBranchAlerts = async () => {
  try {
    const response = await api.get("/manager/alerts");
    return response.data;
  } catch (error) {
    console.error("Error fetching branch alerts:", error);
    throw error;
  }
};

// Approvals
export const getApprovals = async (status = null) => {
  try {
    const query = status ? `?status=${status}` : "";
    const response = await api.get(`/manager/approvals${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approvals:", error);
    throw error;
  }
};

export const updateApprovalStatus = async (approvalId, status) => {
  try {
    const response = await api.patch(`/manager/approvals/${approvalId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating approval status:", error);
    throw error;
  }
};

// Branch Activity Log
export const getBranchActivityLog = async (limit = 20) => {
  try {
    const response = await api.get(`/manager/activity-log?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity log:", error);
    throw error;
  }
};

// Chart of Accounts
export const getChartOfAccounts = async () => {
  try {
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
