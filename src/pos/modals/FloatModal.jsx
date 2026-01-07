import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ChevronDown } from 'lucide-react';

export default function FloatModal({ onApprove }) {
  const [cashier, setCashier] = useState("Cashier 01");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!amount) return;
    setIsLoading(true);
    // Pass both cashier and amount back to POSScreen to handle API call
    onApprove(cashier, amount);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-4 text-center">
                <h2 className="text-white font-bold text-lg tracking-wide uppercase flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-400" /> Open Terminal
                </h2>
                <p className="text-slate-400 text-xs mt-1">Float Declaration Required</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Cashier</label>
                    <div className="flex items-center border border-slate-300 rounded bg-slate-50 px-3 py-2 relative">
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                        <select value={cashier} onChange={e => setCashier(e.target.value)} className="bg-transparent w-full text-sm font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer">
                            <option>Cashier 01</option>
                            <option>Cashier 02</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Opening Float Amount</label>
                    <div className="flex items-center border border-blue-300 rounded bg-white px-3 py-2 shadow-sm">
                        <span className="text-slate-400 font-mono mr-2">LKR</span>
                        <input autoFocus type="number" value={amount} onChange={e => setAmount(e.target.value)} className="bg-transparent w-full text-lg font-mono font-bold text-slate-900 focus:outline-none" placeholder="0.00" />
                    </div>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded shadow-md uppercase tracking-wider text-sm transition-all">
                    {isLoading ? "Verifying..." : "Approve & Open"}
                </button>
            </form>
        </div>
    </div>
  );
}