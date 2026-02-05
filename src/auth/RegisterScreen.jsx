import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserPlus, User, Mail, Lock, Phone, CreditCard, Store,
    Loader2, AlertCircle, CheckCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import bgImage from "../assets/images/registration-bg.png";
import { authService } from '../services/authService';

// Background Wrapper (Same as Login)
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
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        employeeId: '',
        branchId: ''
    });

    // Validation State
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [generalError, setGeneralError] = useState("");

    useEffect(() => {
        // Fetch branches for dropdown
        const loadBranches = async () => {
            try {
                const data = await authService.getBranches();
                setBranches(data || []);
            } catch (err) {
                console.error("Failed to load branches", err);
            }
        };
        loadBranches();
    }, []);

    // Validation Logic
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'fullName':
                if (!value.trim()) error = "Full Name is required";
                else if (value.length < 3) error = "Must be at least 3 chars";
                break;
            case 'username':
                if (!value.trim()) error = "Username is required";
                else if (value.length < 3 || value.length > 20) error = "3-20 characters required";
                break;
            case 'email':
                if (!value) error = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
                break;
            case 'password':
                if (!value) error = "Password is required";
                else if (value.length < 6) error = "Min 6 characters required";
                break;
            case 'phone':
                if (!value) error = "Phone is required";
                else if (!/^\+?[0-9]{10,15}$/.test(value)) error = "Invalid phone format (10-15 digits)";
                break;
            case 'employeeId':
                if (!value.trim()) error = "Employee ID is required";
                break;
            case 'branchId':
                if (!value) error = "Please select a branch";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error immediately on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");

        // Validate all fields
        const newErrors = {};
        let hasError = false;
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                hasError = true;
            }
        });

        if (hasError) {
            setErrors(newErrors);
            setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            return;
        }

        setLoading(true);
        try {
            await authService.registerUser(formData);
            // Navigate to login with success state
            navigate('/login', { state: { registrationSuccess: true } });
        } catch (err) {
            console.error(err);
            const backendMsg = err.response?.data?.message || err.message;

            // Check if parsing "FIELD: Message" format
            if (backendMsg && backendMsg.includes(": ")) {
                const parts = backendMsg.split(": ");
                const fieldKey = parts[0];
                const msg = parts.slice(1).join(": "); // Join back in case message has colons

                // Map backend keys to frontend form keys
                let targetField = "";
                if (fieldKey === "EMAIL") targetField = "email";
                else if (fieldKey === "USERNAME") targetField = "username";
                else if (fieldKey === "PHONE") targetField = "phone";
                else if (fieldKey === "EMPLOYEE_ID") targetField = "employeeId";

                if (targetField) {
                    setErrors(prev => ({ ...prev, [targetField]: msg }));
                    // Also clear general error to rely on field error
                    setGeneralError("");
                } else {
                    setGeneralError(backendMsg);
                }
            } else {
                setGeneralError(backendMsg || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Field Renderer Helper
    const renderField = (name, label, icon, type = "text", placeholder, options = null) => {
        const hasError = touched[name] && errors[name];
        const Icon = icon;

        return (
            <div className="relative mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{label}</label>
                <div className="relative group">
                    <Icon className={`absolute left-3 top-3 w-5 h-5 transition-all duration-300 ${hasError ? 'text-red-400' : 'text-slate-400 group-focus-within:text-brand'}`} />

                    {options ? (
                        <select
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-all text-sm appearance-none cursor-pointer ${hasError
                                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                                : 'border-slate-300 focus:border-brand'
                                }`}
                        >
                            <option value="">Select Branch</option>
                            {options.map(opt => (
                                <option key={opt.branchId || opt.id} value={opt.branchId || opt.id}>
                                    {opt.name || opt.branchName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            className={`w-full pl-10 pr-10 py-3 bg-white border rounded-lg focus:outline-none transition-all text-sm ${hasError
                                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                                : 'border-slate-300 focus:border-brand'
                                }`}
                        />
                    )}

                    {/* Error Alert Icon inside field */}
                    {hasError && (
                        <div className="absolute right-3 top-3 text-red-500 animate-in fade-in zoom-in duration-200">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {/* Absolute Error Message - No Layout Shift */}
                {hasError && (
                    <div className="absolute -bottom-5 left-1 text-[10px] font-bold text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200 z-10">
                        {errors[name]}
                    </div>
                )}
            </div>
        );
    };

    return (
        <BackgroundWrapper>
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">

                {/* SIDE BAR */}
                <div className="hidden md:flex w-4/12 bg-brand-deep p-8 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck className="w-8 h-8" />
                            <span className="font-bold text-xl tracking-tight">Smart Retail <span className="text-emerald-400">Pro</span></span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Join the Team.</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Create your secure profile to access the retail operations platform.
                        </p>
                    </div>
                    <div className="relative z-10 mt-auto opacity-80">
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
                            <UserPlus className="w-8 h-8 text-emerald-400" />
                            <div>
                                <p className="text-xs font-bold text-emerald-300">New Registration</p>
                                <p className="text-[10px] text-slate-300">Requires Manager Approval</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-brand/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-brand/20 rounded-full blur-xl"></div>
                </div>

                {/* FORM AREA */}
                <div className="w-full md:w-8/12 bg-pos-bg overflow-y-auto">
                    <div className="p-8 md:p-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-pos-text">Register Account</h3>
                            <Link to="/login" className="text-sm font-bold text-brand hover:underline">
                                Back to Login
                            </Link>
                        </div>

                        {generalError && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 animate-in shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span className="text-sm font-medium">{generalError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            {/* Full Name */}
                            <div className="col-span-2">
                                {renderField('fullName', 'Full Name', User, 'text', 'John Doe')}
                            </div>

                            {/* Username */}
                            {renderField('username', 'Username', User, 'text', 'johndoe')}

                            {/* Email */}
                            {renderField('email', 'Email Address', Mail, 'email', 'john@example.com')}

                            {/* Password */}
                            {renderField('password', 'Password', Lock, 'password', '••••••••')}

                            {/* Phone */}
                            {renderField('phone', 'Phone Number', Phone, 'tel', '+94 7X XXX XXXX')}

                            {/* Employee ID */}
                            {renderField('employeeId', 'Employee ID', CreditCard, 'text', 'EMP-001')}

                            {/* Branch */}
                            {renderField('branchId', 'Assigned Branch', Store, 'text', '', branches)}

                            {/* Submit Button */}
                            <div className="col-span-2 mt-4 pt-4 border-t border-slate-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Registration Request"}
                                </button>
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    By registering, you agree to the company's internal data policies.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </BackgroundWrapper>
    );
}
