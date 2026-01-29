import React, { useState, useMemo } from 'react';
import { Power, ArrowRight, ShieldCheck, Banknote, AlertTriangle, CheckCircle, Calculator, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const DENOMINATIONS = [5000, 1000, 500, 100, 50, 20, 10, 5, 2, 1];

export default function EndShiftModal({ cashierName, expectedTotals, onClose, onConfirm }) {
  const [step, setStep] = useState(1); 
  const [counts, setCounts] = useState({});
  const [supUser, setSupUser] = useState("");
  const [supPass, setSupPass] = useState("");
  const [loading, setLoading] = useState(false);

  const totalCountedCash = useMemo(() => {
    return DENOMINATIONS.reduce((total, denom) => {
        return total + (denom * (parseInt(counts[denom]) || 0));
    }, 0);
  }, [counts]);

  const handleCountChange = (denom, qty) => {
      setCounts(prev => ({ ...prev, [denom]: qty }));
  };

  const handleFinalSubmit = async () => {
      if(!supUser || !supPass) {
          alert("Supervisor approval is required to finalize.");
          return;
      }
      setLoading(true);
      try {
          await onConfirm(totalCountedCash, { username: supUser, password: supPass });
      } catch (error) {
          console.error("Logout Error:", error);
          alert("Failed to close shift. Please try again.");
          setLoading(false);
      }
  };

  // SAFE CALCULATION: Handle missing API data
  const hasData = !!expectedTotals;
  const systemCash = hasData ? expectedTotals.expectedCash : 0;
  const variance = totalCountedCash - systemCash;
  const isBalanced = Math.abs(variance) < 1.0; 

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white w-[700px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* HEADER */}
            <div className="bg-slate-900 p-4 shrink-0 flex justify-between items-center">
                <div>
                    <h2 className="text-white font-bold text-lg tracking-wide uppercase flex items-center gap-2">
                        <Power className="w-5 h-5 text-red-500" /> End of Shift
                    </h2>
                    <p className="text-slate-400 text-xs">Cashier: <span className="text-white font-bold">{cashierName}</span></p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Step</span>
                    <div className="text-white font-mono font-bold text-xl leading-none">{step} / 2</div>
                </div>
            </div>

            {/* COUNTING (Always Works) */}
            {step === 1 && (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="bg-slate-50 p-3 border-b border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-blue-600" /> Cash Declaration
                        </h3>
                    </div>
                    
                    {/* Added overflow-x-hidden to prevent horizontal scrollbar */}
                    <div className="overflow-y-auto overflow-x-hidden p-4 custom-scroll grid grid-cols-2 gap-3">
                        {DENOMINATIONS.map(denom => (
                            <div key={denom} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 hover:border-blue-300">
                                {/* Fixed width w-16 and shrink-0 ensures perfect vertical alignment */}
                                <div className="w-16 shrink-0 font-mono font-bold text-slate-700 text-right">{denom}</div>
                                <span className="text-slate-400 text-xs">x</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    className="flex-1 min-w-0 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                                    placeholder="0"
                                    value={counts[denom] || ""}
                                    onChange={(e) => handleCountChange(denom, e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-100 border-t border-slate-200 shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-slate-600 uppercase">Total Declared</span>
                            <span className="text-2xl font-mono font-bold text-slate-900">
                                <span className="text-sm text-slate-400 mr-1">LKR</span>
                                {totalCountedCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                            Next: View Summary <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* SUMMARY (Handles Missing Data) */}
            {step === 2 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                        
                        {/* VARIANCE CARD */}
                        {/* If API is down, we show Neutral Grey state instead of Red/Green */}
                        <div className={`rounded-xl border p-4 ${!hasData ? 'bg-slate-50 border-slate-200' : isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-xs font-bold uppercase flex items-center gap-2 ${!hasData ? 'text-slate-600' : isBalanced ? 'text-green-800' : 'text-red-800'}`}>
                                    {!hasData ? <Calculator className="w-4 h-4"/> : isBalanced ? <CheckCircle className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
                                    {!hasData ? "Offline / Syncing..." : isBalanced ? "Shift Balanced" : "Cash Discrepancy"}
                                </h3>
                                {hasData && (
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${isBalanced ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {variance > 0 ? "+" : ""}{variance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">System Expected:</span>
                                {/* Display '---' if API missing */}
                                <span className="font-mono font-bold text-slate-900">
                                    {hasData ? expectedTotals.expectedCash.toLocaleString() : "---"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">You Declared:</span>
                                <span className="font-mono font-bold text-slate-900">{totalCountedCash.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* CASH FLOW (Hide if no data) */}
                        {hasData ? (
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cash Flow</h4>
                            <div className="bg-slate-50 rounded-lg border border-slate-200 text-sm overflow-hidden">
                                <div className="flex justify-between p-2 border-b border-slate-100">
                                    <span className="text-slate-600">Opening Float</span>
                                    <span className="font-mono font-bold text-slate-700">{expectedTotals.openingFloat.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-slate-100 bg-white">
                                    <span className="text-slate-600">Cash Sales</span>
                                    <span className="font-mono font-bold text-green-600">+{expectedTotals.cashSales.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 border-b border-slate-100">
                                    <span className="text-slate-600 flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-blue-500"/> Paid In</span>
                                    <span className="font-mono font-bold text-blue-600">+{expectedTotals.paidIn.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-red-50/50">
                                    <span className="text-slate-600 flex items-center gap-1"><ArrowDownLeft className="w-3 h-3 text-red-500"/> Paid Out</span>
                                    <span className="font-mono font-bold text-red-600">-{expectedTotals.paidOut.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        ) : (
                            <div className="text-center p-4 bg-slate-50 rounded border border-slate-200 border-dashed text-slate-400 text-xs">
                                System details unavailable (Offline Mode)
                            </div>
                        )}

                        {/* CARD DETAILS (Hide if no data) */}
                        {hasData && (
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                                <span>Card Transactions</span>
                                <span className="text-slate-500">Count: {expectedTotals.cardCount}</span>
                            </h4>
                            <div className="bg-slate-50 rounded-lg border border-slate-200 text-sm p-3 space-y-2">
                                {expectedTotals.bankBreakdown && Object.entries(expectedTotals.bankBreakdown).map(([bank, amount]) => (
                                    <div key={bank} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <CreditCard className="w-3 h-3 text-slate-400"/> {bank}
                                        </span>
                                        <span className="font-mono font-bold text-slate-700">{amount.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold">
                                    <span className="text-slate-800">Total Cards</span>
                                    <span className="font-mono text-blue-700">{expectedTotals.cardTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* APPROVAL */}
                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                            <h3 className="text-xs font-bold text-amber-800 uppercase mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Supervisor Approval
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" value={supUser} onChange={e => setSupUser(e.target.value)} className="border border-amber-200 bg-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400" placeholder="Username" />
                                <input type="password" value={supPass} onChange={e => setSupPass(e.target.value)} className="border border-amber-200 bg-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-400" placeholder="Password" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-3 shrink-0">
                         <button onClick={() => setStep(1)} disabled={loading} className="py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm uppercase">
                            Back
                        </button>
                        <button 
                            onClick={handleFinalSubmit} 
                            disabled={loading}
                            className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? "Verifying..." : "Approve & Logout"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}