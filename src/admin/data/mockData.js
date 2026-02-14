// Dashboard mock data (replace with API calls later)

// ===== Admin overview widgets =====
export const stats = [
  { title: "Total Sales Today", value: "LKR 450,230" },
  { title: "Total Transactions", value: "320" },
  { title: "Total Customers Served", value: "280" },
  { title: "Total Revenue (Month)", value: "LKR 8,200,000" },
];

export const weeklySales = [120, 180, 150, 220, 200, 260, 350];

export const categoryMix = [
  { name: "Grocery", value: 40 },
  { name: "Fresh", value: 25 },
  { name: "Beverages", value: 20 },
  { name: "Household", value: 15 },
];

export const kpiStats = [
  { title: "Today’s Sales", value: "LKR 450,230", abnormal: false, icon: "💰" },
  { title: "Transactions Count", value: "320", abnormal: false, icon: "🧾" },
  { title: "Net Profit", value: "LKR 120,000", abnormal: false, icon: "📈" },
  { title: "Refunds / Voids", value: "12", abnormal: true, icon: "🔄" },
  { title: "Active Branches", value: "3", abnormal: false, icon: "🏪" },
  { title: "Online Terminals", value: "5", abnormal: false, icon: "🖥" },
];

export const alerts = [
  { type: "Low stock items", value: 7, abnormal: true, icon: "🔴" },
  { type: "Offline terminals", value: 2, abnormal: true, icon: "🖥" },
  { type: "Locked users", value: 1, abnormal: true, icon: "👤" },
  { type: "Excessive refunds today", value: 12, abnormal: true, icon: "🚨" },
  { type: "Branches pending activation", value: 1, abnormal: true, icon: "⚠" },
];

export const paymentMethods = [
  { method: "Cash", value: 180 },
  { method: "Card", value: 90 },
  { method: "QR", value: 50 },
];

export const branchSnapshot = [
  { name: "Colombo Main", sales: 250000, terminals: 3, status: "Active" },
  { name: "Kandy", sales: 120000, terminals: 2, status: "Active" },
  { name: "Galle", sales: 80000, terminals: 1, status: "Inactive" },
];

// SKU-level stock alerts (used by widgets)
export const stockAlerts = [
  { item: "Rice 5kg", qty: 3, level: "Critical" },
  { item: "Sugar 1kg", qty: 2, level: "Warning" },
  { item: "Milk Powder", qty: 1, level: "Critical" },
];

// ===== Admin governance data =====

// Branch list (Admin can create/manage branches)
export const branches = [
  { id: "BR-001", name: "Colombo Main", address: "Colombo", status: "Active" },
  { id: "BR-002", name: "Kandy", address: "Kandy", status: "Active" },
  { id: "BR-003", name: "Galle", address: "Galle", status: "Inactive" },
];

// Users are managed via a *Registration* form.
// Default status is "Inactive"; Admin must activate the user to allow login later.
export const seedUsers = [
  {
    id: "U-001",
    fullName: "John Perera",
    username: "john",
    email: "john@smartretailpro.lk",
    role: "Cashier",
    branch: "Colombo Main",
    status: "Inactive",
    createdAt: "2026-01-08 08:55",
  },
  {
    id: "U-002",
    fullName: "Anne Silva",
    username: "anne",
    email: "anne@smartretailpro.lk",
    role: "Manager",
    branch: "Colombo Main",
    status: "Active",
    createdAt: "2026-01-08 09:05",
  },
  {
    id: "U-003",
    fullName: "Kamal Fernando",
    username: "kamal",
    email: "kamal@smartretailpro.lk",
    role: "Cashier",
    branch: "Kandy",
    status: "Inactive",
    createdAt: "2026-01-08 09:18",
  },
];

// System Activity + Login History are merged into a single list.
// This is the initial seed (the UI writes to localStorage as actions happen).
export const seedActivity = [
  {
    id: "A-001",
    time: "2026-01-08 09:10",
    actor: "admin",
    type: "System",
    action: "Created branch BR-002 (Kandy)",
    severity: "Info",
    branch: "Kandy",
  },
  {
    id: "A-002",
    time: "2026-01-08 09:25",
    actor: "admin",
    type: "Security",
    action: "Reset password for user 'john'",
    severity: "Warning",
    branch: "Colombo Main",
  },
  {
    id: "A-003",
    time: "2026-01-08 10:02",
    actor: "system",
    type: "Security",
    action: "5 failed login attempts detected",
    severity: "Critical",
    branch: "Colombo Main",
  },
  {
    id: "L-001",
    time: "2026-01-09 09:12",
    actor: "john",
    type: "Login",
    action: "Login attempt: Success (POS-01)",
    severity: "Info",
    branch: "Colombo Main",
  },
  {
    id: "L-002",
    time: "2026-01-09 10:05",
    actor: "kamal",
    type: "Login",
    action: "Login attempt: Failed (POS-02)",
    severity: "Warning",
    branch: "Kandy",
  },
  {
    id: "A-004",
    time: "2026-02-04 09:10",
    actor: "admin",
    type: "System",
    action: "Branch Galle activated by Admin",
    severity: "Info",
    branch: "Galle",
  },
  {
    id: "A-005",
    time: "2026-02-04 09:12",
    actor: "admin",
    type: "System",
    action: "Price updated for Item #102",
    severity: "Info",
    branch: "Colombo Main",
  },
  {
    id: "A-006",
    time: "2026-02-04 09:15",
    actor: "manager",
    type: "System",
    action: "Refund approved – Bill #8892",
    severity: "Info",
    branch: "Kandy",
  },
  {
    id: "A-007",
    time: "2026-02-04 09:18",
    actor: "system",
    type: "System",
    action: "Terminal T-04 went offline",
    severity: "Warning",
    branch: "Galle",
  },
  {
    id: "A-008",
    time: "2026-02-04 09:20",
    actor: "admin",
    type: "Security",
    action: "User kamal locked due to failed logins",
    severity: "Warning",
    branch: "Kandy",
  },
];
