import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, X, Loader2 } from 'lucide-react';
import { posService } from '../../services/posService';

export default function IOModal({ type, shiftId, onClose, onNotify }) {
  const inputRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [loading, setLoading] = useState(false);

  const isPaidIn = type === 'PAID_IN';
  const Icon = isPaidIn ? ArrowUpRight : ArrowDownLeft;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        onNotify('error', 'Invalid Amount', 'Please enter a valid amount greater than 0.');
        return;
    }

    if (!reason.trim()) {
        onNotify('error', 'Reason Required', 'Please enter a reason for this transaction.');
        return;
    }

    if (!shiftId) {
        onNotify('error', 'No Active Shift', 'Cannot record cash flow without an active shift.');
        return;
    }

    setLoading(true);

    try {
        // Record cash flow to backend - matches cash_flows table
        await posService.recordCashFlow({
            shiftId: shiftId,
            amount: parsedAmount,
            type: type, // PAID_IN or PAID_OUT
            reason: reason.trim(),
            referenceNo: referenceNo.trim() || null
        });

        // Success notification
        const title = isPaidIn ? 'Cash In Recorded' : 'Cash Out Recorded';
        const msg = `Amount: LKR ${parsedAmount.toFixed(2)} | Reason: ${reason}`;
        
        onNotify('success', title, msg);
        onClose();
    } catch (err) {
        console.error("Cash flow error:", err);
        const errorMsg = err.response?.data?.message || 'Failed to record cash flow';
        onNotify('error', 'Transaction Failed', errorMsg);
        setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-[420px] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className={`px-4 py-3 flex justify-between items-center ${isPaidIn ? 'bg-blue-900' : 'bg-red-900'}`}>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${isPaidIn ? 'text-blue-300' : 'text-red-300'}`} />
                    {isPaidIn ? 'Paid In (Cash In)' : 'Paid Out (Cash Out)'}
                </h3>
                <button onClick={onClose} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5"/>
                </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Description */}
                <div className={`p-3 rounded-lg border ${isPaidIn ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
                    <p className={`text-xs ${isPaidIn ? 'text-blue-700' : 'text-red-700'}`}>
                        {isPaidIn 
                            ? 'Record cash being added to the register (e.g., change from bank, petty cash)'
                            : 'Record cash being removed from the register (e.g., expenses, cash pickups)'
                        }
                    </p>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount *</label>
                    <div className={`flex items-center border rounded-lg bg-white px-3 py-2 focus-within:ring-2 ${
                        isPaidIn ? 'border-blue-300 focus-within:border-blue-500 focus-within:ring-blue-100' 
                                 : 'border-red-300 focus-within:border-red-500 focus-within:ring-red-100'
                    }`}>
                        <span className="text-slate-400 font-mono mr-2">LKR</span>
                        <input 
                            ref={inputRef}
                            type="number" 
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loading}
                            className="bg-transparent w-full text-xl font-mono font-bold text-slate-900 focus:outline-none" 
                            placeholder="0.00" 
                        />
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reason / Description *</label>
                    <textarea 
                        rows="2" 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={loading}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                        placeholder="Enter reason for this transaction..."
                    ></textarea>
                </div>

                {/* Reference No (Optional) */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Reference No. <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input 
                        type="text"
                        value={referenceNo}
                        onChange={(e) => setReferenceNo(e.target.value)}
                        disabled={loading}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" 
                        placeholder="Receipt/Voucher number..."
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={loading}
                        className="flex-1 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`flex-1 py-2.5 text-white rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${
                            isPaidIn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Recording...
                            </>
                        ) : (
                            <>
                                <Icon className="w-4 h-4" /> Confirm {isPaidIn ? 'Paid In' : 'Paid Out'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}