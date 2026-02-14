import { useState, useEffect } from 'react';
import {
    History, Calendar, Filter, Download, ArrowUpRight,
    ArrowDownLeft, AlertCircle, Edit, Trash2, Plus,
    Box, Tag, Archive, CheckCircle, XCircle
} from 'lucide-react';
import inventoryService from '../services/inventoryService';
import { format } from 'date-fns';

export default function ActivityLogScreen() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL'); // ALL, STOCK_IN, STOCK_OUT, ADJUSTMENT, UPDATE
    const [dateRange, setDateRange] = useState('ALL'); // ALL, 7DAYS, 30DAYS, THIS_MONTH

    useEffect(() => {
        fetchLogs();
    }, [filterType, dateRange]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            // Mock data for now since backend endpoint might not exist
            // In a real app, you would call: await inventoryService.getActivityLogs({ type: filterType, range: dateRange });
            const mockLogs = generateMockLogs();
            setLogs(mockLogs);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateMockLogs = () => {
        // Generate some sample activity logs for demonstration
        const actions = [
            { type: 'STOCK_IN', label: 'Stock Received', icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { type: 'STOCK_OUT', label: 'Stock Sold', icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-50' },
            { type: 'ADJUSTMENT', label: 'Stock Adjustment', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
            { type: 'UPDATE', label: 'Item Updated', icon: Edit, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { type: 'CREATE', label: 'New Item Added', icon: Plus, color: 'text-green-500', bg: 'bg-green-50' },
            { type: 'DELETE', label: 'Item Deleted', icon: Trash2, color: 'text-red-500', bg: 'bg-red-50' },
        ];

        return Array(20).fill(null).map((_, i) => {
            const action = actions[Math.floor(Math.random() * actions.length)];
            const date = new Date();
            date.setHours(date.getHours() - Math.floor(Math.random() * 48 * i)); // Random times over last few days

            return {
                id: `LOG-${1000 + i}`,
                type: action.type,
                actionConfig: action,
                message: `${action.label}: Item #${2000 + i} - "Sample Product ${i + 1}"`,
                user: 'Admin User',
                timestamp: date,
                details: 'Quantity changed from 50 to 45'
            };
        }).sort((a, b) => b.timestamp - a.timestamp);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <History className="w-6 h-6 text-brand-primary" />
                        Activity Log
                    </h2>
                    <p className="text-slate-500">Track all inventory movements and updates</p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <Filter size={16} />
                    Filters:
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                    <option value="ALL">All Activities</option>
                    <option value="STOCK_IN">Stock In</option>
                    <option value="STOCK_OUT">Stock Out</option>
                    <option value="ADJUSTMENT">Adjustments</option>
                    <option value="UPDATE">Updates</option>
                    <option value="CREATE">Creates</option>
                </select>

                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                    <option value="ALL">All Time</option>
                    <option value="TODAY">Today</option>
                    <option value="7DAYS">Last 7 Days</option>
                    <option value="30DAYS">Last 30 Days</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading logs...</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => {
                            const ActionIcon = log.actionConfig.icon;
                            return (
                                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.actionConfig.bg} ${log.actionConfig.color}`}>
                                        <ActionIcon size={18} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-slate-800 text-sm">{log.message}</h4>
                                            <span className="text-xs text-slate-400 whitespace-nowrap">
                                                {format(log.timestamp, 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-1">{log.details}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-medium">
                                                User: {log.user}
                                            </span>
                                            <span>•</span>
                                            <span>ID: {log.id}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {logs.length === 0 && (
                            <div className="p-12 text-center">
                                <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No activity logs found</p>
                                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
