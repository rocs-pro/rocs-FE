import React, { useState, useEffect } from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function FloatModal({ onApprove, branchId, terminalId }) {
  // Initialize with default/loading state
  const [currentUser, setCurrentUser] = useState({ id: null, name: "Loading..." });
  
  const [amount, setAmount] = useState("");
  const [supUser, setSupUser] = useState("");
  const [supPass, setSupPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addNotification } = useNotification();

  // Load Logged-in User from LocalStorage on mount
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Map the storage data to our state
            // Ensure these keys match what AuthService returns (userId, username)
            setCurrentUser({
                id: parsedUser.userId,
                name: parsedUser.username
            });
        } else {
            addNotification('error', 'Session Error', 'No logged in user found. Please re-login.');
        }
    } catch (error) {
        console.error("Failed to parse user session", error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser.id) {
        addNotification('error', 'System Error', 'Cashier ID not identified. Please re-login.');
        return;
    }

    if (!amount || parseFloat(amount) < 0) {
        addNotification('warning', 'Float Required', 'Please enter a valid opening cash amount.');
        return;
    }
    
    if(!supUser || !supPass) {
        addNotification('warning', 'Supervisor Required', 'Supervisor credentials are required.');
        return;
    }

    setIsLoading(true);

    try {
        // Pass the CURRENT USER object to the parent handler
        await onApprove(currentUser, amount, { username: supUser, password: supPass });
    } catch (error) {
        setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            
            {/* Header */}
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
                
                {/* Cashier Display (Read Only) */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cashier</label>
                    <div className="flex items-center border border-slate-200 rounded bg-slate-100 px-3 py-2">
                        <User className="w-4 h-4 text-slate-500 mr-2" />
                        <input 
                            type="text" 
                            disabled 
                            value={currentUser.name}
                            className="bg-transparent w-full text-sm font-bold text-slate-700 focus:outline-none uppercase cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Amount Input */}
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
                
                {/* Supervisor Auth */}
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
                    disabled={isLoading || !currentUser.id} 
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded shadow-md uppercase tracking-wider text-sm transition-all"
                >
                    {isLoading ? "Verifying..." : "Approve & Open"}
                </button>
            </form>
        </div>
    </div>
  );
}