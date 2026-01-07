import React, { useState, useEffect } from 'react';
import { RotateCcw, X, Search, Clock, CornerUpLeft } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function ListModal({ type, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]); // Fetch Data
  
  const title = type === 'RECALL' ? 'Recall Bill' : 'Return Bill';
  const Icon = type === 'RECALL' ? RotateCcw : CornerUpLeft;

  useEffect(() => {
    // API Call: Fetch bills based on type
    const status = type === 'RECALL' ? 'HELD' : 'COMPLETED';
    posService.getBills(status)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
  }, [type]);

  const filteredData = data.filter(item => item.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
      <div className="bg-white w-[600px] h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-slate-900 px-4 py-3 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold text-lg flex items-center gap-2"><Icon className="w-5 h-5" /> {title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input autoFocus type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="Search by Invoice No..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll p-0">
            {filteredData.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No records found.</div>
            ) : (
                filteredData.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => onSelect(item)}>
                        <div>
                            <div className="font-bold text-slate-800 text-sm">{item.id}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> {item.time}
                                <span className="bg-yellow-100 text-yellow-800 px-1.5 rounded text-[10px] font-bold">{item.items} Items</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono font-bold text-slate-900 text-sm">{item.total.toFixed(2)}</div>
                            <button className="mt-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 font-bold uppercase">Select</button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
