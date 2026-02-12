import React, { useState, useEffect } from 'react';
import { Package, Plus, Loader2, AlertCircle, RefreshCw, Tag, X, Trash2 } from 'lucide-react';
import { getQuickItems, saveQuickItemsHelper } from '../../shared/storage';

export default function ProductGrid({ onAddToCart, onAddQuickItemClick, refreshTrigger, branchId, terminalId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load quick items from localStorage on mount
  useEffect(() => {
    loadQuickItems();
  }, [refreshTrigger, terminalId]);

  const loadQuickItems = () => {
    setLoading(true);
    try {
        const items = getQuickItems(terminalId);
        setProducts(items);
    } catch (err) {
        console.error("Failed to load quick items from storage", err);
        setProducts([]);
    } finally {
        setLoading(false);
    }
  };

  // Save quick items to localStorage
  const saveQuickItems = (items) => {
    try {
        saveQuickItemsHelper(terminalId, items);
        setProducts(items);
    } catch (err) {
        console.error("Failed to save quick items", err);
    }
  };

  // Add a product to quick pick (called from QuickAddModal)
  const addToQuickPick = (product) => {
    const newItem = {
        id: product.productId || product.id,
        sku: product.sku,
        barcode: product.barcode,
        name: product.name || product.productName,
        price: parseFloat(product.sellingPrice || product.price || 0),
        taxRate: parseFloat(product.taxRate || 0),
        isActive: true
    };
    
    // Check if already exists
    const exists = products.some(p => p.id === newItem.id);
    if (!exists) {
        const updated = [...products, newItem];
        saveQuickItems(updated);
    }
    return !exists;
  };

  // Remove a product from quick pick
  const removeFromQuickPick = (productId) => {
    const updated = products.filter(p => p.id !== productId);
    saveQuickItems(updated);
  };

  // Clear all quick pick items
  const clearAllQuickPick = () => {
    saveQuickItems([]);
    setEditMode(false);
  };

  // Handle adding product to cart - pass full product object
  const handleAddProduct = (product) => {
    onAddToCart(product);
  };

  // Format price with proper locale
  const formatPrice = (price) => {
    return price.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 overflow-y-auto custom-scroll">
      
      {/* Header */}
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Package className="w-4 h-4" /> Quick Pick Items
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-full text-slate-600">
                {products.length}
            </span>
        </h2>
        <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin"/>}
            {products.length > 0 && (
                <button 
                    onClick={() => setEditMode(!editMode)}
                    className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                        editMode 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                >
                    {editMode ? 'Done' : 'Edit'}
                </button>
            )}
            {editMode && products.length > 0 && (
                <button 
                    onClick={clearAllQuickPick}
                    className="text-xs font-bold px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                >
                    <Trash2 className="w-3 h-3" /> Clear All
                </button>
            )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-3 content-start">
        
        {/* Render Saved Items */}
        {products.map((product) => (
            <div key={product.id} className="relative">
                {/* Remove button in edit mode */}
                {editMode && (
                    <button 
                        onClick={() => removeFromQuickPick(product.id)}
                        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <button 
                    onClick={() => !editMode && handleAddProduct(product)}
                    disabled={editMode}
                    className={`w-full bg-white border rounded-xl p-3 h-28 flex flex-col justify-between shadow-sm transition-all active:scale-[0.98] group ${
                        editMode 
                            ? 'border-red-200 bg-red-50 cursor-default animate-pulse' 
                            : 'border-slate-200 hover:shadow-md hover:border-blue-400 hover:bg-blue-50'
                    }`}
                >
                    {/* SKU Badge */}
                    <div className="w-full flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:text-blue-500 transition-colors font-mono">
                            {product.sku || `P${product.id}`}
                        </span>
                    </div>
                    
                    {/* Product Name */}
                    <div className="text-sm font-bold text-slate-700 leading-tight line-clamp-2 group-hover:text-blue-700 text-left">
                        {product.name}
                    </div>
                    
                    {/* Price */}
                    <div className="w-full flex justify-end">
                        <span className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                </button>
            </div>
        ))}

        {/* Manual Add Button */}
        <button 
            onClick={onAddQuickItemClick}
            className="border-2 border-dashed border-slate-300 rounded-xl p-3 h-28 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-[0.98]"
        >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">Add item</span>
        </button>

      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-8 text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No quick pick items yet</p>
            <p className="text-xs mt-1">Click "Add item" to search and add products</p>
        </div>
      )}
    </div>
  );
}