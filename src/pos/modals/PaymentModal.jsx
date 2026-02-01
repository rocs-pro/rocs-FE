import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Banknote, X, CheckCircle, Trash2, Plus, QrCode, Building2, Loader2 } from 'lucide-react';

const PAYMENT_METHODS = [
    { key: 'CASH', label: 'Cash', icon: Banknote, color: 'green' },
    { key: 'CARD', label: 'Card', icon: CreditCard, color: 'purple' },
    { key: 'QR', label: 'QR Pay', icon: QrCode, color: 'blue' },
    { key: 'TRANSFER', label: 'Transfer', icon: Building2, color: 'slate' }
];

export default function PaymentModal({ total, initialMethod = 'CASH', onClose, onProcess }) {
  // Track multiple payments matching the payments table structure
  const [payments, setPayments] = useState([]);
  const [currentAmount, setCurrentAmount] = useState("");
  const [method, setMethod] = useState(initialMethod);
  const [referenceNo, setReferenceNo] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [bankName, setBankName] = useState("");
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef(null);

  // Calculate totals
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const remaining = Math.max(0, total - totalPaid);
  const change = totalPaid > total ? totalPaid - total : 0;

  // Auto-fill remaining amount when modal opens or payments change
  useEffect(() => {
      if (remaining > 0) setCurrentAmount(remaining.toFixed(2));
      else setCurrentAmount("");
      inputRef.current?.focus();
  }, [payments.length, total]);

  const addPayment = () => {
      const amt = parseFloat(currentAmount);
      if (!amt || amt <= 0) return;

      // Create payment object matching payments table structure
      const newPayment = { 
          paymentType: method, 
          amount: amt,
          referenceNo: method !== 'CASH' ? (referenceNo || `REF-${Date.now().toString().slice(-6)}`) : null,
          cardLast4: method === 'CARD' ? cardLast4 : null,
          bankName: ['CARD', 'TRANSFER'].includes(method) ? bankName : null
      };

      setPayments([...payments, newPayment]);
      
      // Reset input fields
      setCurrentAmount("");
      setReferenceNo("");
      setCardLast4("");
      setBankName("");
      setMethod("CASH");
      inputRef.current?.focus();
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
      
      // Send payment data to parent - matching payments table structure
      onProcess({ 
          payments: payments,
          totalPaid: totalPaid,
          change: change,
          paidAmount: totalPaid,
          changeAmount: change
      });
  };

  const handleKeyDown = (e) => {
      if (e.key === 'Enter' && currentAmount) {
          e.preventDefault();
          addPayment();
      }
  };

  const getPaymentIcon = (type) => {
      const pm = PAYMENT_METHODS.find(m => m.key === type);
      if (!pm) return <Banknote className="w-4 h-4 text-slate-600"/>;
      const Icon = pm.icon;
      return <Icon className={`w-4 h-4 text-${pm.color}-600`}/>;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-[850px] h-[650px] rounded-2xl shadow-2xl flex overflow-hidden">
            
            {/* Left: Summary */}
            <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Summary</h2>
                
                <div className="space-y-4 flex-1">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs text-slate-500 font-bold uppercase">Total Due</div>
                        <div className="text-3xl font-mono font-bold text-slate-900">
                            <span className="text-lg text-slate-400">LKR </span>
                            {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="text-xs text-green-700 font-bold uppercase">Paid So Far</div>
                        <div className="text-2xl font-mono font-bold text-green-700">
                            {totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {remaining > 0 ? (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-pulse">
                            <div className="text-xs text-red-700 font-bold uppercase">Remaining</div>
                            <div className="text-2xl font-mono font-bold text-red-700">
                                {remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-600 p-4 rounded-xl border border-blue-500 shadow-lg text-white">
                            <div className="text-xs text-blue-100 font-bold uppercase">Change Due</div>
                            <div className="text-4xl font-mono font-bold">
                                {change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Payment Count */}
                <div className="mt-auto pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Payments Added:</span>
                        <span className="font-bold text-slate-700">{payments.length}</span>
                    </div>
                </div>
            </div>

            {/* Right: Payment Entry */}
            <div className="w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-700">Add Payment</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400 hover:text-red-500"/>
                    </button>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {PAYMENT_METHODS.map(m => {
                        const Icon = m.icon;
                        return (
                            <button 
                                key={m.key}
                                onClick={() => setMethod(m.key)}
                                className={`py-3 rounded-lg font-bold text-sm border-2 transition-all flex flex-col items-center gap-1 ${
                                    method === m.key 
                                        ? `border-${m.color}-500 bg-${m.color}-50 text-${m.color}-700` 
                                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {m.label}
                            </button>
                        );
                    })}
                </div>
                
                {/* Amount Input */}
                <div className="relative mb-3">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">LKR</span>
                    <input 
                        ref={inputRef}
                        type="number" 
                        step="0.01"
                        value={currentAmount}
                        onChange={e => setCurrentAmount(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-14 pr-28 py-3 text-2xl font-bold font-mono border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="0.00"
                    />
                    <button 
                        onClick={addPayment}
                        disabled={!currentAmount || parseFloat(currentAmount) <= 0}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                
                {/* Additional Fields for Card/Transfer */}
                {method !== 'CASH' && (
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <input 
                            type="text"
                            value={referenceNo}
                            onChange={e => setReferenceNo(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Reference No."
                        />
                        {method === 'CARD' && (
                            <input 
                                type="text"
                                maxLength={4}
                                value={cardLast4}
                                onChange={e => setCardLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Last 4 Digits"
                            />
                        )}
                        {['CARD', 'TRANSFER'].includes(method) && (
                            <input 
                                type="text"
                                value={bankName}
                                onChange={e => setBankName(e.target.value)}
                                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Bank Name"
                            />
                        )}
                    </div>
                )}

                {/* Payment List Table */}
                <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-2 mb-4 custom-scroll">
                    {payments.length === 0 && (
                        <div className="text-center text-slate-400 py-10 text-sm">
                            No payments added yet. Add payments to complete the sale.
                        </div>
                    )}
                    {payments.map((p, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-2 border border-slate-100 hover:border-slate-200 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2 rounded-full">
                                    {getPaymentIcon(p.paymentType)}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{p.paymentType}</div>
                                    <div className="text-[10px] text-slate-400 flex gap-2">
                                        {p.referenceNo && <span>Ref: {p.referenceNo}</span>}
                                        {p.cardLast4 && <span>****{p.cardLast4}</span>}
                                        {p.bankName && <span>{p.bankName}</span>}
                                        {!p.referenceNo && !p.cardLast4 && !p.bankName && <span>No Reference</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-mono font-bold text-slate-700 text-lg">
                                    {p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <button 
                                    onClick={() => removePayment(i)} 
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Complete Button */}
                <button 
                    onClick={handleFinalize}
                    disabled={remaining > 0.01 || processing || payments.length === 0}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-xl flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin"/> Processing Transaction...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5"/> Complete Sale
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}