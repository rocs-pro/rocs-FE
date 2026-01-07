import React, { useEffect, useState } from 'react';
import { Zap, Package } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function ProductGrid({ onAddToCart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // API Fetch
    posService.getQuickItems()
        .then(res => setItems(res.data))
        .catch(err => console.error("Failed to load quick items", err));
  }, []);

  return (
    <div className="w-4/12 bg-slate-50 flex flex-col h-full border-l border-slate-200">
       <div className="p-3 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Quick Pick Items
          </h3>
       </div>
       
       <div className="flex-1 overflow-y-auto p-3 custom-scroll">
          <div className="grid grid-cols-2 gap-3">
             {items.map((item) => (
               <button 
                 key={item.id} 
                 onClick={() => onAddToCart(item.id)}
                 className="h-24 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:border-blue-500 hover:shadow-md flex flex-col justify-center items-center group transition-all active:scale-95"
               >
                 <Package className="w-6 h-6 text-slate-300 mb-1 group-hover:text-blue-500" />
                 <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 leading-none mb-1">{item.name}</span>
                 <span className="text-xs text-slate-500 font-mono">{item.price.toFixed(2)}</span>
               </button>
             ))}
          </div>
       </div>
    </div>
  );

}