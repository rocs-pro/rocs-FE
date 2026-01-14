import React, { useState, useEffect } from 'react';
import { 
    Building2, User, Mail, Phone, BadgeId, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, ArrowRight, Loader2 
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

  // Load Branches on Mount
  useEffect(() => {
      authService.getBranches().then(data => setBranches(data));
  }, []);

  // HANDLERS
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Basic Validation
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
          alert("Registration Failed.");
      }
      setLoading(false);
  };

  // SUCCESS VIEW
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

}