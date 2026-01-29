import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Banknote, QrCode, X, CheckCircle, Wallet, Loader2, Building2, Hash } from 'lucide-react';

const LKR_DENOMINATIONS = [5000, 1000, 500, 100, 50, 20];
const SRI_LANKAN_BANKS = [
    { id: 'COM', name: 'Commercial Bank', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'HNB', name: 'Hatton National', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'SAMPATH', name: 'Sampath Bank', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'AMEX', name: 'Nations Trust (Amex)', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    { id: 'PEOPLES', name: 'Peoples Bank', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'BOC', name: 'Bank of Ceylon', color: 'bg-amber-100 text-amber-700 border-amber-200' }
];

export default function PaymentModal({ total, initialMethod = 'CASH', onClose, onProcess }) {
  const [activeTab, setActiveTab] = useState(initialMethod); 
  const [processing, setProcessing] = useState(false);
  
  // Cash state
  const [tendered, setTendered] = useState("");
  
  // Card state
  const [selectedBank, setSelectedBank] = useState(null);
  const [cardRef, setCardRef] = useState("");
  const [lastFour, setLastFour] = useState("");

  const inputRef = useRef(null);
  const cardRefInput = useRef(null);

  useEffect(() => {
    if (activeTab === 'CASH') inputRef.current?.focus();
  }, [activeTab]);

  // Actions
  const addCash = (amount) => {
    setTendered(prev => {
        const current = parseFloat(prev) || 0;
        return (current + amount).toString();
    });
    inputRef.current?.focus();
  };

  const handleConfirm = () => {
    // Cash validation
    if (activeTab === 'CASH') {
        if ((parseFloat(tendered) || 0) < total) {
            alert("Insufficient cash tendered!");
            return;
        }
    }

    // Card validation
    if (activeTab === 'CARD') {
        if (!selectedBank) {
            alert("Please select a Bank.");
            return;
        }
        if (!cardRef) {
            alert("Please enter the POS Trace/Reference Number.");
            return;
        }
    }

    setProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
        const paymentDetails = {
            method: activeTab,
            amount: total,
            tendered: activeTab === 'CASH' ? parseFloat(tendered) : total,
            change: activeTab === 'CASH' ? (parseFloat(tendered) - total) : 0,
            // Card Specifics
            bank: selectedBank?.name || null,
            cardRef: cardRef || null,
            lastFour: lastFour || null
        };
        onProcess(paymentDetails);
    }, 1000);
  };

  const changeDue = (parseFloat(tendered) || 0) - total;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="bg-white w-[900px] h-[600px] rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">
            
            {/* Left side summary */}
            <div className="w-4/12 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-[-40px] left-[-40px] w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Amount</h2>
                    <div className="text-5xl font-mono font-bold text-white mb-8 tracking-tighter">
                        <span className="text-xl text-slate-500 mr-2 align-top">LKR</span>
                        {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <Wallet className="w-5 h-5 text-blue-400" />
                            <span>Net Payable: <span className="text-white font-bold">{total.toLocaleString()}</span></span>
                        </div>
                        
                        {/* Dynamic summary based on active tab */}
                        {activeTab === 'CASH' && (
                            <div className="animate-in fade-in slide-in-from-left duration-300">
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Change Due</h3>
                                <div className={`text-4xl font-mono font-bold ${changeDue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {changeDue > 0 ? changeDue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                                </div>
                            </div>
                        )}

                        {activeTab === 'CARD' && selectedBank && (
                            <div className="animate-in fade-in slide-in-from-left duration-300 bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Selected Bank</h3>
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-yellow-400"/> {selectedBank.name}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side interface */}
            <div className="w-8/12 flex flex-col">
                
                {/* Tabs header */}
                <div className="flex border-b border-slate-100">
                    {['CASH', 'CARD', 'QR'].map((mode) => (
                        <button 
                            key={mode}
                            onClick={() => setActiveTab(mode)} 
                            className={`flex-1 py-5 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all
                            ${activeTab === mode ? 'bg-white border-b-4 border-blue-600 text-blue-700 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            {mode === 'CASH' && <Banknote className="w-4 h-4" />}
                            {mode === 'CARD' && <CreditCard className="w-4 h-4" />}
                            {mode === 'QR' && <QrCode className="w-4 h-4" />}
                            {mode} Payment
                        </button>
                    ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-8 bg-white overflow-y-auto custom-scroll">
                    
                    {/* Cash UI */}
                    {activeTab === 'CASH' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount Tendered</label>
                                <div className="flex items-center bg-white border-2 border-blue-100 rounded-2xl px-4 py-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                                    <span className="text-slate-400 font-bold mr-3 text-xl">LKR</span>
                                    <input 
                                        ref={inputRef}
                                        type="number" 
                                        value={tendered}
                                        onChange={(e) => setTendered(e.target.value)}
                                        className="w-full text-4xl font-mono font-bold text-slate-800 focus:outline-none placeholder-slate-200"
                                        placeholder="0.00"
                                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Quick Denominations</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {LKR_DENOMINATIONS.map(amount => (
                                        <button 
                                            key={amount}
                                            onClick={() => addCash(amount)}
                                            className="py-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all font-mono font-bold text-lg text-slate-600 shadow-sm"
                                        >
                                            {amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card UI */}
                    {activeTab === 'CARD' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            
                            {/* Bank selection grid */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Bank / Terminal</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {SRI_LANKAN_BANKS.map(bank => (
                                        <button
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank)}
                                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between
                                            ${selectedBank?.id === bank.id ? `ring-2 ring-offset-1 ring-blue-500 ${bank.color}` : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                        >
                                            <span className="font-bold text-sm">{bank.name}</span>
                                            {selectedBank?.id === bank.id && <CheckCircle className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card details inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Trace / Ref No</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input 
                                            ref={cardRefInput}
                                            type="text" 
                                            value={cardRef}
                                            onChange={(e) => setCardRef(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm font-mono font-bold focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                            placeholder="XXXXXX"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last 4 Digits (Opt)</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text" 
                                            maxLength="4"
                                            value={lastFour}
                                            onChange={(e) => setLastFour(e.target.value)}
                                            className="w-full border border-slate-300 rounded-lg py-2.5 pl-9 pr-3 text-sm font-mono font-bold focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                            placeholder="1234"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QR UI */}
                    {activeTab === 'QR' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in slide-in-from-right duration-300">
                            <div className="bg-white p-6 rounded-2xl border-2 border-red-500 shadow-xl relative">
                                {/* Dummy QR */}
                                <QrCode className="w-48 h-48 text-slate-900" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/90 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-red-600 border border-red-100 backdrop-blur-sm">
                                        LankaQR
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Scan to Pay</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Please ask the customer to scan this QR code using their banking app.</p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <button onClick={onClose} className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm uppercase">
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={processing}
                        className={`px-10 py-4 rounded-xl font-bold text-white shadow-xl flex items-center gap-3 transition-all active:scale-[0.98] ${
                            activeTab === 'CASH' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 
                            activeTab === 'CARD' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 
                            'bg-red-600 hover:bg-red-700 shadow-red-200'
                        }`}
                    >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        {processing ? "Processing..." : `Confirm ${activeTab}`}
                    </button>
                </div>

            </div>
        </div>
    </div>
  );
}