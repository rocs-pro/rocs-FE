import React, { useState, useEffect, useRef } from 'react';
import { Tag, X, Search, Package, AlertCircle } from 'lucide-react';
import { posService } from '../../services/posService'; // Import Service

export default function PriceCheckModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(false);
    setResult(null);

    try {
        // API Call: Get Product by ID
        const res = await posService.getProduct(query);
        setResult(res.data); 
    } catch (err) {
        setError(true);
    }
    setLoading(false);
    setQuery("");
  };
}