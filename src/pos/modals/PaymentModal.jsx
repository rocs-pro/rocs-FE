import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, X, CheckCircle, Trash2, Plus } from 'lucide-react';

export default function PaymentModal({ total, onClose, onProcess }) {
  // We now track a LIST of payments, not just one
  const [payments, setPayments] = useState([]);
  const [currentAmount, setCurrentAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [processing, setProcessing] = useState(false);

  // Calculate totals
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const remaining = total - totalPaid;
  const change = totalPaid > total ? totalPaid - total : 0;

  // Auto-fill remaining amount when modal opens or payments change
  useEffect(() => {
      if (remaining > 0) setCurrentAmount(remaining.toFixed(2));
      else setCurrentAmount("");
  }, [payments, total]);

  const addPayment = () => {
      const amt = parseFloat(currentAmount);
      if (!amt || amt <= 0) return;

      setPayments([...payments, { 
          type: method, 
          amount: amt,
          ref: method === 'CARD' ? `Ref-${Date.now().toString().slice(-4)}` : null 
      }]);
      setMethod("CASH"); // Reset to default
  };

  const removePayment = (index) => {
      const newPayments = [...payments];
      newPayments.splice(index, 1);
      setPayments(newPayments);
  };

  const handleFinalize = () => {
      if (remaining > 0.01) {
          alert(`Cannot finalize. LKR ${remaining.toFixed(2)} still pending.`);
          return;
      }
      setProcessing(true);
      // Send the ARRAY of payments to parent
      onProcess({ 
          payments: payments, 
          totalPaid: totalPaid,
          change: change 
      });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-[800px] h-[600px] rounded-2xl shadow-2xl flex overflow-hidden">
            
            {/* Left: Summary */}
            <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Summary</h2>
                
                <div className="space-y-4 flex-1">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs text-slate-500 font-bold uppercase">Total Due</div>
                        <div className="text-3xl font-mono font-bold text-slate-900">{total.toFixed(2)}</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-xs text-green-700 font-bold uppercase">Paid So Far</div>
                        <div className="text-2xl font-mono font-bold text-green-700">{totalPaid.toFixed(2)}</div>
                    </div>

                    {remaining > 0 ? (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-pulse">
                            <div className="text-xs text-red-700 font-bold uppercase">Remaining</div>
                            <div className="text-2xl font-mono font-bold text-red-700">{remaining.toFixed(2)}</div>
                        </div>
                    ) : (
                        <div className="bg-blue-600 p-4 rounded-xl border border-blue-500 shadow-lg text-white">
                            <div className="text-xs text-blue-100 font-bold uppercase">Change Due</div>
                            <div className="text-4xl font-mono font-bold">{change.toFixed(2)}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Payment Entry */}
            <div className="w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-700">Add Payment</h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-slate-400 hover:text-red-500"/></button>
                </div>

                {/* Input Area */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2 flex gap-2">
                        {['CASH', 'CARD', 'QR', 'TRANSFER'].map(m => (
                            <button 
                                key={m}
                                onClick={() => setMethod(m)}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm border-2 transition-all ${
                                    method === m ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    
                    <div className="col-span-2 relative">
                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold">LKR</span>
                        <input 
                            type="number" 
                            autoFocus
                            value={currentAmount}
                            onChange={e => setCurrentAmount(e.target.value)}
                            className="w-full pl-14 pr-4 py-3 text-2xl font-bold font-mono border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="0.00"
                        />
                        <button 
                            onClick={addPayment}
                            disabled={!currentAmount}
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Payment List Table */}
                <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-2 mb-4">
                    {payments.length === 0 && <div className="text-center text-slate-400 py-10 text-sm">No payments added yet.</div>}
                    {payments.map((p, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-2 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2 rounded-full">
                                    {p.type === 'CASH' ? <Banknote className="w-4 h-4 text-green-600"/> : <CreditCard className="w-4 h-4 text-purple-600"/>}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{p.type}</div>
                                    <div className="text-[10px] text-slate-400">{p.ref || 'No Ref'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-bold text-slate-700">{p.amount.toFixed(2)}</span>
                                <button onClick={() => removePayment(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Complete Button */}
                <button 
                    onClick={handleFinalize}
                    disabled={remaining > 0.01 || processing}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-xl flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {processing ? "Processing Transaction..." : <><CheckCircle className="w-5 h-5"/> Complete Sale</>}
                </button>
            </div>
        </div>
    </div>
  );
}