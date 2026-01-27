export const managerStats = [
  { title: "Today's Sales", value: "LKR 214,600", icon: "💰", tone: "primary" },
  { title: "Target Progress", value: "86%", icon: "🎯", tone: "secondary" },
  { title: "Pending GRNs", value: "2 Requests", icon: "🧾", tone: "warning" },
  { title: "Low Stock Alerts", value: "5 SKUs", icon: "⚠️", tone: "danger" },
];

export const salesTarget = {
  targetToday: 250000,
  achievedToday: 214600,
};

// Weekly branch sales (Mon..Sun)
export const managerWeeklySales = [90, 140, 120, 170, 160, 210, 260];

export const topSellingProducts = [
  { name: "Rice 5kg", units: 64, revenue: "LKR 128,000" },
  { name: "Milk Powder 400g", units: 52, revenue: "LKR 78,000" },
  { name: "Cooking Oil 1L", units: 41, revenue: "LKR 61,500" },
  { name: "Sugar 1kg", units: 38, revenue: "LKR 28,500" },
  { name: "Noodles", units: 96, revenue: "LKR 24,000" },
];

export const pendingGrns = [
  { id: "GRN-1021", supplier: "ABC Distributors", items: 14, eta: "Today" },
  { id: "GRN-1022", supplier: "FreshFarm", items: 8, eta: "Tomorrow" },
];

export const staffSummary = [
  { name: "John", role: "Cashier", lastLogin: "2026-01-09 09:12", status: "Active" },
  { name: "Anne", role: "Assistant Manager", lastLogin: "2026-01-09 09:30", status: "Active" },
  { name: "Kamal", role: "Cashier", lastLogin: "2026-01-09 10:05", status: "Offline" },
  { name: "Saman", role: "Store Keeper", lastLogin: "2026-01-09 08:50", status: "Active" },
];

export const branchStockAlerts = [
  { item: "Milk Powder 1kg", qty: 2, level: "Critical" },
  { item: "Tea 400g", qty: 5, level: "Warning" },
  { item: "Bread", qty: 3, level: "Warning" },
  { item: "Eggs", qty: 12, level: "Warning" },
];

export const reorderSuggestions = [
  { item: "Milk Powder 1kg", suggestedQty: 24, supplier: "ABC Distributors" },
  { item: "Tea 400g", suggestedQty: 40, supplier: "Tea Lanka" },
  { item: "Bread", suggestedQty: 60, supplier: "FreshBake" },
];

export const quickActions = [
  { label: "Create GRN Request", to: "/manager/approvals" },
  { label: "View Alerts / Low Stock", to: "/manager" },
  { label: "Sales Reports", to: "/manager/sales-reports" },
  { label: "New Journal Entry", to: "/manager/journal-entry" },
];


// ===== Manager extras (branch operations + accounting) =====
export const branchAlerts = [
  { type: "Info", message: "Cashier shift started: John", time: "2026-01-09 09:12" },
  { type: "Warning", message: "Low stock: Milk Powder 1kg", time: "2026-01-09 09:40" },
  { type: "Critical", message: "Expiry today: Bread", time: "2026-01-09 07:55" },
];

export const expiryAlerts = [
  { item: "Bread", expiresOn: "2026-01-10", qty: 12, severity: "Critical" },
  { item: "Yogurt Cup", expiresOn: "2026-01-12", qty: 18, severity: "Warning" },
  { item: "Fresh Milk 1L", expiresOn: "2026-01-13", qty: 9, severity: "Warning" },
];

export const approvals = [
  { id: "APR-2001", category: "GRN", reference: "GRN-1021", requestedBy: "Store Keeper", time: "2026-01-09 10:20", status: "Pending" },
  { id: "APR-2002", category: "Price Override", reference: "INV-88912", requestedBy: "Cashier", time: "2026-01-09 11:05", status: "Pending" },
  { id: "APR-2003", category: "Return", reference: "RET-771", requestedBy: "Cashier", time: "2026-01-09 11:22", status: "Pending" },
];

export const branchActivityLog = [
  { time: "2026-01-09 09:12", user: "John", action: "Login", details: "Cashier logged in", severity: "Info" },
  { time: "2026-01-09 09:30", user: "Anne", action: "Login", details: "Assistant Manager logged in", severity: "Info" },
  { time: "2026-01-09 10:18", user: "Saman", action: "GRN Request", details: "Created GRN-1021", severity: "Warning" },
  { time: "2026-01-09 10:55", user: "John", action: "Price Override", details: "Requested override for INV-88912", severity: "Warning" },
];

export const chartOfAccounts = [
  { code: "1000", name: "Cash", type: "Asset" },
  { code: "1100", name: "Accounts Receivable", type: "Asset" },
  { code: "2000", name: "Accounts Payable", type: "Liability" },
  { code: "3000", name: "Owner's Equity", type: "Equity" },
  { code: "4000", name: "Sales Revenue", type: "Revenue" },
  { code: "5000", name: "Cost of Goods Sold", type: "Expense" },
  { code: "5100", name: "Salaries Expense", type: "Expense" },
];

export const journalEntries = [
  {
    id: "JE-0011",
    date: "2026-01-09",
    description: "Cash sales (POS)",
    lines: [
      { account: "Cash", dr: 214600, cr: 0 },
      { account: "Sales Revenue", dr: 0, cr: 214600 },
    ],
  },
];

export const profitAndLoss = {
  period: "January 2026 (MTD)",
  revenue: 1250000,
  cogs: 740000,
  grossProfit: 510000,
  expenses: [
    { name: "Salaries", amount: 180000 },
    { name: "Electricity", amount: 45000 },
    { name: "Transport", amount: 35000 },
    { name: "Rent", amount: 60000 },
  ],
};

export const salesReports = [
  { date: "2026-01-03", invoices: 182, revenue: 198000, profit: 41000 },
  { date: "2026-01-04", invoices: 205, revenue: 221500, profit: 46200 },
  { date: "2026-01-05", invoices: 164, revenue: 175900, profit: 35200 },
  { date: "2026-01-06", invoices: 240, revenue: 268400, profit: 59800 },
  { date: "2026-01-07", invoices: 231, revenue: 251100, profit: 53100 },
];
