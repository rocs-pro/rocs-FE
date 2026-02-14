import { useState, useEffect } from "react";
import { getAllBranches, searchBranches, getBranchSummary } from "../services/adminApi";
import BranchSummaryModal from "./BranchSummaryModal";

export default function BranchOverview() {
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const data = await getAllBranches();
        setBranches(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
        setError("Failed to load branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchBranches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Search branches
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim()) {
        try {
          setSearching(true);
          const results = await searchBranches(searchQuery);
          setFilteredBranches(results);
        } catch (err) {
          // Fallback to local filter if API fails
          const filtered = branches.filter(
            (b) =>
              b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.managerName?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredBranches(filtered);
        } finally {
          setSearching(false);
        }
      } else {
        setFilteredBranches([]);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, branches]);

  // Fetch branch summary when selected
  useEffect(() => {
    const fetchBranchSummary = async () => {
      if (selectedBranchId) {
        try {
          const summary = await getBranchSummary(selectedBranchId);
          setSelectedBranch({ ...summary.branch, users: summary.users, userCount: summary.userCount });
        } catch (err) {
          console.error("Failed to fetch branch summary:", err);
          // Fallback to basic branch data
          const branch = branches.find((b) => b.branchId === selectedBranchId || b.id === selectedBranchId);
          setSelectedBranch(branch);
        }
      }
    };

    fetchBranchSummary();
  }, [selectedBranchId, branches]);

  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.isActive || b.status === "Active").length;
  const previewBranches = branches.slice(0, 2);

  const formatCurrency = (value) => `LKR ${(value || 0).toLocaleString()}`;

  if (loading) {
    return (
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-5"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      {/* Header with Total Count and Search */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Total Branches</h3>
          <p className="text-sm text-gray-500">
            {activeBranches} active of {totalBranches}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-3xl font-extrabold text-brand-primary">
            {totalBranches}
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-10 h-10 bg-brand-soft hover:bg-brand-primary hover:text-white rounded-xl flex items-center justify-center transition-all"
            title="Search Branches"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Box */}
      {showSearch && (
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by branch name, address, or manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
            autoFocus
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Search Results Dropdown */}
          {searching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4 text-center">
              <p className="text-gray-500">Searching...</p>
            </div>
          )}

          {!searching && filteredBranches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
              {filteredBranches.map((branch) => (
                <button
                  key={branch.branchId || branch.id}
                  onClick={() => {
                    setSelectedBranchId(branch.branchId || branch.id);
                    setSearchQuery("");
                    setShowSearch(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-10 h-10 bg-brand-soft rounded-lg flex items-center justify-center text-brand-primary font-bold">
                    {branch.name?.charAt(0) || "B"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {branch.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {branch.managerName || "No Manager"} • {branch.address || branch.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {formatCurrency(branch.dailySales)}
                    </div>
                    <div className="text-xs text-gray-400">today</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Branch Preview Cards */}
      <div className="space-y-3">
        {previewBranches.map((branch) => (
          <button
            key={branch.branchId || branch.id}
            onClick={() => setSelectedBranchId(branch.branchId || branch.id)}
            className="w-full p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md hover:border-brand-primary/30 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-soft group-hover:bg-brand-primary group-hover:text-white rounded-xl flex items-center justify-center font-bold text-brand-primary transition-colors">
                  {branch.name?.charAt(0) || "B"}
                </div>
                <div>
                  <div className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">
                    {branch.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Manager: {branch.managerName || "Not Assigned"}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-green-600">
                  {formatCurrency(branch.dailySales)}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {branch.activeTerminals || 0} terminals
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={() => setShowSearch(true)}
        className="w-full mt-4 py-2.5 text-sm font-medium text-brand-primary hover:bg-brand-soft rounded-xl transition-colors"
      >
        View All {totalBranches} Branches →
      </button>

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
