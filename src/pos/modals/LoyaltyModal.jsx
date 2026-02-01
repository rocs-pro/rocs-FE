import React, { useState, useEffect, useRef } from 'react';
import { Crown, X, Search, User, Phone, Mail, Gift, Loader2 } from 'lucide-react';
import { posService } from '../../services/posService';

export default function LoyaltyModal({ onClose, onAttach }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!phone.trim()) return;
    
    setLoading(true);
    setError(null);
    setCustomer(null);

    try {
        const res = await posService.findCustomer(phone.trim());
        const data = res.data?.data || res.data;
        
        if (!data) {
            setError("Customer not found");
            return;
        }

        // Map to customers table structure
        setCustomer({
            id: data.customerId || data.id,
            code: data.code,
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
            city: data.city,
            loyaltyPoints: data.loyaltyPoints || data.loyalty_points || 0,
            totalPurchases: data.totalPurchases || data.total_purchases || 0,
            isActive: data.isActive !== false
        });
    } catch (err) {
        console.error("Customer search failed:", err);
        if (err.response?.status === 404) {
            setError("Customer not found. Try a different phone number.");
        } else {
            setError(err.response?.data?.message || "Failed to search customer");
        }
    } finally {
        setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
  };

  // Calculate loyalty tier based on points
  const getLoyaltyTier = (points) => {
    if (points >= 10000) return { name: 'PLATINUM', color: 'text-slate-600', bg: 'bg-slate-100' };
    if (points >= 5000) return { name: 'GOLD', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (points >= 1000) return { name: 'SILVER', color: 'text-gray-500', bg: 'bg-gray-100' };
    return { name: 'BRONZE', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-[420px] rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-purple-900 px-4 py-3 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400"/> Loyalty Lookup
                </h3>
                <button onClick={onClose} className="text-purple-300 hover:text-white transition-colors">
                    <X className="w-5 h-5"/>
                </button>
            </div>
            
            <div className="p-5">
                {/* Search Form */}
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Phone Number</label>
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <div className="flex-1 flex items-center border border-slate-300 rounded-lg px-3 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
                        <Phone className="w-4 h-4 text-slate-400 mr-2" />
                        <input 
                            ref={inputRef} 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 py-2 text-sm font-mono focus:outline-none" 
                            placeholder="07XXXXXXXX" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !phone.trim()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-center">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}
                
                {/* Customer Card */}
                {customer && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 animate-in fade-in duration-200">
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-200 p-2.5 rounded-full">
                                <User className="w-6 h-6 text-purple-700"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-lg">{customer.name}</h4>
                                {customer.code && (
                                    <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                        {customer.code}
                                    </span>
                                )}
                                
                                {/* Contact Info */}
                                <div className="mt-2 space-y-1 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        {customer.phone}
                                    </div>
                                    {customer.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-slate-400" />
                                            {customer.email}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Loyalty Info */}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="bg-white rounded-lg p-2 border border-purple-200">
                                        <div className="flex items-center gap-1 text-purple-600 mb-1">
                                            <Gift className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase">Points</span>
                                        </div>
                                        <div className="font-mono font-bold text-lg text-purple-700">
                                            {customer.loyaltyPoints.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-2 border border-purple-200">
                                        <div className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                                            Tier
                                        </div>
                                        <div className={`font-bold text-sm ${getLoyaltyTier(customer.loyaltyPoints).color}`}>
                                            <span className={`px-2 py-0.5 rounded ${getLoyaltyTier(customer.loyaltyPoints).bg}`}>
                                                {getLoyaltyTier(customer.loyaltyPoints).name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Total Purchases */}
                                {customer.totalPurchases > 0 && (
                                    <div className="mt-2 text-xs text-slate-500">
                                        Total Purchases: <span className="font-mono font-bold text-slate-700">
                                            LKR {customer.totalPurchases.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Attach Button */}
                        <button 
                            onClick={() => onAttach(customer)} 
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors shadow-md"
                        >
                            <Crown className="w-4 h-4" /> Attach to Bill
                        </button>
                    </div>
                )}
                
                {/* Empty State */}
                {!customer && !error && !loading && (
                    <div className="text-center py-8 text-slate-400">
                        <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Enter a phone number to search</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}