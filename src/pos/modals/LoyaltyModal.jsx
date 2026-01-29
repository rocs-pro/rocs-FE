import React, { useState, useEffect, useRef } from 'react';
import { Crown, X, Search, User } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function LoyaltyModal({ onClose, onAttach }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
        const res = await posService.findCustomer(phone);
        setCustomer(res.data);
    } catch (err) {
        alert("Customer not found");
        setCustomer(null);
    }
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-purple-900 px-4 py-3 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-400"/> Loyalty Lookup</h3>
                <button onClick={onClose} className="text-purple-300 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Phone</label>
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input ref={inputRef} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-purple-500" placeholder="07XXXXXXXX" />
                    <button type="submit" disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-purple-700">
                        {loading ? '...' : <Search className="w-4 h-4"/>}
                    </button>
                </form>
                
                {customer && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 fade-enter-active">
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-200 p-2 rounded-full"><User className="w-5 h-5 text-purple-700"/></div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{customer.name}</h4>
                                <div className="text-xs text-slate-500 mt-0.5">Points: <span className="font-bold font-mono text-purple-700">{customer.points}</span></div>
                                <div className="text-xs text-slate-500">Tier: <span className="font-bold text-yellow-600 uppercase">{customer.tier}</span></div>
                            </div>
                        </div>
                        <button onClick={() => onAttach(customer)} className="w-full mt-3 bg-purple-600 text-white py-1.5 rounded text-xs font-bold uppercase tracking-wide hover:bg-purple-700">Attach to Bill</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );

}