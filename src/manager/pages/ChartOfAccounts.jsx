import { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Filter, Edit2, Trash2, ChevronRight,
  ChevronDown, Save, X, Building2, DollarSign,
  TrendingUp, TrendingDown, PiggyBank, CreditCard,
  RefreshCw, AlertCircle, Check, FolderTree
} from "lucide-react";
import { getChartOfAccounts } from "../../services/managerService";

// Account type icons and colors
const accountTypeConfig = {
  ASSET: {
    icon: Building2,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeColor: 'bg-blue-500'
  },
  LIABILITY: {
    icon: CreditCard,
    color: 'bg-red-100 text-red-700 border-red-200',
    badgeColor: 'bg-red-500'
  },
  EQUITY: {
    icon: PiggyBank,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeColor: 'bg-purple-500'
  },
  INCOME: {
    icon: TrendingUp,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badgeColor: 'bg-emerald-500'
  },
  EXPENSE: {
    icon: TrendingDown,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeColor: 'bg-amber-500'
  }
};

// Account row component with expand/collapse for sub-accounts
function AccountRow({ account, level = 0, onEdit, onDelete, expandedIds, toggleExpand }) {
  const config = accountTypeConfig[account.type] || accountTypeConfig.ASSET;
  const Icon = config.icon;
  const hasChildren = account.children && account.children.length > 0;
  const isExpanded = expandedIds.has(account.accountId);

  return (
    <>
      <tr className={`hover:bg-slate-50 transition-colors ${level > 0 ? 'bg-slate-50/50' : ''}`}>
        <td className="p-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(account.accountId)}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <span className="w-6" />
            )}
            <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {account.code}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${config.color}`}>
              <Icon size={14} />
            </div>
            <span className="font-medium text-slate-800">{account.name}</span>
            {account.parentId && (
              <span className="text-xs text-slate-400">Sub-account</span>
            )}
          </div>
        </td>
        <td className="p-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.color} border`}>
            {account.type}
          </span>
        </td>
        <td className="p-4 text-right">
          <span className={`font-bold ${account.balance >= 0 ? 'text-slate-800' : 'text-red-600'
            }`}>
            LKR {(account.balance || 0).toLocaleString()}
          </span>
        </td>
        <td className="p-4">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${account.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
            {account.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="p-4">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(account)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={14} />
            </button>
            {!hasChildren && (
              <button
                onClick={() => onDelete(account)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </td>
      </tr>
      {hasChildren && isExpanded && account.children.map(child => (
        <AccountRow
          key={child.accountId}
          account={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
        />
      ))}
    </>
  );
}

// Add/Edit Account Modal
function AccountModal({ account, parentAccounts, onSave, onClose }) {
  const [formData, setFormData] = useState({
    code: account?.code || '',
    name: account?.name || '',
    type: account?.type || 'ASSET',
    parentId: account?.parentId || '',
    isActive: account?.isActive !== false
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = 'Account code is required';
    if (!formData.name.trim()) newErrors.name = 'Account name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...account, ...formData });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              {account ? 'Edit Account' : 'New Account'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Account Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${errors.code ? 'border-red-300' : 'border-slate-200'
                  }`}
                placeholder="e.g., 1000"
              />
              {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Account Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="ASSET">Asset</option>
                <option value="LIABILITY">Liability</option>
                <option value="EQUITY">Equity</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Account Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${errors.name ? 'border-red-300' : 'border-slate-200'
                }`}
              placeholder="e.g., Cash in Hand"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Parent Account (Optional)
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            >
              <option value="">-- No Parent (Top Level) --</option>
              {parentAccounts.filter(a => a.type === formData.type).map(a => (
                <option key={a.accountId} value={a.accountId}>
                  {a.code} - {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
            <label htmlFor="isActive" className="text-sm text-slate-700">
              Account is active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Account type summary cards
function TypeSummaryCard({ type, count, balance }) {
  const config = accountTypeConfig[type];
  const Icon = config?.icon || Building2;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${config?.color || 'bg-slate-100'}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-500">{type}</div>
          <div className="text-lg font-bold text-slate-800">
            LKR {balance.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">{count}</div>
          <div className="text-xs text-slate-400">accounts</div>
        </div>
      </div>
    </div>
  );
}

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getChartOfAccounts();

      if (data && data.length > 0) {
        setAccounts(data);
      } else {
        // Default chart of accounts for demo
        setAccounts(getDefaultAccounts());
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setAccounts(getDefaultAccounts());
    } finally {
      setLoading(false);
    }
  };

  // Default chart of accounts structure
  const getDefaultAccounts = () => [
    {
      accountId: 1, code: '1000', name: 'Assets', type: 'ASSET', isActive: true, balance: 1500000, children: [
        {
          accountId: 11, code: '1100', name: 'Cash & Bank', type: 'ASSET', parentId: 1, isActive: true, balance: 850000, children: [
            { accountId: 111, code: '1110', name: 'Cash in Hand', type: 'ASSET', parentId: 11, isActive: true, balance: 150000 },
            { accountId: 112, code: '1120', name: 'Petty Cash', type: 'ASSET', parentId: 11, isActive: true, balance: 25000 },
            { accountId: 113, code: '1130', name: 'Bank - Commercial', type: 'ASSET', parentId: 11, isActive: true, balance: 675000 }
          ]
        },
        { accountId: 12, code: '1200', name: 'Accounts Receivable', type: 'ASSET', parentId: 1, isActive: true, balance: 350000 },
        { accountId: 13, code: '1300', name: 'Inventory', type: 'ASSET', parentId: 1, isActive: true, balance: 300000 }
      ]
    },
    {
      accountId: 2, code: '2000', name: 'Liabilities', type: 'LIABILITY', isActive: true, balance: 450000, children: [
        { accountId: 21, code: '2100', name: 'Accounts Payable', type: 'LIABILITY', parentId: 2, isActive: true, balance: 280000 },
        { accountId: 22, code: '2200', name: 'Supplier Payable', type: 'LIABILITY', parentId: 2, isActive: true, balance: 170000 }
      ]
    },
    {
      accountId: 3, code: '3000', name: 'Equity', type: 'EQUITY', isActive: true, balance: 500000, children: [
        { accountId: 31, code: '3100', name: 'Owner\'s Capital', type: 'EQUITY', parentId: 3, isActive: true, balance: 400000 },
        { accountId: 32, code: '3200', name: 'Retained Earnings', type: 'EQUITY', parentId: 3, isActive: true, balance: 100000 }
      ]
    },
    {
      accountId: 4, code: '4000', name: 'Income', type: 'INCOME', isActive: true, balance: 2500000, children: [
        { accountId: 41, code: '4100', name: 'Sales Revenue', type: 'INCOME', parentId: 4, isActive: true, balance: 2300000 },
        { accountId: 42, code: '4200', name: 'Other Income', type: 'INCOME', parentId: 4, isActive: true, balance: 200000 }
      ]
    },
    {
      accountId: 5, code: '5000', name: 'Expenses', type: 'EXPENSE', isActive: true, balance: 1050000, children: [
        { accountId: 51, code: '5100', name: 'Cost of Goods Sold', type: 'EXPENSE', parentId: 5, isActive: true, balance: 750000 },
        { accountId: 52, code: '5200', name: 'Operating Expenses', type: 'EXPENSE', parentId: 5, isActive: true, balance: 200000 },
        { accountId: 53, code: '5300', name: 'Salaries & Wages', type: 'EXPENSE', parentId: 5, isActive: true, balance: 100000 }
      ]
    }
  ];

  useEffect(() => {
    fetchAccounts();
    // Expand top level by default
    setExpandedIds(new Set([1, 2, 3, 4, 5]));
  }, []);

  // Flatten accounts for filtering and count all accounts
  const flattenAccounts = (accs, result = []) => {
    accs.forEach(a => {
      result.push(a);
      if (a.children) flattenAccounts(a.children, result);
    });
    return result;
  };

  const { filteredAccounts, typeSummary, flatList } = useMemo(() => {
    const flatList = flattenAccounts(accounts);
    const q = searchQuery.toLowerCase();

    // Filter by search and type
    const matchesFilter = (acc) => {
      const matchesSearch = !q ||
        acc.code.toLowerCase().includes(q) ||
        acc.name.toLowerCase().includes(q);
      const matchesType = typeFilter === 'ALL' || acc.type === typeFilter;
      return matchesSearch && matchesType;
    };

    // For display, we show top-level accounts and filter their children
    const filterTree = (accs) => {
      return accs.filter(a => {
        if (matchesFilter(a)) return true;
        if (a.children) {
          const filteredChildren = filterTree(a.children);
          if (filteredChildren.length > 0) {
            a.children = filteredChildren;
            return true;
          }
        }
        return false;
      });
    };

    // Calculate type summaries
    const summary = {};
    ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'].forEach(type => {
      const ofType = flatList.filter(a => a.type === type);
      summary[type] = {
        count: ofType.length,
        balance: ofType.reduce((sum, a) => sum + (a.balance || 0), 0)
      };
    });

    return {
      filteredAccounts: filterTree(JSON.parse(JSON.stringify(accounts))),
      typeSummary: summary,
      flatList
    };
  }, [accounts, searchQuery, typeFilter]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setModalOpen(true);
  };

  const handleDelete = (account) => {
    if (window.confirm(`Are you sure you want to delete "${account.name}"?`)) {
      // In real app, call API to delete
      console.log("Deleting account:", account);
    }
  };

  const handleSave = (accountData) => {
    // In real app, call API to save
    console.log("Saving account:", accountData);
    setModalOpen(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading chart of accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-blue-600" />
            Chart of Accounts
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your accounting structure and track balances
          </p>
        </div>
        <button
          onClick={() => { setEditingAccount(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      {/* Type Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(typeSummary).map(([type, data]) => (
          <TypeSummaryCard
            key={type}
            type={type}
            count={data.count}
            balance={data.balance}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code or name..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="ASSET">Assets</option>
              <option value="LIABILITY">Liabilities</option>
              <option value="EQUITY">Equity</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expenses</option>
            </select>
            <button
              onClick={() => setExpandedIds(new Set(flatList.map(a => a.accountId)))}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedIds(new Set())}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="text-left p-4 font-semibold w-40">Code</th>
                <th className="text-left p-4 font-semibold">Account Name</th>
                <th className="text-left p-4 font-semibold w-32">Type</th>
                <th className="text-right p-4 font-semibold w-40">Balance</th>
                <th className="text-left p-4 font-semibold w-24">Status</th>
                <th className="text-right p-4 font-semibold w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No accounts found
                  </td>
                </tr>
              ) : (
                filteredAccounts.map(account => (
                  <AccountRow
                    key={account.accountId}
                    account={account}
                    level={0}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <AccountModal
          account={editingAccount}
          parentAccounts={flatList.filter(a => !a.parentId)}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingAccount(null); }}
        />
      )}
    </div>
  );
}