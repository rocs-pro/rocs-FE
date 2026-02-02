import React, { useState, useEffect } from 'react';
import {
    Building2, User, Mail, Phone, IdCard, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, ArrowRight, Loader2
} from 'lucide-react';
import { authService } from '../services/authService';
import bgImage from '../assets/images/registration-bg.png';

const BackgroundWrapper = ({ children }) => (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={bgImage} alt="Background" className="w-full h-full object-cover blur-sm scale-110" />
            <div className="absolute inset-0 bg-brand-deep/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full flex justify-center">
            {children}
        </div>
    </div>
);

export default function RegisterScreen() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [confirmPass, setConfirmPass] = useState("");

    const [formData, setFormData] = useState({
        branchId: "", fullName: "", email: "", username: "", phone: "", employeeId: "", password: ""
    });

    useEffect(() => {
        const loadBranches = async () => {
            try {
                // Calls your backend endpoint
                const res = await authService.getBranches();
                const data = res.data || res;
                // Handle { data: [...] } or direct [...]
                const list = Array.isArray(data) ? data : (data.data || []); 
                setBranches(list);
            } catch (err) {
                console.error("Failed to load branches", err);
            }
        };
        loadBranches();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPass) { alert("Passwords do not match!"); return; }
        if (!formData.branchId) { alert("Please select a branch."); return; }

        setLoading(true);
        try {
            await authService.registerUser(formData);
            setIsSuccess(true);
        } catch (error) {
            alert("Registration Failed: " + (error.response?.data?.message || error.message));
        }
        setLoading(false);
    };

    if (isSuccess) {
        return (
            <BackgroundWrapper>
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-pos-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-pos-text mb-2">Registration Successful</h2>
                    <p className="text-slate-500 mb-8">
                        Your account is <span className="font-bold text-orange-500">Pending Approval</span>.
                    </p>
                    <button onClick={() => window.location.href = '/login'} className="w-full bg-brand-deep text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        Return to Login <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </BackgroundWrapper>
        );
    }

    return (
        <BackgroundWrapper>
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* SIDEBAR - Restored 'bg-brand-deep' */}
                <div className="hidden md:flex w-5/12 bg-brand-deep p-8 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck className="w-8 h-8" />
                            <span className="font-bold text-xl tracking-tight">Smart Retail <span className="text-green-400">Pro</span></span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Join the Team.</h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Create your secure account to access the Retail Operations Control System.
                        </p>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>

                {/* FORM AREA - Restored 'bg-pos-bg' */}
                <div className="w-full md:w-7/12 p-8 md:p-10 bg-pos-bg">
                    <h3 className="text-2xl font-bold text-pos-text mb-6">New User Registration</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Branch Select */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Branch</label>
                            <div className="relative group">
                                <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                <select name="branchId" value={formData.branchId} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium">
                                    <option value="">Select Branch...</option>
                                    {branches.map(b => (
                                        <option key={b.branchId || b.id} value={b.branchId || b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Name/Email/Phone Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type="text" name="fullName" value={formData.fullName} required placeholder="John Doe" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type="email" name="email" value={formData.email} required placeholder="john@rocs.com" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type="text" name="phone" value={formData.phone} required placeholder="077..." onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 my-2"></div>

                        {/* ID/User/Pass Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee ID</label>
                                <div className="relative group">
                                    <IdCard className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type="text" name="employeeId" value={formData.employeeId} required placeholder="EMP-01" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand text-sm uppercase" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type="text" name="username" value={formData.username} required placeholder="user01" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand text-sm" />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type={showPass ? "text" : "password"} name="password" value={formData.password} required placeholder="••••••••" onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-lg focus:border-brand text-sm" />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-brand" />
                                    <input type="password" required placeholder="••••••••" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-all text-sm ${confirmPass && confirmPass !== formData.password ? 'border-red-500' : 'border-slate-300 focus:border-brand'}`} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register Account"}
                        </button>
                    </form>
                </div>
            </div>
        </BackgroundWrapper>
    );
}