import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Search, Package, Loader2 } from 'lucide-react';
import { posService } from '../../services/posService';

export default function QuickAddModal({ onClose, onProductSelected }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // Stores list from API
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if(!query.trim()) return;
    
    setLoading(true);
    setResults([]);

    try {
        // Call the backend inventory search
        const res = await posService.searchInventory(query);
        
        // --- FIX: Extract List from ApiResponse ---
        // Backend returns: ApiResponse<List<DTO>> -> res.data.data
        const rawList = res.data?.data || [];
        
        const dataList = Array.isArray(rawList) ? rawList : [rawList];

        // --- FIX: Map Keys (sellingPrice -> price) ---
        const mappedList = dataList.map(item => ({
             ...item,
             id: item.productId || item.id,
             price: item.sellingPrice !== undefined ? item.sellingPrice : item.price
        }));

        setResults(mappedList);

    } catch (err) {
        console.error("Search failed", err);
        setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-[500px] h-[600px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-800 px-4 py-3 flex justify-between items-center shrink-0">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-400"/> Add to Quick Pick
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5"/>
                </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 shrink-0">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search Inventory</label>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" 
                        placeholder="Item Name or ID..." 
                    />
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                    </button>
                </form>
            </div>

            {/* Inventory Results List */}
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50 space-y-2 custom-scroll">
                {results.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Package className="w-12 h-12 mb-2 opacity-20"/>
                        <p className="text-sm">Search inventory to select items</p>
                    </div>
                )}

                {results.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center group">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{item.name}</h4>
                            <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{item.id}</span>
                                <span className="text-slate-400">|</span>
                                <span className="font-bold text-slate-700">LKR {item.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => onProductSelected(item)}
                            className="bg-slate-100 text-slate-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4"/> Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}