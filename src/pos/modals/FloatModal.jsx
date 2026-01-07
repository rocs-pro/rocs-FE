import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ChevronDown } from 'lucide-react';

export default function FloatModal({ onApprove }) {
  const [cashier, setCashier] = useState("Cashier 01");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!amount) return;
    setIsLoading(true);
    // Pass both cashier and amount back to POSScreen to handle API call
    onApprove(cashier, amount);
  };
}