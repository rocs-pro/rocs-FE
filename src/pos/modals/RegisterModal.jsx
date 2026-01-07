import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function RegisterModal({ onClose }) {
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // API Call: Create Customer
        await posService.createCustomer(formData);
        alert("New Customer Registered Successfully!");
        onClose();
    } catch (err) {
        alert("Failed to register customer.");
    }
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
        <div className="bg-white w-96 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-blue-900 px-4 py-3 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2"><UserPlus className="w-5 h-5"/> New Customer</h3>
                <button onClick={onClose} className="text-blue-300 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        required
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input 
                        type="text" 
                        required
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500" 
                        placeholder="07XXXXXXXX"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input 
                        type="email" 
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full mt-2 bg-blue-600 text-white py-2.5 rounded font-bold text-sm hover:bg-blue-700 shadow-md">
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    </div>
  );

}