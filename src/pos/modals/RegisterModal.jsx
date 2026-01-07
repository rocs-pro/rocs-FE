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

}