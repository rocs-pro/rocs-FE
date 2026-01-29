import React, { useEffect, useRef, useState } from 'react';

export default function IOModal({ type, onClose, onNotify }) {
  const inputRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        onNotify('error', 'Invalid Amount', 'Please enter a valid amount greater than 0.');
        return;
    }

    if (!reason.trim()) {
        onNotify('error', 'Reason Required', 'Please enter a reason for this transaction.');
        return;
    }

    // Trigger notification
    const title = type === 'PAID_IN' ? 'Cash In Recorded' : 'Cash Out Recorded';
    const msg = `Amount: LKR ${parseFloat(amount).toFixed(2)} | Reason: ${reason}`;
    
    onNotify('success', title, msg);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 px-4 py-3">
                <h3 className="text-white font-bold text-lg">{type === 'PAID_IN' ? 'Paid In (Cash In)' : 'Paid Out (Cash Out)'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                    <div className="flex items-center border border-slate-300 rounded bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200">
                        <span className="text-slate-400 font-mono mr-2">LKR</span>
                        <input 
                            ref={inputRef}
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent w-full text-lg font-mono font-bold text-slate-900 focus:outline-none" 
                            placeholder="0.00" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reason / Reference</label>
                    <textarea 
                        rows="2" 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                        placeholder="Enter reason..."
                    ></textarea>
                </div>
                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-2 border border-slate-300 rounded text-slate-700 font-bold text-sm hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700">Confirm</button>
                </div>
            </form>
        </div>
    </div>
  );
}