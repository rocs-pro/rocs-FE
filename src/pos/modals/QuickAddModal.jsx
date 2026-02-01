import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Search, Package, Loader2, Star, ShoppingCart, Check } from 'lucide-react';
import { posService } from '../../services/posService';

export default function QuickAddModal({ onClose, onProductSelected, onAddToQuickPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [addedToQuickPick, setAddedToQuickPick] = useState(new Set());
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
        // Uses the search endpoint returning a LIST
        const res = await posService.searchInventory(query);
        const rawList = res.data?.data || res.data || [];
        
        console.log("Search results:", rawList);
        
        // Map DTO keys
        const mappedList = (Array.isArray(rawList) ? rawList : [rawList]).map(item => ({
             id: item.productId || item.id,
             sku: item.sku,
             barcode: item.barcode,
             name: item.name || item.productName,
             price: parseFloat(item.sellingPrice !== undefined ? item.sellingPrice : item.price || 0),
             taxRate: parseFloat(item.taxRate || 0),
             stock: item.stock || item.availableQty
        }));

        setResults(mappedList);

    } catch (err) {
        console.error("Search failed", err);
        setResults([]);
    }
    setLoading(false);
  };

  // Add to cart immediately
  const handleAddToCart = (item) => {
    onProductSelected(item);
  };

  // Add to quick pick panel
  const handleAddToQuickPickPanel = (item) => {
    if (onAddToQuickPick) {
        const added = onAddToQuickPick(item);
        if (added) {
            setAddedToQuickPick(prev => new Set([...prev, item.id]));
        }
    }
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-[550px] h-[620px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            
            <div className="bg-slate-800 px-4 py-3 flex justify-between items-center shrink-0">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-400"/> Search & Add Products
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5"/>
                </button>
            </div>

            <div className="p-4 border-b border-slate-100 shrink-0 bg-slate-50">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search by Name, SKU, or Barcode</label>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all" 
                        placeholder="Type product name or scan barcode..." 
                    />
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                    </button>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-3 bg-slate-50 space-y-2 custom-scroll">
                {results.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Package className="w-14 h-14 mb-3 opacity-20"/>
                        <p className="text-sm font-medium">Search inventory to find products</p>
                        <p className="text-xs mt-1">Enter product name, SKU, or barcode</p>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2"/>
                        <p className="text-sm">Searching...</p>
                    </div>
                )}

                {results.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{item.name}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{item.sku || item.id}</span>
                                    {item.barcode && (
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">{item.barcode}</span>
                                    )}
                                    <span className="font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                        LKR {item.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                                    </span>
                                    {item.stock !== undefined && (
                                        <span className={`px-1.5 py-0.5 rounded ${item.stock > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                            Stock: {item.stock}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 ml-3">
                                {/* Add to Quick Pick Button */}
                                {onAddToQuickPick && (
                                    <button 
                                        onClick={() => handleAddToQuickPickPanel(item)}
                                        disabled={addedToQuickPick.has(item.id)}
                                        className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                                            addedToQuickPick.has(item.id)
                                                ? 'bg-green-100 text-green-600 cursor-default'
                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                        }`}
                                        title="Add to Quick Pick panel"
                                    >
                                        {addedToQuickPick.has(item.id) ? (
                                            <><Check className="w-3.5 h-3.5"/> Added</>
                                        ) : (
                                            <><Star className="w-3.5 h-3.5"/> Quick Pick</>
                                        )}
                                    </button>
                                )}
                                
                                {/* Add to Cart Button */}
                                <button 
                                    onClick={() => handleAddToCart(item)}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                                    title="Add to cart"
                                >
                                    <ShoppingCart className="w-3.5 h-3.5"/> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Footer hint */}
            <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 flex items-center gap-4 shrink-0">
                <span className="flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3"/> Add to Cart = adds to current bill
                </span>
                <span className="flex items-center gap-1">
                    <Star className="w-3 h-3"/> Quick Pick = saves for fast access
                </span>
            </div>
        </div>
    </div>
  );
}