import api from "./api";

const MANAGER_API_BASE = "http://localhost:8080/api/v1/manager";
const ACCOUNTING_API_BASE = "http://localhost:8080/api/v1/accounting";
const REPORTS_API_BASE = "http://localhost:8080/api/v1/reports";

// Helper: get current logged-in user's branchId
function getMyBranchId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.branchId || null;
  } catch (e) {
    return null;
  }
}

// ============================================
// DASHBOARD & STATISTICS
// ============================================

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

// ============================================
// SALES & TRANSACTIONS
// ============================================

// Sales Data with Period
export const getSalesData = async (period = "weekly") => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/sales?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

// Detailed Sales Analytics
export const getSalesAnalytics = async (period = "daily") => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/sales/analytics?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    throw error;
  }
};

// Recent Transactions
export const getRecentTransactions = async (limit = 20) => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/sales/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    throw error;
  }
};

// Payment Method Breakdown
export const getPaymentBreakdown = async (period = "daily") => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/sales/payment-breakdown?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment breakdown:", error);
    throw error;
  }
};

// Hourly Sales Data
export const getHourlySales = async (date = null) => {
  try {
    const params = date ? `?date=${date}` : '';
    const response = await api.get(`${MANAGER_API_BASE}/sales/hourly${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hourly sales:", error);
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

// ============================================
// SALES REPORTS
// ============================================

// Sales Reports with Date Range
export const getSalesReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const response = await api.get(`${MANAGER_API_BASE}/reports/sales?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    throw error;
  }
};

// Sales Reports by Terminal
export const getSalesSummaryByTerminal = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    const response = await api.get(`${MANAGER_API_BASE}/reports/sales/summary-by-terminal?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales summary by terminal:", error);
    throw error;
  }
};


// Product Performance Report
export const getProductPerformanceReport = async (filters = {}) => {
  try {
    const response = await api.get(`${REPORTS_API_BASE}/products/performance`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching product performance:", error);
    throw error;
  }
};

// Cashier Performance Report
export const getCashierPerformanceReport = async (filters = {}) => {
  try {
    const response = await api.get(`${REPORTS_API_BASE}/cashiers/performance`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching cashier performance:", error);
    throw error;
  }
};

// ============================================
// INVENTORY & GRN
// ============================================

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

// ============================================
// STAFF & USERS
// ============================================

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

// ============================================
// APPROVALS
// ============================================

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

// User Registration Approvals
export const getUserRegistrations = async (status = "PENDING") => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/approvals?status=${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }
};

export const updateRegistrationStatus = async (registrationId, status, role) => {
  try {
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

// Export Approval History PDF
export const getApprovalHistoryPdf = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/reports/approvals/pdf`, {
      responseType: 'blob', // Important for binary data
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

export const getSalesReportsPdf = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`${MANAGER_API_BASE}/reports/sales/pdf?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading sales report PDF:", error);
    throw error;
  }
};

export const getBranchActivityLogPdf = async (limit = 100) => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/reports/activity-log/pdf?limit=${limit}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading activity log PDF:", error);
    throw error;
  }
};

export const getLoyaltyCustomersPdf = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/reports/loyalty/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading loyalty customers PDF:", error);
    throw error;
  }
};

export const getGrnListPdf = async () => {
  try {
    const response = await api.get(`${MANAGER_API_BASE}/reports/grns/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading GRN list PDF:", error);
    throw error;
  }
};

// ============================================
// BRANCH ACTIVITY LOG
// ============================================

// Branch Activity Log with filters
export const getBranchActivityLog = async (branchId = null, filters = {}) => {
  try {
    const params = new URLSearchParams();
    const bid = branchId || getMyBranchId() || 1;
    params.append('branchId', bid);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.type) params.append('type', filters.type);
    if (filters.date) params.append('date', filters.date);
    if (filters.userId) params.append('userId', filters.userId);

    const response = await api.get(`${MANAGER_API_BASE}/activity/recent?${params}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching activity log:", error);
    throw error;
  }
};

// Activity Statistics
export const getActivityStats = async (branchId = null) => {
  try {
    const bid = branchId || getMyBranchId() || 1;
    const response = await api.get(`${MANAGER_API_BASE}/activity/stats?branchId=${bid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    throw error;
  }
};

// ============================================
// ACCOUNTING - CHART OF ACCOUNTS
// ============================================

// Get Chart of Accounts
export const getChartOfAccounts = async () => {
  try {
    const response = await api.get(`${ACCOUNTING_API_BASE}/chart-of-accounts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chart of accounts:", error);
    throw error;
  }
};

// Create Account
export const createAccount = async (accountData) => {
  try {
    const response = await api.post(`${ACCOUNTING_API_BASE}/accounts`, accountData);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

// Update Account
export const updateAccount = async (accountId, accountData) => {
  try {
    const response = await api.put(`${ACCOUNTING_API_BASE}/accounts/${accountId}`, accountData);
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

// Delete Account
export const deleteAccount = async (accountId) => {
  try {
    const response = await api.delete(`${ACCOUNTING_API_BASE}/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

// ============================================
// ACCOUNTING - JOURNAL ENTRIES
// ============================================

// Get Journal Entries with filters
export const getJournalEntries = async (filters = {}) => {
  try {
    const response = await api.get(`${ACCOUNTING_API_BASE}/journal-entries`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    throw error;
  }
};

// Get Single Journal Entry
export const getJournalEntry = async (entryId) => {
  try {
    const response = await api.get(`${ACCOUNTING_API_BASE}/journal-entries/${entryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    throw error;
  }
};

// Create Journal Entry
export const createJournalEntry = async (entryData) => {
  try {
    const response = await api.post(`${ACCOUNTING_API_BASE}/journal-entries`, entryData);
    return response.data;
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw error;
  }
};

// Update Journal Entry (Draft only)
export const updateJournalEntry = async (entryId, entryData) => {
  try {
    const response = await api.put(`${ACCOUNTING_API_BASE}/journal-entries/${entryId}`, entryData);
    return response.data;
  } catch (error) {
    console.error("Error updating journal entry:", error);
    throw error;
  }
};

// Post Journal Entry
export const postJournalEntry = async (entryId) => {
  try {
    const response = await api.post(`${ACCOUNTING_API_BASE}/journal-entries/${entryId}/post`);
    return response.data;
  } catch (error) {
    console.error("Error posting journal entry:", error);
    throw error;
  }
};

// Void Journal Entry
export const voidJournalEntry = async (entryId, reason) => {
  try {
    const response = await api.post(`${ACCOUNTING_API_BASE}/journal-entries/${entryId}/void`, { reason });
    return response.data;
  } catch (error) {
    console.error("Error voiding journal entry:", error);
    throw error;
  }
};

// ============================================
// ACCOUNTING - PROFIT & LOSS
// ============================================

// Get Profit & Loss Report
export const getProfitAndLoss = async (period = "monthly", dateRange = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    if (dateRange.from) params.append('from', dateRange.from);
    if (dateRange.to) params.append('to', dateRange.to);

    const response = await api.get(`${ACCOUNTING_API_BASE}/profit-loss?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching P&L report:", error);
    throw error;
  }
};

// Get P&L Comparison (vs previous period)
export const getPLComparison = async (period = "monthly") => {
  try {
    const response = await api.get(`${ACCOUNTING_API_BASE}/profit-loss/comparison?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching P&L comparison:", error);
    throw error;
  }
};

// Get Balance Sheet
export const getBalanceSheet = async (asOfDate = null) => {
  try {
    const params = asOfDate ? `?asOfDate=${asOfDate}` : '';
    const response = await api.get(`${ACCOUNTING_API_BASE}/balance-sheet${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching balance sheet:", error);
    throw error;
  }
};

// ============================================
// LOYALTY & CUSTOMERS
// ============================================

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
