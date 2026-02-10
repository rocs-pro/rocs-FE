import { useState, useEffect, useMemo } from "react";
import {
  Plus, Save, X, Trash2, Search, Calendar, FileText,
  Check, AlertCircle, RefreshCw, Download, ChevronDown,
  Eye, Edit2, Copy, Filter, Clock, User
} from "lucide-react";
import { createJournalEntry, getChartOfAccounts } from "../../services/managerService";

// Journal Entry Status Badge
function StatusBadge({ status }) {
  const styles = {
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    POSTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    VOID: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
}

// Journal Entry Line Row
function JournalLine({ line, index, accounts, onUpdate, onRemove, canEdit }) {
  const selectedAccount = accounts.find(a => a.code === line.accountCode);

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-3">
        <span className="text-sm text-slate-400 font-mono">{index + 1}</span>
      </td>
      <td className="p-3">
        {canEdit ? (
          <select
            value={line.accountCode}
            onChange={(e) => {
              const acc = accounts.find(a => a.code === e.target.value);
              onUpdate(index, { accountCode: e.target.value, accountName: acc?.name || '' });
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          >
            <option value="">Select Account</option>
            {accounts.map(a => (
              <option key={a.code} value={a.code}>
                {a.code} - {a.name}
              </option>
            ))}
          </select>
        ) : (
          <div>
            <span className="font-mono text-xs text-slate-500">{line.accountCode}</span>
            <span className="ml-2 text-sm text-slate-700">{line.accountName}</span>
          </div>
        )}
      </td>
      <td className="p-3">
        {canEdit ? (
          <input
            type="text"
            value={line.description}
            onChange={(e) => onUpdate(index, { description: e.target.value })}
            placeholder="Line description"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        ) : (
          <span className="text-sm text-slate-600">{line.description || '-'}</span>
        )}
      </td>
      <td className="p-3">
        {canEdit ? (
          <input
            type="number"
            value={line.debit || ''}
            onChange={(e) => onUpdate(index, {
              debit: parseFloat(e.target.value) || 0,
              credit: 0 // Clear credit when debit is entered
            })}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        ) : (
          <span className={`text-sm text-right block ${line.debit > 0 ? 'font-bold text-slate-800' : 'text-slate-400'}`}>
            {line.debit > 0 ? `LKR ${line.debit.toLocaleString()}` : '-'}
          </span>
        )}
      </td>
      <td className="p-3">
        {canEdit ? (
          <input
            type="number"
            value={line.credit || ''}
            onChange={(e) => onUpdate(index, {
              credit: parseFloat(e.target.value) || 0,
              debit: 0 // Clear debit when credit is entered
            })}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        ) : (
          <span className={`text-sm text-right block ${line.credit > 0 ? 'font-bold text-slate-800' : 'text-slate-400'}`}>
            {line.credit > 0 ? `LKR ${line.credit.toLocaleString()}` : '-'}
          </span>
        )}
      </td>
      <td className="p-3">
        {canEdit && (
          <button
            onClick={() => onRemove(index)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </td>
    </tr>
  );
}

// New Journal Entry Form
function NewJournalEntry({ accounts, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    memo: '',
    transactionType: 'GENERAL',
    lines: [
      { accountCode: '', accountName: '', description: '', debit: 0, credit: 0 },
      { accountCode: '', accountName: '', description: '', debit: 0, credit: 0 }
    ]
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const debit = formData.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const credit = formData.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    return { debit, credit, balanced: Math.abs(debit - credit) < 0.01 };
  }, [formData.lines]);

  const updateLine = (index, updates) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map((l, i) => i === index ? { ...l, ...updates } : l)
    }));
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { accountCode: '', accountName: '', description: '', debit: 0, credit: 0 }]
    }));
  };

  const removeLine = (index) => {
    if (formData.lines.length > 2) {
      setFormData(prev => ({
        ...prev,
        lines: prev.lines.filter((_, i) => i !== index)
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.memo) newErrors.memo = 'Description is required';
    if (!totals.balanced) newErrors.balance = 'Debits must equal Credits';
    if (totals.debit === 0) newErrors.amount = 'Entry must have amounts';

    const invalidLines = formData.lines.filter(l =>
      (l.debit > 0 || l.credit > 0) && !l.accountCode
    );
    if (invalidLines.length > 0) newErrors.lines = 'All lines with amounts must have an account';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status = 'DRAFT') => {
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({
        ...formData,
        status,
        lines: formData.lines.filter(l => l.accountCode && (l.debit > 0 || l.credit > 0))
      });
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setErrors({ submit: 'Failed to save journal entry' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Journal Entry</h2>
            <p className="text-sm text-slate-500 mt-1">Create a new accounting entry</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-5 space-y-6">
        {/* Entry Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${errors.date ? 'border-red-300' : 'border-slate-200'
                }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
            <select
              value={formData.transactionType}
              onChange={(e) => setFormData(prev => ({ ...prev, transactionType: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            >
              <option value="GENERAL">General Entry</option>
              <option value="SALE">Sales Entry</option>
              <option value="PURCHASE">Purchase Entry</option>
              <option value="PAYMENT">Payment Entry</option>
              <option value="RECEIPT">Receipt Entry</option>
              <option value="ADJUSTMENT">Adjustment Entry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reference No</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="e.g., INV-001"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
            <input
              type="text"
              value={formData.memo}
              onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="Entry description"
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${errors.memo ? 'border-red-300' : 'border-slate-200'
                }`}
            />
          </div>
        </div>

        {/* Journal Lines */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Journal Lines</span>
            <button
              onClick={addLine}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add Line
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr className="text-slate-600">
                <th className="p-3 text-left w-12">#</th>
                <th className="p-3 text-left">Account</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right w-36">Debit</th>
                <th className="p-3 text-right w-36">Credit</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {formData.lines.map((line, idx) => (
                <JournalLine
                  key={idx}
                  line={line}
                  index={idx}
                  accounts={accounts}
                  onUpdate={updateLine}
                  onRemove={removeLine}
                  canEdit={true}
                />
              ))}
              {/* Totals Row */}
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td colSpan={3} className="p-3 text-right font-bold text-slate-700">TOTALS</td>
                <td className="p-3 text-right font-bold text-slate-800">
                  LKR {totals.debit.toLocaleString()}
                </td>
                <td className="p-3 text-right font-bold text-slate-800">
                  LKR {totals.credit.toLocaleString()}
                </td>
                <td className="p-3">
                  {totals.balanced ? (
                    <Check size={18} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Balance Warning */}
        {!totals.balanced && totals.debit > 0 && (
          <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">
              Entry is unbalanced. Difference: LKR {Math.abs(totals.debit - totals.credit).toLocaleString()}
            </span>
          </div>
        )}

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <AlertCircle size={18} />
              Please fix the following errors:
            </div>
            <ul className="list-disc list-inside text-sm text-red-600">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('DRAFT')}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit('POSTED')}
              disabled={saving || !totals.balanced}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              {saving ? 'Posting...' : 'Post Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Journal Entry List Item
function JournalEntryItem({ entry, onView, onEdit, onDuplicate }) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="p-4">
        <span className="font-mono text-sm text-slate-800">{entry.journalNo}</span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-sm text-slate-700">{entry.date}</span>
        </div>
      </td>
      <td className="p-4">
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
          {entry.transactionType}
        </span>
      </td>
      <td className="p-4">
        <div className="max-w-xs truncate text-sm text-slate-700">{entry.memo}</div>
        {entry.reference && (
          <div className="text-xs text-slate-400">Ref: {entry.reference}</div>
        )}
      </td>
      <td className="p-4 text-right font-bold text-slate-800">
        LKR {entry.totalDebit?.toLocaleString() || 0}
      </td>
      <td className="p-4">
        <StatusBadge status={entry.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(entry)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={14} />
          </button>
          {entry.status === 'DRAFT' && (
            <button
              onClick={() => onEdit(entry)}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
          )}
          <button
            onClick={() => onDuplicate(entry)}
            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function JournalEntry() {
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accountsData = await getChartOfAccounts();

      // Flatten accounts for dropdown
      const flatAccounts = [];
      const flatten = (accs) => {
        accs.forEach(a => {
          flatAccounts.push({ code: a.code, name: a.name, type: a.type });
          if (a.children) flatten(a.children);
        });
      };
      if (accountsData) flatten(accountsData);
      setAccounts(flatAccounts.length > 0 ? flatAccounts : getDefaultAccounts());

      // Mock journal entries
      setEntries(getMockEntries());
    } catch (err) {
      console.error('Error fetching data:', err);
      setAccounts(getDefaultAccounts());
      setEntries(getMockEntries());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAccounts = () => [
    { code: '1110', name: 'Cash in Hand', type: 'ASSET' },
    { code: '1120', name: 'Petty Cash', type: 'ASSET' },
    { code: '1130', name: 'Bank - Commercial', type: 'ASSET' },
    { code: '1200', name: 'Accounts Receivable', type: 'ASSET' },
    { code: '1300', name: 'Inventory', type: 'ASSET' },
    { code: '2100', name: 'Accounts Payable', type: 'LIABILITY' },
    { code: '2200', name: 'Supplier Payable', type: 'LIABILITY' },
    { code: '4100', name: 'Sales Revenue', type: 'INCOME' },
    { code: '4200', name: 'Other Income', type: 'INCOME' },
    { code: '5100', name: 'Cost of Goods Sold', type: 'EXPENSE' },
    { code: '5200', name: 'Operating Expenses', type: 'EXPENSE' },
    { code: '5300', name: 'Salaries & Wages', type: 'EXPENSE' }
  ];

  const getMockEntries = () => [
    { id: 1, journalNo: 'JE-2024-001', date: '2024-02-06', transactionType: 'SALE', memo: 'Daily sales posting', reference: 'INV-0156', totalDebit: 125000, status: 'POSTED' },
    { id: 2, journalNo: 'JE-2024-002', date: '2024-02-05', transactionType: 'PURCHASE', memo: 'Inventory purchase from supplier', reference: 'GRN-0045', totalDebit: 85000, status: 'POSTED' },
    { id: 3, journalNo: 'JE-2024-003', date: '2024-02-05', transactionType: 'PAYMENT', memo: 'Salary payment - January', reference: 'PAY-0012', totalDebit: 150000, status: 'POSTED' },
    { id: 4, journalNo: 'JE-2024-004', date: '2024-02-04', transactionType: 'ADJUSTMENT', memo: 'Stock adjustment - damaged goods', reference: 'ADJ-003', totalDebit: 12500, status: 'DRAFT' },
    { id: 5, journalNo: 'JE-2024-005', date: '2024-02-04', transactionType: 'GENERAL', memo: 'Bank charges for February', totalDebit: 2500, status: 'PENDING' }
  ];

  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return entries.filter(e => {
      const matchesSearch = !q ||
        e.journalNo?.toLowerCase().includes(q) ||
        e.memo?.toLowerCase().includes(q) ||
        e.reference?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, statusFilter]);

  const handleSave = async (entryData) => {
    console.log('Saving entry:', entryData);
    // In real app, call API
    setShowNewEntry(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading journal entries...</p>
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
            <FileText className="w-6 h-6 text-blue-600" />
            Journal Entries
          </h1>
          <p className="text-slate-500 mt-1">Record and manage accounting transactions</p>
        </div>
        {!showNewEntry && (
          <button
            onClick={() => setShowNewEntry(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
          >
            <Plus size={18} />
            New Journal Entry
          </button>
        )}
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <NewJournalEntry
          accounts={accounts}
          onSave={handleSave}
          onCancel={() => setShowNewEntry(false)}
        />
      )}

      {/* Filters */}
      {!showNewEntry && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by journal no, description, or reference..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="POSTED">Posted</option>
                <option value="VOID">Void</option>
              </select>
              <button
                onClick={fetchData}
                className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <RefreshCw size={18} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries Table */}
      {!showNewEntry && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 text-slate-600">
                <tr>
                  <th className="text-left p-4 font-semibold">Journal No</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-right p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No journal entries found
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map(entry => (
                    <JournalEntryItem
                      key={entry.id}
                      entry={entry}
                      onView={() => console.log('View:', entry)}
                      onEdit={() => console.log('Edit:', entry)}
                      onDuplicate={() => console.log('Duplicate:', entry)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
