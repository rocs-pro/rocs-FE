import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ChevronDown, Banknote } from 'lucide-react';
// Correct path to context
import { useNotification } from '../context/NotificationContext';

const CASHIERS = [
  { id: 1, name: "Cashier 01 - John" },
  { id: 2, name: "Cashier 02 - Sarah" },
  { id: 3, name: "Cashier 03 - Mike" }
];

export default function FloatModal({ onApprove, branchId, terminalId }) {
  const [selectedCashierId, setSelectedCashierId] = useState(CASHIERS[0].id);
  const [amount, setAmount] = useState("");
  // STATE FOR SUPERVISOR
  const [supUser, setSupUser] = useState("");
  const [supPass, setSupPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
        addNotification('warning', 'Float Required', 'Please enter the opening cash amount.');
        return;
    }
    
    // Validate that supervisor details are entered
    if(!supUser || !supPass) {
        addNotification('warning', 'Supervisor Required', 'Supervisor credentials are required to open the terminal.');
        return;
    }

    setIsLoading(true);

    try {
        // Find full cashier object to pass back
        const selectedCashier = CASHIERS.find(c => c.id === Number(selectedCashierId));
        
        // Send all data including supervisor creds (awaiting response)
        await onApprove(selectedCashier, amount, { username: supUser, password: supPass });
        
        // Success: Modal closes automatically via parent state change
    } catch (error) {
        // Reset loading so user can retry
        setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-4 text-center">
                <h2 className="text-white font-bold text-lg tracking-wide uppercase flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-400" /> Open Terminal
                </h2>
                <div className="flex justify-center gap-4 mt-2 text-[13px] text-slate-400 font-mono uppercase">
                    <span>Branch: <span className="text-white">{branchId}</span></span>
                    <span>Terminal: <span className="text-white">{terminalId}</span></span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Cashier</label>
                    <div className="flex items-center border border-slate-300 rounded bg-slate-50 px-3 py-2 relative">
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                        <select 
                            value={selectedCashierId} 
                            onChange={e => setSelectedCashierId(e.target.value)} 
                            disabled={isLoading}
                            className="bg-transparent w-full text-sm font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                        >
                            {CASHIERS.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Opening Float Amount</label>
                    <div className="flex items-center border border-blue-300 rounded bg-white px-3 py-2 shadow-sm">
                        <span className="text-slate-400 font-mono mr-2">LKR</span>
                        <input 
                            autoFocus 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            disabled={isLoading}
                            className="bg-transparent w-full text-lg font-mono font-bold text-slate-900 focus:outline-none" 
                            placeholder="0.00" 
                        />
                    </div>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                
                {/* CONNECTED SUPERVISOR INPUTS */}
                <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                    <p className="text-[10px] font-bold text-yellow-800 uppercase mb-2 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Supervisor Approval
                    </p>
                    <div className="space-y-2">
                        <input 
                            type="text" 
                            value={supUser}
                            onChange={(e) => setSupUser(e.target.value)}
                            disabled={isLoading}
                            className="w-full border border-yellow-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-yellow-400" 
                            placeholder="Supervisor Username" 
                        />
                        <input 
                            type="password" 
                            value={supPass}
                            onChange={(e) => setSupPass(e.target.value)}
                            disabled={isLoading}
                            className="w-full border border-yellow-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-yellow-400" 
                            placeholder="Password" 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded shadow-md uppercase tracking-wider text-sm transition-all"
                >
                    {isLoading ? "Verifying..." : "Approve & Open"}
                </button>
            </form>
        </div>
    </div>
  );
}