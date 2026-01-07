import React, { useState, useEffect, useRef } from 'react';
import { Crown, X, Search, User } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function LoyaltyModal({ onClose, onAttach }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
        const res = await posService.findCustomer(phone);
        setCustomer(res.data);
    } catch (err) {
        alert("Customer not found");
        setCustomer(null);
    }
    setLoading(false);
  };

}