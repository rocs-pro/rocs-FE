import { useState, useEffect, useMemo } from "react";
import {
    Activity, Search, Calendar, Monitor, User, Clock,
    Filter, RefreshCw, FileText, Download, ChevronDown,
    ShoppingCart, DollarSign, Package, Users, LogIn,
    LogOut, AlertTriangle, CheckCircle, XCircle, Eye,
    BarChart2, ArrowUpRight, ArrowDownRight, Zap
} from "lucide-react";
import { getBranchActivityLog, getBranchActivityLogPdf } from "../../services/managerService";

// Activity type configuration
const activityConfig = {
    // Sales & POS
    SALE: { icon: ShoppingCart, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Sale' },
    RETURN: { icon: ArrowDownRight, color: 'bg-red-100 text-red-700 border-red-200', label: 'Return' },
    VOID_SALE: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Void Sale' },
    DISCOUNT: { icon: DollarSign, color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Discount' },

    // Cash Management
    SHIFT_OPEN: { icon: LogIn, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Shift Open' },
    SHIFT_CLOSE: { icon: LogOut, color: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Shift Close' },
    CASH_IN: { icon: ArrowUpRight, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Cash In' },
    CASH_OUT: { icon: ArrowDownRight, color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Cash Out' },
    CASH_FLOW_REQUEST: { icon: DollarSign, color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Cash Flow' },

    // Inventory
    GRN: { icon: Package, color: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'GRN' },
    GRN_APPROVED: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'GRN Approved' },
    STOCK_ADJUSTMENT: { icon: Package, color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Stock Adjust' },
    STOCK_TRANSFER: { icon: Package, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Transfer' },

    // User Actions
    LOGIN: { icon: LogIn, color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Login' },
    LOGOUT: { icon: LogOut, color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Logout' },
    USER_CREATE: { icon: Users, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'User Created' },

    // Approvals
    APPROVAL_REQUEST: { icon: FileText, color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Approval Requested' },
    APPROVAL_GRANTED: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Approved' },
    APPROVAL_REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' },

    // Alerts
    ALERT: { icon: AlertTriangle, color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Alert' },

    // Default
    DEFAULT: { icon: Activity, color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Activity' }
};

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, trend, trendValue }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100'
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{title}</div>
                    <div className="text-2xl font-bold text-slate-800">{value}</div>
                </div>
                {trend && (
                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {trend === 'up' ? '+' : ''}{trendValue}%
                    </div>
                )}
            </div>
        </div>
    );
}

// Activity Row Component
function ActivityRow({ activity }) {
    const config = activityConfig[activity.actionType] || activityConfig.DEFAULT;
    const Icon = config.icon;

    // Parse metadata for additional info
    let displayUser = activity.username || `User ${activity.userId || '?'}`;
    let displayRole = 'System';
    let additionalData = {};

    try {
        if (activity.metadata) {
            const meta = typeof activity.metadata === 'string'
                ? JSON.parse(activity.metadata)
                : activity.metadata;
            if (meta.user) displayUser = meta.user;
            if (meta.role) displayRole = meta.role;
            if (meta.amount) additionalData.amount = meta.amount;
            if (meta.invoice) additionalData.invoice = meta.invoice;
        }
    } catch (e) {
        // Ignore parse errors
    }

    const severityColors = {
        INFO: 'bg-blue-50',
        WARNING: 'bg-amber-50',
        CRITICAL: 'bg-red-50',
        SUCCESS: 'bg-emerald-50'
    };

    return (
        <tr className={`hover:bg-slate-50 transition-colors border-t border-slate-100 ${severityColors[activity.severity] || ''
            }`}>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                        <div className="font-medium text-slate-700">
                            {new Date(activity.timestamp || activity.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="text-xs text-slate-400">
                            {new Date(activity.timestamp || activity.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                        {displayUser.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-slate-800">{displayUser}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">{displayRole}</div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                    <Icon size={12} />
                    {config.label || activity.actionType?.replace(/_/g, ' ')}
                </span>
            </td>
            <td className="p-4">
                <div className="max-w-md">
                    <div className="text-slate-700">{activity.description || activity.details}</div>
                    {activity.entityType && activity.entityId && (
                        <div className="text-xs text-slate-400 mt-1 font-mono">
                            Ref: {activity.entityType} #{activity.entityId}
                        </div>
                    )}
                    {additionalData.amount && (
                        <div className="text-xs text-emerald-600 font-bold mt-1">
                            LKR {additionalData.amount.toLocaleString()}
                        </div>
                    )}
                </div>
            </td>
            <td className="p-4">
                {activity.terminalId ? (
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Monitor className="w-4 h-4" />
                        <span className="font-mono text-sm">T-{String(activity.terminalId).padStart(2, '0')}</span>
                    </div>
                ) : (
                    <span className="text-slate-300">-</span>
                )}
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${activity.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' :
                    activity.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {activity.status || 'OK'}
                </span>
            </td>
        </tr>
    );
}

// Filter Chips Component
function FilterChips({ selected, onChange, options }) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selected === opt.value
                        ? 'bg-slate-800 text-white shadow-lg'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    {opt.label}
                    {opt.count !== undefined && (
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${selected === opt.value ? 'bg-white/20' : 'bg-slate-100'
                            }`}>
                            {opt.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

// Live Activity Indicator
function LiveIndicator({ isLive }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-xs font-medium text-emerald-700">
                {isLive ? 'Live Updates' : 'Paused'}
            </span>
        </div>
    );
}

export default function BranchActivityLog() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isLive, setIsLive] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [severityFilter, setSeverityFilter] = useState("ALL");
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

    const fetchActivities = async () => {
        try {
            setRefreshing(true);
            const data = await getBranchActivityLog(1);

            if (Array.isArray(data)) {
                setActivities(data);
            } else {
                setActivities([]);
            }
        } catch (err) {
            console.error("Failed to load activities", err);
            setActivities([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };



    useEffect(() => {
        fetchActivities();

        // Auto refresh if live mode is enabled
        let interval;
        if (isLive) {
            interval = setInterval(fetchActivities, 30000);
        }
        return () => clearInterval(interval);
    }, [isLive]);

    // Calculate statistics
    const stats = useMemo(() => {
        const today = new Date().toDateString();
        const todayActivities = activities.filter(a =>
            new Date(a.timestamp || a.createdAt).toDateString() === today
        );

        const sales = todayActivities.filter(a => a.actionType === 'SALE').length;
        const returns = todayActivities.filter(a => a.actionType === 'RETURN').length;
        const warnings = todayActivities.filter(a => a.severity === 'WARNING' || a.severity === 'CRITICAL').length;
        const logins = todayActivities.filter(a => a.actionType === 'LOGIN').length;

        return { total: todayActivities.length, sales, returns, warnings, logins };
    }, [activities]);

    // Filter activities
    const filteredActivities = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return activities.filter(a => {
            const matchesSearch = !q ||
                a.username?.toLowerCase().includes(q) ||
                a.actionType?.toLowerCase().includes(q) ||
                a.description?.toLowerCase().includes(q) ||
                a.details?.toLowerCase().includes(q) ||
                (a.terminalId && String(a.terminalId).includes(q)); // Search by terminal ID

            const matchesType = typeFilter === 'ALL' || a.actionType === typeFilter;
            const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;

            return matchesSearch && matchesType && matchesSeverity;
        });
    }, [activities, searchTerm, typeFilter, severityFilter]);

    // Type filter options with counts
    const typeOptions = useMemo(() => {
        const counts = {};
        activities.forEach(a => {
            counts[a.actionType] = (counts[a.actionType] || 0) + 1;
        });

        return [
            { value: 'ALL', label: 'All', count: activities.length },
            { value: 'SALE', label: 'Sales', count: counts.SALE || 0 },
            { value: 'RETURN', label: 'Returns', count: counts.RETURN || 0 },
            { value: 'SHIFT_OPEN', label: 'Shift Open', count: counts.SHIFT_OPEN || 0 },
            { value: 'SHIFT_CLOSE', label: 'Shift Close', count: counts.SHIFT_CLOSE || 0 },
            { value: 'GRN', label: 'GRN', count: counts.GRN || 0 },
            { value: 'LOGIN', label: 'Logins', count: counts.LOGIN || 0 }
        ];
    }, [activities]);

    const exportLog = async () => {
        try {
            const blob = await getBranchActivityLogPdf(100);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `activity-log-${new Date().toISOString().split("T")[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export PDF", err);
            alert("Failed to export report. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-slate-500">Loading activity log...</p>
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
                        <Activity className="w-6 h-6 text-blue-600" />
                        Branch Activity Log
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Real-time monitoring of all branch operations and transactions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <LiveIndicator isLive={isLive} />
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isLive ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                    >
                        <Zap size={14} className="inline mr-1" />
                        {isLive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                        onClick={fetchActivities}
                        disabled={refreshing}
                        className={`p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all ${refreshing ? 'animate-spin' : ''
                            }`}
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={exportLog}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard title="Total Actions" value={stats.total} icon={Activity} color="blue" />
                <StatCard title="Sales" value={stats.sales} icon={ShoppingCart} color="emerald" trend="up" trendValue="12" />
                <StatCard title="Returns" value={stats.returns} icon={ArrowDownRight} color="red" />
                <StatCard title="Alerts" value={stats.warnings} icon={AlertTriangle} color="amber" />
                <StatCard title="Logins" value={stats.logins} icon={Users} color="purple" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by user, action, or description..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400" />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                            <option value="ALL">All Severity</option>
                            <option value="INFO">Info</option>
                            <option value="SUCCESS">Success</option>
                            <option value="WARNING">Warning</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>

                <FilterChips
                    selected={typeFilter}
                    onChange={setTypeFilter}
                    options={typeOptions}
                />
            </div>

            {/* Activity Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="font-semibold text-slate-800">Activity Feed</span>
                        <span className="ml-2 text-sm text-slate-400">
                            {filteredActivities.length} activities
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/80 text-slate-600 sticky top-0">
                            <tr>
                                <th className="text-left p-4 font-semibold">Time</th>
                                <th className="text-left p-4 font-semibold">User</th>
                                <th className="text-left p-4 font-semibold">Action</th>
                                <th className="text-left p-4 font-semibold">Details</th>
                                <th className="text-left p-4 font-semibold">Terminal</th>
                                <th className="text-left p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">
                                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        No activities found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredActivities.map(activity => (
                                    <ActivityRow
                                        key={activity.id || activity.activityId}
                                        activity={activity}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
