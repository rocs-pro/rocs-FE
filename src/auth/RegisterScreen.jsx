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

}