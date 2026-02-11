import { useState, useEffect } from "react";
import { getAllBranches, getBranchSummary } from "../services/adminApi";
import BranchSummaryModal from "./BranchSummaryModal";
import {
    MapPin,
    Users,
    Monitor,
    TrendingUp,
    Building2,
    Loader2,
    ChevronRight,
    Activity,
} from "lucide-react";

export default function BranchCards() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [loadingBranch, setLoadingBranch] = useState(false);

    // Fetch all branches on mount
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const data = await getAllBranches();
                setBranches(data || []);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch branches:", err);
                setError("Failed to load branches");
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();

        // Refresh branch data every 60 seconds
        const interval = setInterval(fetchBranches, 60000);
        return () => clearInterval(interval);
    }, []);

    // Fetch branch summary when a branch is clicked
    const handleBranchClick = async (branch) => {
        const branchId = branch.branchId || branch.id;
        setSelectedBranchId(branchId);
        setLoadingBranch(true);

        try {
            const summary = await getBranchSummary(branchId);
            setSelectedBranch({
                ...summary.branch,
                users: summary.users,
                userCount: summary.userCount,
            });
        } catch (err) {
            console.error("Failed to fetch branch summary:", err);
            // Fallback to basic branch data
            setSelectedBranch(branch);
        } finally {
            setLoadingBranch(false);
        }
    };

    const formatCurrency = (value) => `LKR ${(value || 0).toLocaleString()}`;

    // Color palette for branch cards
    const cardGradients = [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-violet-500 to-purple-600",
        "from-amber-500 to-orange-600",
        "from-rose-500 to-pink-600",
        "from-cyan-500 to-blue-600",
        "from-lime-500 to-green-600",
        "from-fuchsia-500 to-purple-600",
    ];

    const cardBgGradients = [
        "from-blue-50 to-indigo-50",
        "from-emerald-50 to-teal-50",
        "from-violet-50 to-purple-50",
        "from-amber-50 to-orange-50",
        "from-rose-50 to-pink-50",
        "from-cyan-50 to-blue-50",
        "from-lime-50 to-green-50",
        "from-fuchsia-50 to-purple-50",
    ];

    const cardBorderColors = [
        "border-blue-200 hover:border-blue-400",
        "border-emerald-200 hover:border-emerald-400",
        "border-violet-200 hover:border-violet-400",
        "border-amber-200 hover:border-amber-400",
        "border-rose-200 hover:border-rose-400",
        "border-cyan-200 hover:border-cyan-400",
        "border-lime-200 hover:border-lime-400",
        "border-fuchsia-200 hover:border-fuchsia-400",
    ];

    if (loading) {
        return (
            <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                    <Building2 size={20} className="text-slate-600" />
                    <h3 className="text-lg font-bold text-gray-800">Branch Overview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-16 bg-gray-100 rounded-lg" />
                                <div className="h-16 bg-gray-100 rounded-lg" />
                                <div className="h-16 bg-gray-100 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lg:col-span-3">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    const totalActive = branches.filter(
        (b) => b.isActive || b.status === "Active"
    ).length;

    return (
        <div className="lg:col-span-3">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Branch Overview
                        </h3>
                        <p className="text-sm text-gray-500">
                            {totalActive} active of {branches.length} total branches •{" "}
                            <span className="text-green-600 font-medium">
                                Click for details
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </span>
                </div>
            </div>

            {/* Branch Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch, index) => {
                    const branchId = branch.branchId || branch.id;
                    const branchName = branch.name || branch.branchName || "Branch";
                    const isActive =
                        branch.isActive || branch.status === "Active";
                    const colorIndex = index % cardGradients.length;
                    const isLoadingThis =
                        loadingBranch && selectedBranchId === branchId;

                    return (
                        <button
                            key={branchId}
                            onClick={() => handleBranchClick(branch)}
                            disabled={isLoadingThis}
                            className={`group relative text-left bg-gradient-to-br ${cardBgGradients[colorIndex]} border ${cardBorderColors[colorIndex]} rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-70`}
                        >
                            {/* Loading overlay */}
                            {isLoadingThis && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                                    <Loader2
                                        size={24}
                                        className="animate-spin text-blue-600"
                                    />
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${cardGradients[colorIndex]} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        {branchName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors text-sm">
                                            {branchName}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <MapPin size={12} />
                                            <span className="truncate max-w-[120px]">
                                                {branch.address || branch.location || "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive
                                            ? "bg-green-100 text-green-700 border border-green-200"
                                            : "bg-red-100 text-red-600 border border-red-200"
                                            }`}
                                    >
                                        {isActive ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className="text-gray-400 group-hover:text-gray-600 transition-all duration-300 group-hover:translate-x-1"
                                    />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50">
                                    <TrendingUp
                                        size={14}
                                        className="mx-auto mb-1 text-green-600"
                                    />
                                    <div className="text-xs font-extrabold text-gray-800 leading-tight">
                                        {formatCurrency(branch.dailySales)}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                        Today Sales
                                    </div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50">
                                    <Monitor
                                        size={14}
                                        className="mx-auto mb-1 text-blue-600"
                                    />
                                    <div className="text-sm font-extrabold text-gray-800">
                                        {branch.activeTerminals || branch.totalTerminals || 0}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                        Terminals
                                    </div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-white/50">
                                    <Users
                                        size={14}
                                        className="mx-auto mb-1 text-purple-600"
                                    />
                                    <div className="text-sm font-extrabold text-gray-800">
                                        {branch.userCount || branch.totalUsers || 0}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                        Staff
                                    </div>
                                </div>
                            </div>

                            {/* Manager Info */}
                            <div className="mt-3 pt-3 border-t border-white/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${cardGradients[colorIndex]} flex items-center justify-center text-white text-[10px] font-bold`}
                                    >
                                        {(branch.managerName || "N")[0]}
                                    </div>
                                    <span className="text-xs text-gray-600 truncate max-w-[130px]">
                                        {branch.managerName || "No manager"}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Activity size={10} />
                                    View Details
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Branch Summary Modal */}
            {selectedBranch && (
                <BranchSummaryModal
                    branch={selectedBranch}
                    onClose={() => {
                        setSelectedBranch(null);
                        setSelectedBranchId(null);
                    }}
                />
            )}
        </div>
    );
}
