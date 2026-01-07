import React, { useState } from 'react';
import { Power, UserCheck, ShieldAlert } from 'lucide-react';

export default function EndShiftModal({ cashierName, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
      if(!amount) return;
      setLoading(true);
      onConfirm(amount); // Triggers API call in parent
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-4 text-center">
                <h2 className="text-white font-bold text-lg tracking-wide uppercase flex items-center justify-center gap-2">
                    <Power className="w-5 h-5 text-red-500" /> Close Terminal
                </h2>
                <p className="text-slate-400 text-xs mt-1">End of Shift Declaration</p>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Cashier</label>
                    <div className="flex items-center border border-slate-200 rounded bg-slate-100 px-3 py-2">
                        <UserCheck className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm font-bold text-slate-600">{cashierName}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Closing Cash Amount</label>
                    <div className="flex items-center border border-red-300 rounded bg-white px-3 py-2 shadow-sm">
                        <span className="text-slate-400 font-mono mr-2">LKR</span>
                        <input 
                            autoFocus 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="bg-transparent w-full text-lg font-mono font-bold text-slate-900 focus:outline-none" 
                            placeholder="0.00" 
                        />
                    </div>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="bg-red-50 p-3 rounded border border-red-100">
                    <p className="text-[10px] font-bold text-red-800 uppercase mb-2 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Supervisor Approval
                    </p>
                    <div className="space-y-2">
                        <input type="text" className="w-full border border-red-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-400" placeholder="Supervisor Username" />
                        <input type="password" className="w-full border border-red-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-400" placeholder="Password" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                     <button onClick={onClose} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded shadow-sm uppercase tracking-wider text-xs">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded shadow-md uppercase tracking-wider text-xs">
                        {loading ? "Closing..." : "Close Shift"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}