// Dashboard mock data (replace with API calls later)

// ===== Admin overview widgets =====
export const stats = [
  { title: "Today's Sales", value: "LKR 450,230" },
  { title: "Pending GRNs", value: "3 Orders" },
  { title: "Low Stock Alerts", value: "12 SKUs" },
  { title: "Active Staff", value: "8 / 10" },
];

export const weeklySales = [120, 180, 150, 220, 200, 260, 350];

export const categoryMix = [
  { name: "Grocery", value: 40 },
  { name: "Fresh", value: 25 },
  { name: "Beverages", value: 20 },
  { name: "Household", value: 15 },
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
  },
  {
    id: "A-002",
    time: "2026-01-08 09:25",
    actor: "admin",
    type: "Security",
    action: "Reset password for user 'john'",
    severity: "Warning",
  },
  {
    id: "A-003",
    time: "2026-01-08 10:02",
    actor: "system",
    type: "Security",
    action: "5 failed login attempts detected",
    severity: "Critical",
  },
  {
    id: "L-001",
    time: "2026-01-09 09:12",
    actor: "john",
    type: "Login",
    action: "Login attempt: Success (POS-01)",
    severity: "Info",
  },
  {
    id: "L-002",
    time: "2026-01-09 10:05",
    actor: "kamal",
    type: "Login",
    action: "Login attempt: Failed (POS-02)",
    severity: "Warning",
  },
];
