import React, { useState, useEffect } from 'react';
import { Package, Plus, Loader2 } from 'lucide-react';
import { posService } from '../../services/posService';

export default function ProductGrid({ onAddToCart, onAddQuickItemClick, refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuickItems();
  }, [refreshTrigger]);

  const loadQuickItems = async () => {
    setLoading(true);
    try {
        const res = await posService.getQuickItems();
        // Ensure we always work with an array
        setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
        console.error("Failed to load quick items", err);
        setProducts([]);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 overflow-y-auto custom-scroll">
      
      {/* Header */}
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Package className="w-4 h-4" /> Quick Pick Items
        </h2>
        {loading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin"/>}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-3 content-start">
        
        {/* Render Saved Items */}
        {products.map((product) => (
            <button 
                key={product.id}
                onClick={() => onAddToCart(product.id)}
                className="bg-white border border-slate-200 rounded-xl p-3 h-28 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-[0.98] group"
            >
                <div className="w-full flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:text-blue-500 transition-colors">
                        {product.id}
                    </span>
                </div>
                
                <div className="text-sm font-bold text-slate-700 leading-tight line-clamp-2 group-hover:text-blue-700 text-left">
                    {product.name}
                </div>
                
                <div className="w-full text-right">
                    <span className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {product.price.toFixed(2)}
                    </span>
                </div>
            </button>
        ))}

        {/* Manual Add Button */}
        <button 
            onClick={onAddQuickItemClick}
            className="border-2 border-dashed border-slate-300 rounded-xl p-3 h-28 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-[0.98]"
        >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100">
                <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">Add item</span>
        </button>

      </div>
    </div>
  );
}