import React, { useState, useEffect } from 'react';
import {
    Building2, User, Mail, Phone, IdCard, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, ArrowRight, Loader2, Shield, LayoutDashboard, BarChart3, Clock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [confirmPass, setConfirmPass] = useState("");
    const [errors, setErrors] = useState({});

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for this field if it exists
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.branchId) newErrors.branchId = "Please select a branch";

        if (!formData.fullName?.trim()) {
            newErrors.fullName = "Full Name is required";
        } else if (formData.fullName.length > 150) {
            newErrors.fullName = "Name must be under 150 characters";
        }

        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        } else if (formData.email.length > 150) {
            newErrors.email = "Email must be under 150 characters";
        }

        // Phone: Allow digits, +, -, space. Approx 10-15 chars.
        if (!formData.phone?.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^[\d\+\-\s]{10,15}$/.test(formData.phone)) {
            newErrors.phone = "Invalid phone (10-15 digits allowed)";
        }

        // Employee ID: Alphanumeric + dash
        if (!formData.employeeId?.trim()) {
            newErrors.employeeId = "Employee ID is required";
        } else if (!/^[a-zA-Z0-9\-]+$/.test(formData.employeeId)) {
            newErrors.employeeId = "Alphanumeric and dash only";
        } else if (formData.employeeId.length > 50) {
            newErrors.employeeId = "ID too long";
        }

        // Username: Alphanumeric + dot + underscore
        if (!formData.username?.trim()) {
            newErrors.username = "Username is required";
        } else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
            newErrors.username = "Letters, numbers, . and _ only";
        } else if (formData.username.length > 100) {
            newErrors.username = "Username must be under 100 characters";
        }

        // Password: At least 8 chars, 1 upper, 1 lower, 1 number
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Must be at least 8 chars";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Need Upper, Lower and Number";
        }

        if (formData.password !== confirmPass) {
            newErrors.confirmPass = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await authService.registerUser(formData);
            // setIsSuccess(true); // Removed local success state
            navigate('/login', { state: { registrationSuccess: true } });
        } catch (error) {
            // If the server returns field-specific errors, map them here if possible
            const msg = error.response?.data?.message || error.message;
            alert("Registration Failed: " + msg);
        }
        setLoading(false);
    };

    if (isSuccess) {
        return (
            <BackgroundWrapper>
                <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand to-emerald-400"></div>

                    <div className="mb-8 relative">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto relative z-10">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Registration Successful!</h2>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8">
                        <p className="text-slate-600 leading-relaxed">
                            Your account has been created and is currently
                            <span className="inline-block px-2 py-0.5 mx-1.5 bg-orange-100 text-orange-600 font-bold rounded text-sm border border-orange-200">
                                Pending Approval
                            </span>
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Please contact your branch manager or system administrator to activate your access.
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full group bg-slate-900 hover:bg-brand text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-200 hover:shadow-brand/25 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                        Return to Login
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

                    <div className="relative z-10 space-y-6 mt-auto mb-16">
                        <div className="flex items-start gap-4 group">
                            <div className="bg-white/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                                <LayoutDashboard className="w-5 h-5 text-blue-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Centralized Control</h4>
                                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">Manage inventory, sales, and staff from a single dashboard.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="bg-white/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                                <BarChart3 className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Smart Analytics</h4>
                                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">Real-time reporting and sales insights at your fingertips.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="bg-white/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
                                <Clock className="w-5 h-5 text-emerald-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">Real-time Updates</h4>
                                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">Instant synchronization across all branch locations.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="bg-white/10 p-2.5 rounded-full ring-1 ring-white/20">
                                <Shield className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Secure Access</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    System activity is monitored and logged for security.
                                </p>
                            </div>
                        </div>
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
                                <Building2 className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.branchId ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                <select name="branchId" value={formData.branchId} onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:ring-2 transition-all text-slate-700 font-medium ${errors.branchId ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-brand focus:ring-blue-100'}`}>
                                    <option value="">Select Branch...</option>
                                    {branches.map(b => (
                                        <option key={b.branchId || b.id} value={b.branchId || b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.branchId && <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.branchId}</p>}
                        </div>

                        {/* Name/Email/Phone Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <div className="relative group">
                                    <User className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.fullName ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type="text" name="fullName" value={formData.fullName} placeholder="John Doe" onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:border-brand text-sm ${errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-slate-300'}`} />
                                </div>
                                {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type="email" name="email" value={formData.email} placeholder="john@rocs.com" onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:border-brand text-sm ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-300'}`} />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <div className="relative group">
                                    <Phone className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.phone ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type="text" name="phone" value={formData.phone} placeholder="077..." onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:border-brand text-sm ${errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-300'}`} />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 my-2"></div>

                        {/* ID/User/Pass Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee ID</label>
                                <div className="relative group">
                                    <IdCard className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.employeeId ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type="text" name="employeeId" value={formData.employeeId} placeholder="EMP-01" onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:border-brand text-sm uppercase ${errors.employeeId ? 'border-red-300 focus:border-red-500' : 'border-slate-300'}`} />
                                </div>
                                {errors.employeeId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.employeeId}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                                <div className="relative group">
                                    <User className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.username ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type="text" name="username" value={formData.username} placeholder="user01" onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:border-brand text-sm ${errors.username ? 'border-red-300 focus:border-red-500' : 'border-slate-300'}`} />
                                </div>
                                {errors.username && <p className="text-red-500 text-xs mt-1 font-medium">{errors.username}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type={showPass ? "text" : "password"} name="password" value={formData.password} placeholder="••••••••" onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-3 bg-white border rounded-lg focus:border-brand text-sm ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-300'}`} />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-3 top-3 w-5 h-5 transition-colors ${errors.confirmPass ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />
                                    <input type="password" placeholder="••••••••" value={confirmPass} onChange={(e) => { setConfirmPass(e.target.value); if (errors.confirmPass) setErrors({ ...errors, confirmPass: undefined }); }}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-all text-sm ${errors.confirmPass ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-brand'}`} />
                                </div>
                                {errors.confirmPass && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPass}</p>}
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