import { useState, useEffect } from "react";
import {
    Activity,
    Search,
    Calendar,
    Monitor,
    User,
    Clock,
    Filter,
    RefreshCw,
    FileText
} from "lucide-react";
import { getBranchActivityLog } from "../../services/managerService";

export default function BranchActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const fetchActivities = async () => {
        try {
            setRefreshing(true);
            const data = await getBranchActivityLog(1); // Default Branch 1
            if (Array.isArray(data)) {
                setActivities(data);
            }
        } catch (err) {
            console.error("Failed to load activities", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        const interval = setInterval(fetchActivities, 30000); // Auto refresh
        return () => clearInterval(interval);
    }, []);

    const getActionColor = (type) => {
        switch (type) {
            case "SHIFT_OPEN": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "SHIFT_CLOSE": return "bg-orange-100 text-orange-700 border-orange-200";
            case "SALE": return "bg-blue-100 text-blue-700 border-blue-200";
            case "RETURN": return "bg-red-100 text-red-700 border-red-200";
            case "CASH_FLOW_REQUEST": return "bg-purple-100 text-purple-700 border-purple-200";
            case "LOGIN": return "bg-slate-100 text-slate-700 border-slate-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const filteredActivities = activities.filter(a =>
        a.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.actionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-brand-primary" /> Branch Activity Log
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Real-time monitoring of branch operations, shifts, and transactions.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchActivities}
                        className={`p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all ${refreshing ? 'animate-spin' : ''}`}
                        title="Refresh"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="date"
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Filters & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Actions</div>
                        <div className="text-2xl font-bold text-slate-800">{activities.length}</div>
                    </div>
                </div>

                {/* Search */}
                <div className="md:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search by user, action, or details..."
                        className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Activity Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Time</th>
                                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">User</th>
                                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Action</th>
                                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider w-1/3">Details</th>
                                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Terminal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                                        <div className="mt-2 text-slate-400">Loading activity log...</div>
                                    </td>
                                </tr>
                            ) : filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-400">
                                        No activity found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredActivities.map((log) => {
                                    // Parse Metadata for User Info (stored as JSON string)
                                    let displayUser = "User " + (log.userId || "?");
                                    let displayRole = "System";

                                    try {
                                        if (log.metadata) {
                                            const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata;
                                            // Our service stores it as specific structure or simple json?
                                            // Service code: "{\"user\":\"" + username + ...
                                            if (meta.user) displayUser = meta.user;
                                            if (meta.role) displayRole = meta.role;
                                            // If nested in user_info
                                            if (meta.user_info) {
                                                displayUser = meta.user_info.user || displayUser;
                                                displayRole = meta.user_info.role || displayRole;
                                            }
                                        } else if (log.username) {
                                            // Fallback if transient field came through (unlikely)
                                            displayUser = log.username;
                                            displayRole = log.userRole || "System";
                                        }
                                    } catch (e) {
                                        // Ignore parse error
                                    }

                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="text-xs text-slate-400 ml-1">
                                                        {new Date(log.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                        {displayUser.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-700">{displayUser}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase">{displayRole}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getActionColor(log.actionType)}`}>
                                                    {log.actionType?.replace(/_/g, " ")}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-slate-600 font-medium">
                                                    {log.details}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                                                    {log.entityType && log.entityId ? `Ref: ${log.entityType} #${log.entityId}` : ''}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {log.terminalId ? (
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                                                        <Monitor className="w-3.5 h-3.5" />
                                                        POS-{String(log.terminalId).padStart(2, '0')}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
