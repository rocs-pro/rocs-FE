import React, { useState, useEffect } from 'react';
import { 
    Building2, User, Mail, Phone, IdCard, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, ArrowRight, Loader2 
} from 'lucide-react';
import { authService } from '../services/authService';

export default function RegisterScreen() {
  // STATE 
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  
  const [formData, setFormData] = useState({
      branchId: "",
      fullName: "",
      email: "",
      username: "",
      phone: "",
      employeeId: "",
      password: ""
  });

  // LOAD BRANCHES
  useEffect(() => {
      authService.getBranches()
        .then(data => setBranches(data))
        .catch(err => console.error("Failed to load branches", err));
  }, []);

  // HANDLERS
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validation
      if (formData.password !== confirmPass) {
          alert("Passwords do not match!");
          return;
      }
      if (!formData.branchId) {
          alert("Please select a branch.");
          return;
      }

      setLoading(true);
      try {
          await authService.registerUser(formData);
          setIsSuccess(true);
      } catch (error) {
          alert("Registration Failed: " + (error.message || "Unknown Error"));
      }
      setLoading(false);
  };

  // SUCCESS STATE 
  if (isSuccess) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful</h2>
                  <p className="text-slate-500 mb-8">
                      Your account has been created and is currently <span className="font-bold text-orange-500">Pending Admin Approval</span>. 
                      You will be notified once access is granted.
                  </p>
                  <button onClick={() => window.location.href = '/'} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      Return to Login <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      );
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Side: Branding */}
            <div className="hidden md:flex w-5/12 bg-blue-600 p-8 flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight">ROCS ERP</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Join the Team.</h2>
                    <p className="text-blue-100 text-sm leading-relaxed">
                        Create your secure account to access the Retail Operations Control System.
                    </p>
                </div>
                {/* Decorative Background Circles */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-500 rounded-full opacity-50"></div>
                <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-400 rounded-full opacity-50"></div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-7/12 p-8 md:p-10 bg-slate-50">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">New User Registration</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* 1. Branch Selection (Populated by Mock Service) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Branch</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <select 
                                name="branchId" 
                                value={formData.branchId} 
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none text-slate-700 font-medium"
                            >
                                <option value="">Select Branch...</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* 2. Full Name */}
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" name="fullName" required
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 3. Email */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type="email" name="email" required
                                    placeholder="john@rocs.com"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 4. Phone */}
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" name="phone" required
                                    placeholder="077XXXXXXX"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm font-mono"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 my-2"></div>

                    {/* 5. Employee ID & Username */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee ID</label>
                            <div className="relative">
                                {/* FIXED ICON HERE */}
                                <IdCard className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" name="employeeId" required
                                    placeholder="EMP-001"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm font-mono uppercase"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" name="username" required
                                    placeholder="johnd"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 6. Password Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type={showPass ? "text" : "password"} name="password" required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm font-mono"
                                    onChange={handleChange}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    type="password" required
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none transition-all text-sm font-mono ${confirmPass && confirmPass !== formData.password ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'}`}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                />
                                {confirmPass && confirmPass === formData.password && (
                                    <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register Account"}
                    </button>

                </form>
            </div>
        </div>
    </div>
  );
}