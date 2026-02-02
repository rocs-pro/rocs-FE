import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Box, User, Settings, ArrowRight } from 'lucide-react';
import { posService } from '../services/posService';

export default function SmartCommand({ isOpen, onClose, onAddProduct, onSelectCustomer, onExecCommand }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 50);
        setQuery("");
        setResults([]);
    }
  }, [isOpen]);

  // Smart Search Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (!query.trim()) { setResults([]); return; }

        // 1. Detect Commands
        if (query.startsWith('>')) {
            const cmd = query.slice(1).toLowerCase();
            const commands = [
                { id: 'cmd_drawer', type: 'CMD', title: 'Open Cash Drawer', icon: Box },
                { id: 'cmd_return', type: 'CMD', title: 'Switch to Return Mode', icon: ArrowRight },
                { id: 'cmd_reprint', type: 'CMD', title: 'Reprint Last Receipt', icon: Settings },
            ].filter(c => c.title.toLowerCase().includes(cmd));
            setResults(commands);
            return;
        }

        // 2. Search API (Products + Customers mixed)
        try {
            const res = await posService.searchInventory(query);
            const products = (res.data.data || []).map(p => ({
                id: p.id || p.productId,
                type: 'PROD',
                title: p.name,
                subtitle: `LKR ${p.sellingPrice?.toFixed(2)} | Stock: ${p.stock || 'N/A'}`,
                icon: Box,
                data: p
            }));
            
            // Allow selecting the raw text as a barcode scan
            const scanOption = { id: 'scan_raw', type: 'SCAN', title: `Scan Code: "${query}"`, icon: Search, data: query };
            
            setResults([scanOption, ...products]);
            setSelectedIndex(0);
        } catch (e) { console.error(e); }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') setSelectedIndex(i => Math.min(i + 1, results.length - 1));
      if (e.key === 'ArrowUp') setSelectedIndex(i => Math.max(i - 1, 0));
      if (e.key === 'Enter') {
          if (results[selectedIndex]) handleSelect(results[selectedIndex]);
      }
      if (e.key === 'Escape') onClose();
  };

  const handleSelect = (item) => {
      if (item.type === 'PROD') onAddProduct(item.data);
      if (item.type === 'SCAN') onAddProduct(item.data); // Treat as barcode
      if (item.type === 'CMD') onExecCommand(item.id);
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-32">
        <div className="bg-white w-[600px] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200 border border-slate-200">
            <div className="flex items-center px-4 border-b border-slate-100">
                <Command className="w-5 h-5 text-slate-400" />
                <input 
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-4 text-lg outline-none placeholder:text-slate-400 font-medium text-slate-700"
                    placeholder="Search items, customers, or type '>' for commands..."
                />
                <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">ESC</div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto bg-slate-50 p-2">
                {results.length === 0 && query && (
                    <div className="p-4 text-center text-slate-400 text-sm">No results found.</div>
                )}
                {results.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelect(item)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                            idx === selectedIndex ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-200 text-slate-700'
                        }`}
                    >
                        <item.icon className={`w-5 h-5 ${idx === selectedIndex ? 'text-blue-200' : 'text-slate-400'}`} />
                        <div>
                            <div className="font-bold text-sm">{item.title}</div>
                            {item.subtitle && <div className={`text-xs ${idx === selectedIndex ? 'text-blue-100' : 'text-slate-500'}`}>{item.subtitle}</div>}
                        </div>
                        {idx === selectedIndex && <ArrowRight className="w-4 h-4 ml-auto opacity-50" />}
                    </button>
                ))}
            </div>
            
            <div className="bg-slate-100 p-2 text-[10px] text-slate-500 flex justify-between px-4 border-t border-slate-200">
                <span><strong>↑↓</strong> to navigate</span>
                <span><strong>Enter</strong> to select</span>
            </div>
        </div>
    </div>
  );
}