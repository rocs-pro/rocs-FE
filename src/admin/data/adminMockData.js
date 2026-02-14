// Admin-Specific Dashboard Mock Data (replace with API calls later)

// ===== Today's Sales Overview =====
export const todaysSalesData = {
  totalSales: 1250680,
  totalTransactions: 847,
  comparedToYesterday: 12.5, // percentage increase
  lastUpdated: new Date().toISOString(),
};

// ===== User Statistics by Role =====
export const userStatsByRole = {
  totalUsers: 156,
  loyaltyCustomers: 1250,
  managers: 8,
  cashiers: 45,
  storeKeepers: 12,
  admins: 3,
};

// ===== Detailed Branch Data for Admin Overview =====
export const branchesDetailed = [
  {
    id: "BR-001",
    name: "Colombo Main",
    address: "No. 45, Galle Road, Colombo 03",
    manager: { id: "U-002", name: "Anne Silva", phone: "077-1234567", email: "anne@smartretailpro.lk" },
    users: [
      { id: "U-001", name: "John Perera", role: "Cashier", status: "Active" },
      { id: "U-004", name: "Saman Kumara", role: "Cashier", status: "Active" },
      { id: "U-005", name: "Nimal Jayasuriya", role: "StoreKeeper", status: "Active" },
      { id: "U-015", name: "Chamari Dias", role: "Cashier", status: "Active" },
    ],
    activeTerminals: 3,
    totalTerminals: 4,
    registeredCustomers: 450,
    dailySales: 485230,
    status: "Active",
    openedAt: "2024-01-15",
  },
  {
    id: "BR-002",
    name: "Kandy Central",
    address: "No. 12, Peradeniya Road, Kandy",
    manager: { id: "U-006", name: "Ruwan Fernando", phone: "077-2345678", email: "ruwan@smartretailpro.lk" },
    users: [
      { id: "U-003", name: "Kamal Fernando", role: "Cashier", status: "Active" },
      { id: "U-007", name: "Priya Mendis", role: "Cashier", status: "Active" },
      { id: "U-016", name: "Lakshan Perera", role: "StoreKeeper", status: "Active" },
    ],
    activeTerminals: 2,
    totalTerminals: 3,
    registeredCustomers: 320,
    dailySales: 325450,
    status: "Active",
    openedAt: "2024-03-20",
  },
  {
    id: "BR-003",
    name: "Galle Fort",
    address: "No. 8, Church Street, Galle Fort",
    manager: { id: "U-008", name: "Kasun Rajapaksha", phone: "077-3456789", email: "kasun@smartretailpro.lk" },
    users: [
      { id: "U-009", name: "Dilshan Perera", role: "Cashier", status: "Active" },
      { id: "U-017", name: "Sampath Silva", role: "Cashier", status: "Inactive" },
    ],
    activeTerminals: 1,
    totalTerminals: 2,
    registeredCustomers: 180,
    dailySales: 145000,
    status: "Active",
    openedAt: "2024-06-10",
  },
  {
    id: "BR-004",
    name: "Negombo Beach",
    address: "No. 25, Lewis Place, Negombo",
    manager: { id: "U-010", name: "Tharanga Silva", phone: "077-4567890", email: "tharanga@smartretailpro.lk" },
    users: [
      { id: "U-011", name: "Nadeesha Kumari", role: "Cashier", status: "Active" },
      { id: "U-012", name: "Chaminda Weerasinghe", role: "StoreKeeper", status: "Active" },
    ],
    activeTerminals: 2,
    totalTerminals: 2,
    registeredCustomers: 275,
    dailySales: 195000,
    status: "Active",
    openedAt: "2024-08-05",
  },
  {
    id: "BR-005",
    name: "Jaffna Town",
    address: "No. 5, Hospital Road, Jaffna",
    manager: { id: "U-013", name: "Rajeev Krishnan", phone: "077-5678901", email: "rajeev@smartretailpro.lk" },
    users: [
      { id: "U-014", name: "Saranya Balakrishnan", role: "Cashier", status: "Active" },
    ],
    activeTerminals: 1,
    totalTerminals: 2,
    registeredCustomers: 145,
    dailySales: 100000,
    status: "Active",
    openedAt: "2024-10-15",
  },
];

// ===== Top Performing Branches by Sales (for chart) =====
export const topBranchesBySales = [
  { name: "Colombo Main", sales: 485230, color: "#1F3C88" },
  { name: "Kandy Central", sales: 325450, color: "#2563EB" },
  { name: "Negombo Beach", sales: 195000, color: "#16A34A" },
  { name: "Galle Fort", sales: 145000, color: "#F59E0B" },
  { name: "Jaffna Town", sales: 100000, color: "#EF4444" },
];

// ===== Branches with Highest Customer Recurrence =====
export const customerRecurrenceByBranch = [
  { name: "Colombo Main", recurrenceRate: 78, totalVisits: 1250 },
  { name: "Kandy Central", recurrenceRate: 72, totalVisits: 890 },
  { name: "Negombo Beach", recurrenceRate: 68, totalVisits: 650 },
  { name: "Galle Fort", recurrenceRate: 65, totalVisits: 420 },
  { name: "Jaffna Town", recurrenceRate: 58, totalVisits: 310 },
];

// ===== Top Performing Managers =====
export const topManagers = [
  { name: "Anne Silva", branch: "Colombo Main", sales: 485230, rating: 4.9, transactions: 312, avatar: "AS" },
  { name: "Ruwan Fernando", branch: "Kandy Central", sales: 325450, rating: 4.7, transactions: 245, avatar: "RF" },
  { name: "Tharanga Silva", branch: "Negombo Beach", sales: 195000, rating: 4.6, transactions: 156, avatar: "TS" },
  { name: "Kasun Rajapaksha", branch: "Galle Fort", sales: 145000, rating: 4.5, transactions: 98, avatar: "KR" },
  { name: "Rajeev Krishnan", branch: "Jaffna Town", sales: 100000, rating: 4.3, transactions: 76, avatar: "RK" },
];

// ===== Weekly Sales Trend =====
export const weeklySalesTrend = [
  { day: "Mon", sales: 980000 },
  { day: "Tue", sales: 1050000 },
  { day: "Wed", sales: 1120000 },
  { day: "Thu", sales: 1080000 },
  { day: "Fri", sales: 1250000 },
  { day: "Sat", sales: 1450000 },
  { day: "Sun", sales: 1350000 },
];

// ===== Real-time Simulation Helper =====
export const simulateRealTimeUpdate = (branch) => {
  const variance = Math.floor(Math.random() * 5000) - 2500;
  return {
    ...branch,
    dailySales: branch.dailySales + variance,
    lastUpdated: new Date().toISOString(),
  };
};
