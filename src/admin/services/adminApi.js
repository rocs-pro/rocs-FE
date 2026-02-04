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
