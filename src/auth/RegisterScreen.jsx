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

}