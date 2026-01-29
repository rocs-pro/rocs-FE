import React, { useState, useEffect } from 'react';
import {
    Building2, User, Mail, Phone, IdCard, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, ArrowRight, Loader2
} from 'lucide-react';
import { authService } from '../services/authService';

// IMPORT: The new background image
import bgImage from '../assets/images/registration-bg.png';

// COMPONENT: Background Wrapper with Blur
const BackgroundWrapper = ({ children }) => (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden">
        {/* 1. Background Image Layer */}
        <div className="absolute inset-0 z-0">
            <img src={bgImage} alt="Background" className="w-full h-full object-cover blur-sm scale-110" />
            <div className="absolute inset-0 bg-brand-deep/80 mix-blend-multiply"></div>
        </div>

        {/* 2. Content Layer */}
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
        authService.getBranches()
            .then(data => {
                console.log("Loaded branches:", data);
                // Ensure data is an array before setting
                if (Array.isArray(data)) {
                    setBranches(data);
                } else {
                    console.error("Expected array of branches but got:", data);
                    setBranches([]);
                }
            })
            .catch(err => console.error("Failed to load branches", err));
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
            alert("Registration Failed: " + (error.message || "Unknown Error"));
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
                        Your account has been created and is currently <span className="font-bold text-orange-500">Pending Admin Approval</span>.
                    </p>
                    <button onClick={() => window.location.href = '/'} className="w-full bg-brand-deep text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        Return to Login <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </BackgroundWrapper>
        );
    }

    return (
        <BackgroundWrapper>
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* SIDE BAR */}
                <div className="hidden md:flex w-5/12 bg-brand-deep p-8 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck className="w-8 h-8" />
                            <span className="font-bold text-xl tracking-tight">Smart Retail <span style={{ color: 'rgb(52 211 153 / var(--tw-text-opacity, 1))' }}>Pro</span></span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Join the Team.</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Create your secure account to access the Retail Operations Control System.
                        </p>
                    </div>

                    {/* CIRCLES SIDES BAR*/}
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-brand/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-brand/20 rounded-full blur-xl"></div>
                </div>

                {/* FORM AREA */}
                <div className="w-full md:w-7/12 p-8 md:p-10 bg-pos-bg">
                    <h3 className="text-2xl font-bold text-pos-text mb-6">New User Registration</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Branch Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Branch</label>
                            <div className="relative group">
                                <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                <select name="branchId" value={formData.branchId} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand focus:ring-2 focus:ring-blue-100 transition-all appearance-none text-slate-700 font-medium">
                                    <option value="">Select Branch...</option>
                                    {branches.map(b => (
                                        <option key={b.branchId || b.branch_id || b.id} value={b.branchId || b.branch_id || b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type="text" name="fullName" value={formData.fullName} required placeholder="John Doe" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm" />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type="email" name="email" value={formData.email} required placeholder="john@rocs.com" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm" />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type="text" name="phone" value={formData.phone} required placeholder="077XXXXXXX" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm font-mono" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 my-2"></div>

                        {/* Credentials */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee ID</label>
                                <div className="relative group">
                                    <IdCard className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type="text" name="employeeId" value={formData.employeeId} required placeholder="EMP-001" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm font-mono uppercase" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type="text" name="username" value={formData.username} required placeholder="johnd" onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type={showPass ? "text" : "password"} name="password" value={formData.password} required placeholder="••••••••" onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand transition-all text-sm font-mono" />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 transition-all duration-300 group-focus-within:text-brand group-focus-within:scale-110" />
                                    <input type="password" required placeholder="••••••••" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-all text-sm font-mono ${confirmPass && confirmPass !== formData.password ? 'border-pos-danger focus:border-pos-danger' : 'border-slate-300 focus:border-brand'}`} />
                                    {confirmPass && confirmPass === formData.password && (
                                        <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-pos-success" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={loading}
                            className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register Account"}
                        </button>

                    </form>
                </div>
            </div>
        </BackgroundWrapper>
    );
}
